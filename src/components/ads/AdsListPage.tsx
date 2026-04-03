import { useState } from "react";
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
import { IconChevronDown, IconLayoutGrid, IconList, IconPhoto, IconSearch } from "@tabler/icons-react";
import AdsHeader from "./AdsHeader";

type AdItem = {
    category: string;
    title: string;
    price: string;
    needsFix?: boolean;
};

const AdsListPage = () => {
    const [view, setView] = useState<"grid" | "list">("grid");
    const [sort, setSort] = useState("По новизне (сначала новые)");
    const [categoriesOpen, setCategoriesOpen] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [onlyNeedsFix, setOnlyNeedsFix] = useState(false);

    const categories = ["Авто", "Электроника", "Недвижимость"];

    const ads: AdItem[] = [
        { category: "Электроника", title: "Наушники", price: "2990 ₽", },
        { category: "Авто", title: "Volkswagen Polo", price: "1100000 ₽", needsFix: true },
        { category: "Недвижимость", title: "Студия, 25м²", price: "15000000 ₽" },
        { category: "Недвижимость", title: "1-кк, 44м²", price: "19000000 ₽", needsFix: true },
        { category: "Электроника", title: "MacBook Pro 16”", price: "64000 ₽", needsFix: true },
        { category: "Авто", title: "Omoda C5", price: "2900000 ₽" },
        { category: "Электроника", title: "iPad Air 11, 2024 г.", price: "37000 ₽", },
        { category: "Электроника", title: "MAJOR VI", price: "20000 ₽" },
        { category: "Авто", title: "Toyota Camry", price: "3900000 ₽", needsFix: true },
        { category: "Электроника", title: "iPhone 17 Pro Max", price: "107000 ₽" },
    ];

    const toggleCategory = (cat: string) => {
        setSelectedCategories((prev) =>
            prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
        );
    };

    const resetFilters = () => {
        setSelectedCategories([]);
        setCategoriesOpen(false);
        setOnlyNeedsFix(false);
    };

    const filteredAds = ads.filter((ad) => {
        const categoryOk =
            selectedCategories.length === 0 || selectedCategories.includes(ad.category);
        const fixOk = !onlyNeedsFix || ad.needsFix;
        return categoryOk && fixOk;
    });

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
                                    variant={view === "grid" ? "filled" : "subtle"}
                                    onClick={() => setView("grid")}
                                >
                                    <IconLayoutGrid size={22} color="#1890ff" />
                                </ActionIcon>

                                <Divider color="#fff" h={28} orientation="vertical" />

                                <ActionIcon
                                    pr={4}
                                    bg="#f7f5f8"
                                    variant={view === "list" ? "filled" : "subtle"}
                                    onClick={() => setView("list")}
                                >
                                    <IconList size={22} color="#000000" />
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
                                    radius={8}
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
                                        {sort}
                                    </Text>
                                </Button>
                            </Menu.Target>

                            <Menu.Dropdown>
                                <Menu.Item onClick={() => setSort("По новизне (сначала новые)")}>
                                    По новизне (сначала новые)
                                </Menu.Item>
                                <Menu.Item onClick={() => setSort("По цене (сначала дорогие)")}>
                                    По цене (сначала дорогие)
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

                    <Box flex={1}>
                        <Box
                            style={{
                                marginRight: '2px',
                                display: "grid",
                                gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
                                columnGap: '13.75px',
                                rowGap: '12px'
                            }}
                        >
                            {filteredAds.map((ad, index) => (
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
                                    {/* тУТА */}
                                    <Box p={16}
                                        pr={28}
                                        pt={21}>
                                        <Text
                                            w={168}
                                            h={24}
                                            mb={5}
                                            fz={16}
                                            fw={400}
                                            lh='24px'

                                        >
                                            {ad.title}
                                        </Text>

                                        <Text
                                            lts={1.9}
                                            fz={16}
                                            fw={600}
                                            lh={1.4}
                                            color="#0000"

                                        >
                                            {ad.price}
                                        </Text>

                                        {ad.needsFix && (
                                            <Paper radius={8} bg='#f9f1e6' pl={9} p={2} mt={4}>
                                                <Flex align="center" gap={6}>
                                                    {/* Круглый маркер */}
                                                    <Box
                                                        w={6}
                                                        h={6}
                                                        bg="#faad14"
                                                        style={{ borderRadius: "50%" }}
                                                    />
                                                    {/* Текст */}
                                                    <Text
                                                        fw={400}
                                                        fz={14}

                                                        c="#faad14"
                                                    >
                                                        Требует доработок
                                                    </Text>
                                                </Flex></Paper>
                                        )}
                                    </Box>
                                </Paper>
                            ))}
                        </Box>
                    </Box>
                </Flex>
            </main>
        </Box>
    );
};

export default AdsListPage;