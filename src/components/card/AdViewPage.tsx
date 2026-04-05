import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Box, Button, Divider, Flex, Paper, Text, Title } from "@mantine/core";
import { IconArrowLeft, IconPencil } from "@tabler/icons-react";
import { getItemById } from "../../api/items";

type ApiCategory = "auto" | "real_estate" | "electronics";

type ApiItemDetail = {
  id: number;
  category: ApiCategory;
  title: string;
  description?: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  needsRevision: boolean;
  params?: Record<string, unknown>;
};

type UiCategory = "Авто" | "Недвижимость" | "Электроника";

type UiAd = {
  id: number;
  category: UiCategory;
  title: string;
  price: string;
  createdAt: string;
  updatedAt: string;
  needsFix: boolean;
  description: string;
  params?: Record<string, string>;
};

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

const mapCategoryToUi = (category: ApiCategory): UiCategory => {
  switch (category) {
    case "auto":
      return "Авто";
    case "real_estate":
      return "Недвижимость";
    case "electronics":
      return "Электроника";
  }
};

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value || "—";

  return date.toLocaleString("ru-RU", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatParamValue = (value: unknown) => {
  if (value === null || value === undefined || value === "") return "";
  return String(value);
};

const getMissingFields = (item: ApiItemDetail): string[] => {
  const missing: string[] = [];
  const params = item.params ?? {};

  if (!item.title?.trim()) missing.push("Название");

  if (!item.price || item.price <= 0) {
    missing.push("Цена");
  }

  if (!item.description?.trim()) {
    missing.push("Описание");
  }

  if (item.category === "electronics") {
    if (!formatParamValue(params.brand)) missing.push("Бренд");
    if (!formatParamValue(params.model)) missing.push("Модель");
  }

  if (item.category === "auto") {
    if (!formatParamValue(params.brand)) missing.push("Бренд");
    if (!formatParamValue(params.model)) missing.push("Модель");
    if (!formatParamValue(params.yearOfManufacture)) missing.push("Год выпуска");
  }

  if (item.category === "real_estate") {
    if (!formatParamValue(params.address)) missing.push("Адрес");
    if (!formatParamValue(params.area)) missing.push("Площадь");
  }

  return missing;
};

const mapItemToUiAd = (item: ApiItemDetail): UiAd => {
  const params =
    item.params && Object.keys(item.params).length > 0
      ? (Object.fromEntries(
        Object.entries(item.params)
          .filter(([, value]) => value !== null && value !== undefined && value !== "")
          .map(([key, value]) => [key, String(value)])
      ) as Record<string, string>)
      : undefined;

  return {
    id: item.id,
    category: mapCategoryToUi(item.category),
    title: item.title,
    price: `${item.price} ₽`,
    createdAt: formatDate(item.createdAt),
    updatedAt: formatDate(item.updatedAt),
    needsFix: item.needsRevision,
    description: item.description ?? "",
    params,
  };
};

const AdViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const itemId = Number(id);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["item", itemId],
    queryFn: async ({ signal }): Promise<ApiItemDetail> => {
      return (await getItemById({ id: itemId, signal })) as ApiItemDetail;
    },
    enabled: Number.isFinite(itemId) && itemId > 0,
  });

  const ad = useMemo(() => {
    if (!data) return null;
    return mapItemToUiAd(data);
  }, [data]);

  const missingFields = useMemo(() => {
    if (!data) return [];
    return getMissingFields(data);
  }, [data]);

  if (isLoading) {
    return (
      <Box p={40}>
        <Text>Загрузка объявления...</Text>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box p={40}>
        <Title order={2}>Не удалось загрузить объявление</Title>
        <Text mt={8} c="red">
          {error instanceof Error ? error.message : "Неизвестная ошибка"}
        </Text>
        <Flex mt={20} gap={12}>
          <Button variant="outline" onClick={() => refetch()}>
            Повторить
          </Button>
          <Button variant="light" onClick={() => navigate("/ads")}>
            Назад
          </Button>
        </Flex>
      </Box>
    );
  }

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

  return (
    <Box bg="#f7f5f8" mih="100vh">
      <Paper radius={24} p={32} bg="#fff">
        <Flex justify="space-between" align="flex-start">
          <Box>
            <Title ff={'var(--font-family)'} fw={500} fz={28}>
              {ad.title}
            </Title>

            <Button
              mt={15}
              rightSection={<IconPencil size={16} />}
              onClick={() => navigate(`/ads/${ad.id}/edit`)}
              radius={8}
              h={38}
              fw={400}
              w={170}
              justify="space-between"
              bg="#1890ff"
              ff={'var(--second-family)'}
            >
              Редактировать
            </Button>
          </Box>

          <Box ta="right">
            <Title ff={'var(--font-family)'} fw={500} fz={28}>
              {ad.price}
            </Title>

            <Text   ff={'var(--second-family)'} fw={400} fz={14} c="#8b8b8b" mt={12}>
              Опубликовано: {ad.createdAt}
            </Text>

            <Text fz={14} ff={'var(--second-family)'} fw={400}  c="#8b8b8b">
              Отредактировано: {ad.updatedAt}
            </Text>
          </Box>
        </Flex>

        <Divider mt={28} mb={31} />

        <Flex gap={32}>
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

          <Box style={{ flex: 1 }}>
            {missingFields.length > 0 && (
              <Paper
                w={512}
                radius={12}
                pl={16}
                pt={12}
                pb={20}
                mb={26}
                bg="#f9f1e6"
              >
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
                    <Text fz={12} fw={700} c="#fff">
                      !
                    </Text>
                  </Box>

                  <Box>
                    <Text fw={600} mb={6}>
                      Требуются доработки
                    </Text>

                    <Text fw={400} fz={14}>У объявления не заполнены поля:</Text>

                    <Box pl={9}>
                      {missingFields.map((field) => (
                        <Text fz={14} fw={400} key={field}>• {field}</Text>
                      ))}
                    </Box>
                  </Box>
                </Flex>
              </Paper>
            )}

            <Title ff={'var(--font-family)'} fw={500} order={3} fz={22}  mb={14}>
              Характеристики 
            </Title>

            <Box>
              {ad.params &&
                Object.entries(ad.params).map(([key, value]) => {
                  if (!value) return null;

                  return (
                    <Flex key={key} gap={40} mb={4}>
                      <Text ff={'var(--second-family)'} fz={16} fw={600} c="rgba(0, 0, 0, 0.45)" w={180}>
                        {paramLabels[key] || key}
                      </Text>
                      <Text color="#1e1e1e" ff={'var(--second-family)'}  fw={400} fz={16} >{value}</Text>
                    </Flex>
                  );
                })}
            </Box>
          </Box>
        </Flex>

        <Box mt={31} w={470}>
          <Title order={3} c={'rgba(0, 0, 0, 0.85'} fz={22} ff={'var(--font-family)'} fw={500} mb={12}>
            Описание
          </Title>

          <Text fz={16} lh={1.4} c="#1e1e1e" ff={'var(--second-family)'}  fw={400} >
            {ad.description || "Описание отсутствует"}
          </Text>
        </Box>

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