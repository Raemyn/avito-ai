import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Divider, Flex, Paper, Text, Title } from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";
import { ads } from "../../data/ads";

const AdViewPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const ad = useMemo(() => {
        return ads.find((item) => item.id === Number(id));
    }, [id]);

    if (!ad) {
        return (
            <Box p={40}>
                <Title order={2}>Объявление не найдено</Title>
                <Button mt={20} variant="outline" onClick={() => navigate("/ads")}>
                    Назад
                </Button>
            </Box>
        );
    }

    return (
        <Box bg="#f7f5f8" mih="100vh" >
            <Paper radius={24} p={32} bg="#fff">
                {/* HEADER */}
                <Flex justify="space-between" align="flex-start">
                    <Box>
                        <Title fw={600} lts={1.3} fz={28}>
                            {ad.title}
                        </Title>

                        <Button
                            mt={15}
                            rightSection={<IconPencil size={16} />}
                            onClick={() => navigate(`/ads/${ad.id}/edit`)}
                            radius={8}
                            pt={8}
                            pb={8}
                            pl={12}
                            pr={12}
                            lts={0.8}
                            h={38}
                            w={170}
                            justify="space-between"
                            bg="#1890ff"
                            fz={16}
                            fw={400}

                        >
                            Редактировать
                        </Button>
                    </Box>

                    <Box ta="right">
                        <Title fw={600} lts={1.6} fz={28} >
                            {ad.price}
                        </Title>

                        <Text fz={18} lts={-0.4} c="#8b8b8b" mt={12} h={22}>
                            Опубликовано: {ad.createdAt}
                        </Text>

                        <Text fz={18} lts={-0.4} c="#8b8b8b" >
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

                    {/* RIGHT BLOCK */}
                    <Box flex={1}>
                        {/* NEEDS FIX */}
                        {ad.needsFix && (
                            <Paper w={512} radius={12} pl={16} pt={12} pb={20} mb={26} bg="#f9f1e6">
                                <Flex align="flex-start" gap={16}>
                                    {/* ИКОНКА */}
                                    <Box
                                        w={18}
                                        h={18}
                                        style={{
                                            borderRadius: "50%",
                                            backgroundColor: "#faad14",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexShrink: 0,
                                            marginTop: 3,
                                        }}
                                    >
                                        <Text fz={12} fw={700} c="#fff">
                                            !
                                        </Text>
                                    </Box>

                                    {/* ТЕКСТ */}
                                    <Box>
                                        <Text fw={600} mb={6} lts={0.1}>
                                            Требуются доработки
                                        </Text>

                                        <Text fz={13} mb={0} lts={0.7}>
                                            У объявления не заполнены поля:
                                        </Text>

                                        <Box pl={9}>
                                            {!ad.params?.color && <Text fw={400} lts={0.3} fz={14}>• Цвет</Text>}
                                            {!ad.params?.condition && <Text lts={0.3} fw={400} fz={14}>• Состояние</Text>}
                                        </Box>
                                    </Box>
                                </Flex>
                            </Paper>
                        )}

                        {/* CHARACTERISTICS */}
                        <Title order={3} lts={0.15} fz={22} fw={600} mb={14}>
                            Характеристики
                        </Title>

                        <Box>
                           
                            {ad.params?.type && (
                                <Flex gap={40}  mb={4}>
                                    <Text c="#9a9a9a" w={120}>Тип</Text>
                                    <Text lts={0.8}>{ad.params.type}</Text>
                                </Flex>
                            )}

                            {ad.params?.brand && (
                                <Flex gap={40} mb={4}>
                                    <Text c="#9a9a9a" w={120}>Бренд</Text>
                                    <Text lts={0.8}>{ad.params.brand}</Text>
                                </Flex>
                            )}

                            {ad.params?.model && (
                                <Flex gap={40} mb={4}>
                                    <Text c="#9a9a9a" w={120}>Модель</Text>
                                    <Text>{ad.params.model}</Text>
                                </Flex>
                            )}

                            {ad.params?.color && (
                                <Flex gap={24} mb={8}>
                                    <Text c="#9a9a9a" w={120}>Цвет</Text>
                                    <Text>{ad.params.color}</Text>
                                </Flex>
                            )}

                            {ad.params?.condition && (
                                <Flex gap={24} mb={8}>
                                    <Text c="#9a9a9a" w={120}>Состояние</Text>
                                    <Text>{ad.params.condition}</Text>
                                </Flex>
                            )}
                        </Box>
                    </Box>
                </Flex>

                {/* DESCRIPTION */}
                <Box mt={31} w={470}>
                    <Title order={3}  fz={22} fw={600} mb={12}>
                        Описание
                    </Title>

                    <Text fz={16}  lh={1.4} c="#333" maw={700}>
                        {ad.description || "Описание отсутствует"}
                    </Text>
                </Box>
            </Paper>
        </Box>
    );
};

export default AdViewPage;