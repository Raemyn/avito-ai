import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getItems } from "../../api/items";
import {
    ActionIcon,
    Box,
    Button,
    Checkbox,
    Divider,
    Flex,
    Menu,
    Pagination,
    Paper,
    Switch,
    Text,
    TextInput,
    Title,
    Transition,
} from "@mantine/core";
import {
    IconChevronDown,
    IconLayoutGrid,
    IconList,
    IconPhoto,
    IconSearch,
} from "@tabler/icons-react";
import AdsHeader from "./AdsHeader";

type SortMode =
    | "new"
    | "old"
    | "cheap"
    | "expensive"
    | "title_asc"
    | "title_desc";

type ApiCategory = "auto" | "real_estate" | "electronics";

type ApiItem = {
    id: number;
    category: ApiCategory;
    title: string;
    price: number;
    needsRevision: boolean;
};

type ApiItemsResponse = {
    items: ApiItem[];
    total: number;
};

type UiCategory = "Авто" | "Электроника" | "Недвижимость";

type UiAd = {
    id: number;
    category: UiCategory;
    title: string;
    price: string;
    needsFix: boolean;
};

const categories: UiCategory[] = ["Авто", "Электроника", "Недвижимость"];
const adsPerPage = 10;

const mapCategory = (category: ApiCategory): UiCategory => {
    switch (category) {
        case "auto":
            return "Авто";
        case "real_estate":
            return "Недвижимость";
        case "electronics":
            return "Электроника";
    }
};

const mapCategoryToApi = (category: UiCategory): ApiCategory => {
    switch (category) {
        case "Авто":
            return "auto";
        case "Недвижимость":
            return "real_estate";
        case "Электроника":
            return "electronics";
    }
};

const AdsListPage = () => {
    const navigate = useNavigate();

    const [view, setView] = useState<"grid" | "list">("grid");
    const [sortMode, setSortMode] = useState<SortMode>("new");
    const [categoriesOpen, setCategoriesOpen] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<UiCategory[]>([]);
    const [onlyNeedsFix, setOnlyNeedsFix] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    const pageSize = view === "list" ? 4 : adsPerPage;

    const apiCategories = useMemo(
        () => selectedCategories.map((c) => mapCategoryToApi(c)),
        [selectedCategories]
    );

    const sortParams = useMemo(() => {
        switch (sortMode) {
            case "new":
                return { sortColumn: "createdAt" as const, sortDirection: "desc" as const };
            case "old":
                return { sortColumn: "createdAt" as const, sortDirection: "asc" as const };
            case "title_asc":
                return { sortColumn: "title" as const, sortDirection: "asc" as const };
            case "title_desc":
                return { sortColumn: "title" as const, sortDirection: "desc" as const };
            case "cheap":
                return { sortColumn: "price" as const, sortDirection: "asc" as const };
            case "expensive":
                return { sortColumn: "price" as const, sortDirection: "desc" as const };
        }
    }, [sortMode]);

    const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
        queryKey: [
            "ads",
            searchTerm,
            selectedCategories,
            onlyNeedsFix,
            sortMode,
            currentPage,
            view,
        ],
        queryFn: async (): Promise<ApiItemsResponse> => {
            const params = {
                q: searchTerm.trim() || undefined,
                limit: pageSize,
                skip: (currentPage - 1) * pageSize,
                needsRevision: onlyNeedsFix ? true : undefined,
                categories: apiCategories.length ? apiCategories.join(",") : undefined,
                ...sortParams,
            };

            return (await getItems(params)) as ApiItemsResponse;
        },
        staleTime: 60_000,
        placeholderData: (previousData) => previousData,
    });

    const ads: UiAd[] = useMemo(() => {
        return (data?.items ?? []).map((item) => ({
            id: item.id,
            category: mapCategory(item.category),
            title: item.title,
            price: `${item.price} ₽`,
            needsFix: item.needsRevision,
        }));
    }, [data]);

    const totalAdsCount = data?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(totalAdsCount / pageSize));

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedCategories, onlyNeedsFix, sortMode, view]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const sortLabelMap: Record<SortMode, string> = {
        new: "По новизне (сначала новые)",
        old: "По новизне (сначала старые)",
        cheap: "По цене (сначала дешевле)",
        expensive: "По цене (сначала дороже)",
        title_asc: "По названию (А → Я)",
        title_desc: "По названию (Я → А)",
    };

    const sortLabel = sortLabelMap[sortMode];

    if (isLoading) {
        return (
            <Box pt={40} px={32} bg="#f7f5f8" mih="100vh">
                <Text>Загрузка объявлений...</Text>
            </Box>
        );
    }

    if (isError) {
        return (
            <Box pt={40} px={32} bg="#f7f5f8" mih="100vh">
                <Text c="red">Не удалось загрузить объявления.</Text>
                <Button mt={16} type="button" onClick={() => refetch()}>
                    Повторить
                </Button>
                <Text mt={8} fz={12} c="#666">
                    {error instanceof Error ? error.message : "Неизвестная ошибка"}
                </Text>
            </Box>
        );
    }

    return (
        <Box pt={10} pl={32} pr={32} bg="#f7f5f8">
            <AdsHeader count={totalAdsCount} />

            <main>
                <Paper mt={16} radius={8} p={12} bg="#fff" h={56}>
                    <Flex align="center">
                        <TextInput
                            mr={24}
                            placeholder="Найти объявление..."
                            radius={8}
                            w={958}
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.currentTarget.value)}
                            rightSection={<IconSearch size={14} />}
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
                                    style={{ borderRadius: 8 }}
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
                                    style={{ borderRadius: 8 }}
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
                                    type="button"
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
                                    <Text
                                        pl={12}
                                        lts={0.2}
                                        bg="#fff"
                                        h={22}
                                        fw={400}
                                        fz={14}
                                        c="#000"
                                    >
                                        {sortLabel}
                                    </Text>
                                </Button>
                            </Menu.Target>

                            <Menu.Dropdown>
                                <Menu.Label>Название</Menu.Label>
                                <Menu.Item onClick={() => setSortMode("title_asc")}>
                                    А → Я
                                </Menu.Item>
                                <Menu.Item onClick={() => setSortMode("title_desc")}>
                                    Я → А
                                </Menu.Item>

                                <Menu.Divider />

                                <Menu.Label>Новизна</Menu.Label>
                                <Menu.Item onClick={() => setSortMode("new")}>
                                    Сначала новые
                                </Menu.Item>
                                <Menu.Item onClick={() => setSortMode("old")}>
                                    Сначала старые
                                </Menu.Item>

                                <Menu.Divider />

                                <Menu.Label>Цена</Menu.Label>
                                <Menu.Item onClick={() => setSortMode("cheap")}>
                                    Сначала дешевле
                                </Menu.Item>
                                <Menu.Item onClick={() => setSortMode("expensive")}>
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
                                    type="button"
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

                                <Transition
                                    mounted={categoriesOpen}
                                    transition="fade"
                                    duration={200}
                                    timingFunction="ease"
                                >
                                    {(styles) => (
                                        <Paper mt={5} p={0} radius={8} style={styles}>
                                            {categories.map((cat) => (
                                                <Checkbox
                                                    key={cat}
                                                    label={cat}
                                                    checked={selectedCategories.includes(cat)}
                                                    onChange={(event) => {
                                                        const checked = event.currentTarget.checked;
                                                        setSelectedCategories((prev) =>
                                                            checked
                                                                ? [...prev, cat]
                                                                : prev.filter((c) => c !== cat)
                                                        );
                                                        setCurrentPage(1);
                                                    }}
                                                    mb={8}
                                                    styles={{
                                                        label: { fontSize: 14, letterSpacing: 0.3 },
                                                    }}
                                                />
                                            ))}
                                        </Paper>
                                    )}
                                </Transition>
                            </Box>

                            <Divider my="sm" />

                            <Flex align="center" gap={8} justify="space-between">
                                <Title fz={14} fw={600} order={3}>
                                    Только требующие <br /> доработок
                                </Title>
                                <Switch
                                    checked={onlyNeedsFix}
                                    onChange={(e) => setOnlyNeedsFix(e.currentTarget.checked)}
                                    size="md"
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
                                            boxShadow: "0 2px 4px rgba(0, 35, 11, 0.2)",
                                        },
                                    }}
                                />
                            </Flex>
                        </Flex>

                        <Button
                            type="button"
                            onClick={() => {
                                setSelectedCategories([]);
                                setCategoriesOpen(false);
                                setOnlyNeedsFix(false);
                                setSortMode("new");
                                setSearchTerm("");
                                setCurrentPage(1);
                                setView("grid");
                            }}
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
                        {ads.length === 0 ? (
                            <Paper p={24} radius={16} bg="#fff">
                                <Text c="#707176">Ничего не найдено.</Text>
                            </Paper>
                        ) : view === "grid" ? (
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
                                {ads.map((ad) => (
                                    <Paper
                                        key={ad.id}
                                        onClick={() => navigate(`/ads/${ad.id}`)}
                                        radius={16}
                                        w={200}
                                        h={268}
                                        p={0}
                                        bg="#fff"
                                        style={{
                                            overflow: "hidden",
                                            position: "relative",
                                            cursor: "pointer",
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
                                                lineClamp={1}
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
                                {ads.map((ad) => (
                                    <Paper
                                        key={ad.id}
                                        onClick={() => navigate(`/ads/${ad.id}`)}
                                        radius={16}
                                        w="100%"
                                        h={132}
                                        p={0}
                                        bg="#fff"
                                        style={{
                                            border: "1px solid #f0f0f0",
                                            boxSizing: "border-box",
                                            overflow: "hidden",
                                            cursor: "pointer",
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
                                                    <Text fz={15} fw={400} c="#000" mb={6} lineClamp={2}>
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

                        {totalAdsCount > pageSize && (
                            <Flex mt={16} justify="flex-start" align="center" gap={10}>
                                <Pagination
                                    value={currentPage}
                                    onChange={setCurrentPage}
                                    total={totalPages}
                                    siblings={1}
                                    boundaries={1}
                                    radius={8}
                                    color="#1890ff"
                                />

                                {isFetching && (
                                    <Text fz={12} c="#707176">
                                        Обновление...
                                    </Text>
                                )}
                            </Flex>
                        )}
                    </Flex>
                </Flex>
            </main>
        </Box>
    );
};

export default AdsListPage;