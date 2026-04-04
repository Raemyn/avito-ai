import { useEffect, useMemo, useState } from "react";
import {
    ActionIcon,
    Box,
    Button,
    Checkbox,
    Collapse,
    Divider,
    Flex,
    Menu,
    Paper,
    Switch,
    Text,
    TextInput,
    Title,
} from "@mantine/core";
import {
    IconChevronDown,
    IconChevronLeft,
    IconChevronRight,
    IconLayoutGrid,
    IconList,
    IconPhoto,
    IconSearch,
} from "@tabler/icons-react";
import AdsHeader from "./AdsHeader";

type AdItem = {
    category: string;
    title: string;
    price: string;
    needsFix?: boolean;
    createdAt: number;
};

type SortMode =
    | "new"
    | "old"
    | "cheap"
    | "expensive"
    | "title_asc"
    | "title_desc";

const AdsListPage = () => {
    const [view, setView] = useState<"grid" | "list">("grid");
    const [sortMode, setSortMode] = useState<SortMode>("new");
    const [categoriesOpen, setCategoriesOpen] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [onlyNeedsFix, setOnlyNeedsFix] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    const categories = ["Авто", "Электроника", "Недвижимость"];
    const adsPerPage = view === "list" ? 4 : 10;
    const ads: AdItem[] = [
        { category: "Электроника", title: "Наушники", price: "2990 ₽", createdAt: 5 },
        { category: "Авто", title: "Volkswagen Polo", price: "1100000 ₽", needsFix: true, createdAt: 4 },
        { category: "Недвижимость", title: "Студия, 25м²", price: "15000000 ₽", createdAt: 3 },
        { category: "Недвижимость", title: "1-кк, 44м²", price: "19000000 ₽", needsFix: true, createdAt: 2 },
        { category: "Электроника", title: "MacBook Pro 16”", price: "64000 ₽", needsFix: true, createdAt: 1 },
        { category: "Авто", title: "Omoda C5", price: "2900000 ₽", createdAt: 6 },
        { category: "Электроника", title: "iPad Air 11, 2024 г.", price: "37000 ₽", createdAt: 7 },
        { category: "Электроника", title: "MAJOR VI", price: "20000 ₽", createdAt: 8 },
        { category: "Авто", title: "Toyota Camry", price: "3900000 ₽", needsFix: true, createdAt: 9 },
        { category: "Электроника", title: "iPhone 17 Pro Max", price: "107000 ₽", createdAt: 10 },
        { category: "Электроника", title: "iPhone 17 Pro Max", price: "107000 ₽", createdAt: 11 },
    ];

    const parsePrice = (price: string) => Number(price.replace(/[^\d]/g, "")) || 0;

    const normalize = (value: string) => value.toLowerCase().replace(/\s+/g, " ").trim();

    const toggleCategory = (cat: string) => {
        setSelectedCategories((prev) =>
            prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
        );
        setCurrentPage(1);
    };

    const resetFilters = () => {
        setSelectedCategories([]);
        setCategoriesOpen(false);
        setOnlyNeedsFix(false);
        setSortMode("new");
        setSearchTerm("");
        setCurrentPage(1);
    };

    const filteredAds = useMemo(() => {
        const query = normalize(searchTerm);

        return ads.filter((ad) => {
            const categoryOk =
                selectedCategories.length === 0 || selectedCategories.includes(ad.category);

            const fixOk = !onlyNeedsFix || ad.needsFix;

            const searchOk = query.length === 0 || normalize(ad.title).includes(query);

            return categoryOk && fixOk && searchOk;
        });
    }, [searchTerm, selectedCategories, onlyNeedsFix]);

    const sortedAds = useMemo(() => {
        const list = [...filteredAds];

        switch (sortMode) {
            case "cheap":
                list.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
                break;

            case "expensive":
                list.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
                break;

            case "new":
                list.sort((a, b) => b.createdAt - a.createdAt);
                break;

            case "old":
                list.sort((a, b) => a.createdAt - b.createdAt);
                break;

            case "title_asc":
                list.sort((a, b) => a.title.localeCompare(b.title));
                break;

            case "title_desc":
                list.sort((a, b) => b.title.localeCompare(a.title));
                break;
        }

        return list;
    }, [filteredAds, sortMode]);

    const totalPages = Math.ceil(sortedAds.length / adsPerPage);

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(1);
        }
    }, [currentPage, totalPages]);

    const displayedAds = sortedAds.slice(
        (currentPage - 1) * adsPerPage,
        currentPage * adsPerPage
    );

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    const getVisiblePages = () => {
        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        if (currentPage <= 3) {
            return [1, 2, 3, 4, 5];
        }

        if (currentPage >= totalPages - 2) {
            return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        }

        return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
    };

    const visiblePages = getVisiblePages();

    const sortLabelMap = {
        new: "По новизне (сначала новые)",
        old: "По новизне (сначала старые)",
        cheap: "По цене (сначала дешевле)",
        expensive: "По цене (сначала дороже)",
        title_asc: "По названию (А → Я)",
        title_desc: "По названию (Я → А)",
    };

    const sortLabel = sortLabelMap[sortMode];
    return (
        <Box pt={10} pl={32} pr={32} bg="#f7f5f8">
            <AdsHeader />

            <main>
                <Paper mt={16} radius={8} p={12} bg="#fff" h={56}>
                    <Flex align="center">
                        <TextInput
                            mr={24}
                            placeholder="Найти объявление..."
                            radius={8}
                            w={958}
                            value={searchTerm}
                            onChange={(event) => {
                                setSearchTerm(event.currentTarget.value);
                                setCurrentPage(1);
                            }}
                            rightSection={<IconSearch size={14} height={31} />}
                            styles={{
                                input: {
                                    border: "none",
                                    outline: "none",
                                    backgroundColor: "#f7f5f8",
                                    fontWeight: 400,
                                    fontSize: "14px",
                                    paddingBottom: "6px",
                                    lineHeight: "157%",
                                    color: "#707176",
                                },
                            }}
                        />

                        <Paper bg="#f7f5f8" radius={8} mr={16}>
                            <Flex gap={8} h={32} align="center" justify="center">
                                <ActionIcon
                                    pl={4}
                                    bg="#f7f5f8"
                                    variant="subtle"
                                    onClick={() => setView("grid")}
                                    aria-pressed={view === "grid"}
                                    style={{
                                        borderRadius: 8,
                                    }}
                                >
                                    <IconLayoutGrid
                                        size={22}
                                        color={view === "grid" ? "#1890ff" : "#848388"}
                                    />
                                </ActionIcon>

                                <Divider color="#fff" h={28} orientation="vertical" />

                                <ActionIcon
                                    pr={4}
                                    bg="#f7f5f8"
                                    variant="subtle"
                                    onClick={() => setView("list")}
                                    aria-pressed={view === "list"}
                                    style={{
                                        borderRadius: 8,
                                    }}
                                >
                                    <IconList
                                        size={22}
                                        color={view === "list" ? "#1890ff" : "#848388"}
                                    />
                                </ActionIcon>
                            </Flex>
                        </Paper>

                        <Menu>
                            <Menu.Target>
                                <Button
                                    color="#000"
                                    bg="#f7f5f8"
                                    w={240}
                                    h={32}
                                    variant="outline"
                                    styles={{
                                        root: {
                                            fontSize: "14px",
                                            border: "none",
                                            borderRadius: "8px",
                                            alignSelf: "center",
                                            textAlign: "center",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            padding: "0 4px",
                                            height: 22,
                                        },
                                    }}
                                    rightSection={<IconChevronDown size={16} color="#000" />}
                                >
                                    <Text pl={12} lts={0.2} bg="#fff" h={22} fw={400} fz={14} c="#000">
                                        {sortLabel}
                                    </Text>
                                </Button>
                            </Menu.Target>

                            <Menu.Dropdown>
                                <Menu.Label>Название</Menu.Label>
                                <Menu.Item onClick={() => { setSortMode("title_asc"); setCurrentPage(1); }}>
                                    А → Я
                                </Menu.Item>
                                <Menu.Item onClick={() => { setSortMode("title_desc"); setCurrentPage(1); }}>
                                    Я → А
                                </Menu.Item>

                                <Menu.Divider />

                                <Menu.Label>Новизна</Menu.Label>
                                <Menu.Item onClick={() => { setSortMode("new"); setCurrentPage(1); }}>
                                    Сначала новые
                                </Menu.Item>
                                <Menu.Item onClick={() => { setSortMode("old"); setCurrentPage(1); }}>
                                    Сначала старые
                                </Menu.Item>

                                <Menu.Divider />

                                <Menu.Label>Цена</Menu.Label>
                                <Menu.Item onClick={() => { setSortMode("cheap"); setCurrentPage(1); }}>
                                    Сначала дешевле
                                </Menu.Item>
                                <Menu.Item onClick={() => { setSortMode("expensive"); setCurrentPage(1); }}>
                                    Сначала дороже
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Flex>
                </Paper>

                <Flex mt={18} gap={24} align="flex-start">
                    <Flex gap={10} direction="column">
                        <Flex p={16} w={256} bg="#fff" direction="column">
                            <Title order={3} fw={500} fz={16}>
                                Фильтры
                            </Title>

                            <Box w={240} mt={7}>
                                <Button
                                    fullWidth
                                    variant="outline"
                                    radius={8}
                                    h={32}
                                    fz={14}
                                    justify="space-between"
                                    fw={400}
                                    p={0}
                                    c="#000"
                                    onClick={() => setCategoriesOpen((o) => !o)}
                                    rightSection={
                                        <IconChevronDown
                                            size={18}
                                            style={{
                                                marginRight: "14px",
                                                transform: categoriesOpen ? "rotate(180deg)" : "rotate(0deg)",
                                                transition: "0.2s",
                                            }}
                                        />
                                    }
                                    styles={{
                                        root: {
                                            border: "none",
                                            justifyContent: "space-between",
                                            paddingLeft: 12,
                                            paddingRight: 12,
                                        },
                                    }}
                                >
                                    Категория
                                </Button>

                                <Collapse expanded={categoriesOpen}>
                                    <Paper mt={5} p={0} radius={8}>
                                        {categories.map((cat) => (
                                            <Checkbox
                                                key={cat}
                                                label={cat}
                                                checked={selectedCategories.includes(cat)}
                                                onChange={() => toggleCategory(cat)}
                                                mb={8}
                                                styles={{
                                                    label: {
                                                        fontSize: 14,
                                                        letterSpacing: 0.3,
                                                    },
                                                }}
                                            />
                                        ))}
                                    </Paper>
                                </Collapse>
                            </Box>

                            <Divider my="sm" />

                            <Flex align="center" gap={8} justify="space-between">
                                <Title fz={14} fw={600} order={3}>
                                    Только требующие <br /> доработок
                                </Title>

                                <Switch
                                    checked={onlyNeedsFix}
                                    onChange={(event) => setOnlyNeedsFix(event.currentTarget.checked)}
                                    size="md"
                                    onLabel=""
                                    offLabel=""
                                    styles={{
                                        track: {
                                            width: 44,
                                            height: 22,
                                            borderRadius: 23,
                                            backgroundColor: onlyNeedsFix ? "#bdbdbd" : "#e9e9e9",
                                        },
                                        thumb: {
                                            width: 18,
                                            height: 18,
                                            borderRadius: 16,
                                            backgroundColor: "#fff",
                                            border: "none",
                                            boxShadow: "0 2px 4px 0 rgba(0, 35, 11, 0.2)",
                                        },
                                    }}
                                />
                            </Flex>
                        </Flex>

                        <Button
                            onClick={resetFilters}
                            styles={{
                                root: {
                                    borderRadius: 8,
                                    padding: "12px",
                                    width: 256,
                                    height: 41,
                                    fontWeight: 400,
                                    fontSize: 14,
                                    color: "#848388",
                                    backgroundColor: "#fff",
                                },
                            }}
                        >
                            Сбросить фильтры
                        </Button>
                    </Flex>

                    <Flex direction="column" flex={1}>
                        {view === "grid" ? (
                            <Box
                                style={{
                                    marginRight: "2px",
                                    display: "grid",
                                    gridTemplateColumns: "repeat(5, 200px)",
                                    columnGap: "13.75px",
                                    rowGap: "12px",
                                    justifyContent: "start",
                                }}
                            >
                                {displayedAds.map((ad, index) => (
                                    <Paper
                                        key={index}
                                        radius={16}
                                        w={200}
                                        h={268}
                                        p={0}
                                        bg="#fff"
                                        style={{
                                            overflow: "hidden",
                                            position: "relative",
                                        }}
                                    >
                                        <Box
                                            h={150}
                                            w={200}
                                            style={{
                                                overflow: "hidden",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                backgroundColor: "#e9e9e9",
                                            }}
                                        >
                                            <IconPhoto size={32} color="#9b9b9b" />
                                        </Box>

                                        <Box
                                            h={22}
                                            style={{
                                                position: "absolute",
                                                top: 140,
                                                left: 12,
                                                border: "1px solid #d9d9d9",
                                                borderRadius: 6,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "flex-start",
                                                paddingLeft: 12,
                                                paddingRight: 12,
                                                backgroundColor: "#fff",
                                                zIndex: 2,
                                                letterSpacing: 0.3,
                                            }}
                                        >
                                            <Text fz={14} c="#000">
                                                {ad.category}
                                            </Text>
                                        </Box>

                                        <Box p={16} pr={28} pt={21}>
                                            <Text
                                                w={168}
                                                h={24}
                                                mb={5}
                                                fz={16}
                                                fw={400}
                                                lh="24px"
                                                c="#000"
                                            >
                                                {ad.title}
                                            </Text>

                                            <Text fz={16} fw={600} lh={1.4} c="rgba(0, 0, 0, 0.45)">
                                                {ad.price}
                                            </Text>

                                            {ad.needsFix && (
                                                <Paper radius={8} bg="#f9f1e6" pl={9} p={2} mt={4}>
                                                    <Flex align="center" gap={6}>
                                                        <Box
                                                            w={6}
                                                            h={6}
                                                            bg="#faad14"
                                                            style={{ borderRadius: "50%" }}
                                                        />
                                                        <Text fw={400} fz={14} c="#faad14">
                                                            Требует доработок
                                                        </Text>
                                                    </Flex>
                                                </Paper>
                                            )}
                                        </Box>
                                    </Paper>
                                ))}
                            </Box>
                        ) : (
                            <Box
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr",
                                    gap: "12px",
                                    width: "100%",
                                }}
                            >
                                {displayedAds.map((ad, index) => (
                                    <Paper
                                        key={index}
                                        radius={16}
                                        w="100%"
                                        h={132}
                                        p={0}
                                        bg="#fff"
                                        style={{
                                            border: "1px solid #f0f0f0",
                                            boxSizing: "border-box",
                                            overflow: "hidden",
                                        }}
                                    >
                                        <Flex h="100%">
                                            <Box
                                                w={180}
                                                h="100%"
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    backgroundColor: "#e9e9e9",
                                                    flexShrink: 0,
                                                }}
                                            >
                                                <IconPhoto size={36} color="#9b9b9b" />
                                            </Box>

                                            <Box
                                                style={{
                                                    flex: 1,
                                                    height: "100%",
                                                    padding: "16px 16px 16px 24px",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    justifyContent: "space-between",
                                                }}
                                            >
                                                <Box>
                                                    <Text fz={14} fw={400} c="#848388" mb={6}>
                                                        {ad.category}
                                                    </Text>

                                                    <Text fz={15} fw={400} c="#000" mb={6}>
                                                        {ad.title}
                                                    </Text>

                                                    <Text fz={15} fw={600} c="rgba(0, 0, 0, 0.75)">
                                                        {ad.price}
                                                    </Text>
                                                </Box>

                                                {ad.needsFix && (
                                                    <Flex align="center" gap={6}>
                                                        <Box
                                                            w={6}
                                                            h={6}
                                                            bg="#faad14"
                                                            style={{ borderRadius: "50%" }}
                                                        />
                                                        <Text fw={400} fz={13} c="#faad14">
                                                            Требует доработок
                                                        </Text>
                                                    </Flex>
                                                )}
                                            </Box>
                                        </Flex>
                                    </Paper>
                                ))}
                            </Box>
                        )}

                        {totalPages > 1 && (
                            <Flex mt={10} justify="flex-start" align="center" gap={8}>
                                <ActionIcon
                                    onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                                    aria-label="Предыдущая страница"
                                    style={{
                                        border: "1px solid #d9d9d9",
                                        borderRadius: 8,
                                        width: 32,
                                        height: 32,
                                        background: "#fff",
                                        flexShrink: 0,
                                        opacity: currentPage === 1 ? 0.45 : 1,
                                        cursor: currentPage === 1 ? "default" : "pointer",
                                    }}
                                >
                                    <IconChevronLeft size={16} color="#000" />
                                </ActionIcon>

                                {visiblePages.map((page) => (
                                    <Button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        style={{
                                            border:
                                                currentPage === page
                                                    ? "1px solid #1890ff"
                                                    : "1px solid #d9d9d9",
                                            borderRadius: 8,
                                            width: 32,
                                            height: 32,
                                            padding: 0,
                                            background: "#fff",
                                            fontWeight: 500,
                                            fontSize: 14,
                                            lineHeight: "157%",
                                            textAlign: "center",
                                            color: currentPage === page ? "#1890ff" : "#000",
                                        }}
                                    >
                                        {page}
                                    </Button>
                                ))}

                                <ActionIcon
                                    onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                                    aria-label="Следующая страница"
                                    style={{
                                        border: "1px solid #d9d9d9",
                                        borderRadius: 8,
                                        width: 32,
                                        height: 32,
                                        background: "#fff",
                                        flexShrink: 0,
                                        opacity: currentPage === totalPages ? 0.45 : 1,
                                        cursor: currentPage === totalPages ? "default" : "pointer",
                                    }}
                                >
                                    <IconChevronRight size={16} color="#000" />
                                </ActionIcon>
                            </Flex>
                        )}
                    </Flex>
                </Flex>
            </main>
        </Box>
    );
};

export default AdsListPage;