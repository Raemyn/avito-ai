import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Box,
    Button,
    Divider,
    Flex,
    Paper,
    Text,
    Title,
} from "@mantine/core";
import { IconPencil, IconArrowLeft } from "@tabler/icons-react";
import { getAdById, getMissingFields } from "../../data/ads";

const paramLabels: Record<string, string> = {
    type: "Тип",
    brand: "Бренд",
    model: "Модель",
    color: "Цвет",
    condition: "Состояние",
    yearOfManufacture: "Год выпуска",
    transmission: "Коробка передач",
    mileage: "Пробег",
    enginePower: "Мощность двигателя",
    address: "Адрес",
    area: "Площадь",
    floor: "Этаж",
};

const AdViewPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const ad = useMemo(() => {
        return getAdById(Number(id));
    }, [id]);

    if (!ad) {
        return (
            <Box p={40}>
                <Title order={2}>Объявление не найдено</Title>
                <Button mt={20} onClick={() => navigate("/ads")}>
                    Назад
                </Button>
            </Box>
        );
    }

    const missingFields = getMissingFields(ad);

    return (
        <Box bg="#f7f5f8" mih="100vh">
            <Paper radius={24} p={32} bg="#fff">
                {/* HEADER */}
                <Flex justify="space-between" align="flex-start">
                    <Box>
                        <Title fw={600} fz={28}>
                            {ad.title}
                        </Title>

                        <Button
                            mt={15}
                            rightSection={<IconPencil size={16} />}
                            onClick={() => navigate(`/ads/${ad.id}/edit`)}
                            radius={8}
                            h={38}
                            w={170}
                            justify="space-between"
                            bg="#1890ff"
                        >
                            Редактировать
                        </Button>
                    </Box>

                    <Box ta="right">
                        <Title fw={600} fz={28}>
                            {ad.price}
                        </Title>

                        <Text fz={14} c="#8b8b8b" mt={12}>
                            Опубликовано: {ad.createdAt}
                        </Text>

                        <Text fz={14} c="#8b8b8b">
                            Отредактировано: {ad.updatedAt}
                        </Text>
                    </Box>
                </Flex>

                <Divider mt={28} mb={31} />

                {/* CONTENT */}
                <Flex gap={32}>
                    {/* IMAGE */}
                    <Box
                        w={480}
                        h={360}
                        style={{
                            background: "#f0f0f0",
                            borderRadius: 12,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Text c="#aaa">Нет изображения</Text>
                    </Box>

                    {/* RIGHT */}
                    <Box flex={1}>
                        {missingFields.length > 0 && (
                            <Paper w={512} radius={12} pl={16} pt={12} pb={20} mb={26} bg="#f9f1e6">
                                <Flex align="flex-start" gap={16}>
                                    <Box
                                        w={18}
                                        h={18}
                                        style={{
                                            borderRadius: "50%",
                                            backgroundColor: "#faad14",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            marginTop: 3,
                                        }}
                                    >
                                        <Text fz={12} fw={700} c="#fff">!</Text>
                                    </Box>

                                    <Box>
                                        <Text fw={600} mb={6}>
                                            Требуются доработки
                                        </Text>

                                        <Text fz={13}>
                                            У объявления не заполнены поля:
                                        </Text>

                                        <Box pl={9}>
                                            {missingFields.map((field) => (
                                                <Text key={field}>• {field}</Text>
                                            ))}
                                        </Box>
                                    </Box>
                                </Flex>
                            </Paper>
                        )}

                        {/* CHARACTERISTICS */}
                        <Title order={3} fz={22} fw={600} mb={14}>
                            Характеристики
                        </Title>

                        <Box>
                            {ad.params &&
                                Object.entries(ad.params).map(([key, value]) => {
                                    if (!value) return null;

                                    return (
                                        <Flex key={key} gap={40} mb={4}>
                                            <Text c="#9a9a9a" w={180}>
                                                {paramLabels[key] || key}
                                            </Text>
                                            <Text>{value}</Text>
                                        </Flex>
                                    );
                                })}
                        </Box>
                    </Box>
                </Flex>

                {/* DESCRIPTION */}
                <Box mt={31} w={470}>
                    <Title order={3} fz={22} fw={600} mb={12}>
                        Описание
                    </Title>

                    <Text fz={16} lh={1.4} c="#333">
                        {ad.description || "Описание отсутствует"}
                    </Text>
                </Box>

                {/* BACK BUTTON */}
                <Flex mt={40}>
                    <Button
                        leftSection={<IconArrowLeft size={16} />}
                        variant="outline"
                        radius={8}
                        onClick={() => navigate("/ads")}
                    >
                        Вернуться к объявлениям
                    </Button>
                </Flex>
            </Paper>
        </Box>
    );
};

export default AdViewPage;