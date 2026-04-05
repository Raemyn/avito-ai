import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    Box,
    Button,
    Divider,
    Flex,
    Paper,
    Select,
    Text,
    TextInput,
    Textarea,
    Title,
} from "@mantine/core";
import { IconBulb, IconRefresh, IconCheck } from "@tabler/icons-react";
import { getItemById, updateItem } from "../../api/items";

type ApiCategory = "auto" | "real_estate" | "electronics";

type ApiItemDetail = {
    id: number;
    category: ApiCategory;
    title: string;
    description?: string;
    price: number;
    createdAt: string;
    updatedAt: string;
    needsRevision?: boolean;
    params?: {
        type?: string | null;
        brand?: string | null;
        model?: string | null;
        color?: string | null;
        condition?: string | null;
        yearOfManufacture?: number | null;
        transmission?: "automatic" | "manual" | string | null;
        mileage?: number | null;
        enginePower?: number | null;
        address?: string | null;
        area?: number | null;
        floor?: number | null;
    };
};

type UiCategory = "Электроника" | "Авто" | "Недвижимость";

type EditFormState = {
    category: UiCategory;
    title: string;
    price: string;
    description: string;
    params: {
        type: string;
        brand: string;
        model: string;
        color: string;
        condition: string;
        yearOfManufacture: string;
        transmission: string;
        mileage: string;
        enginePower: string;
        address: string;
        area: string;
        floor: string;
    };
};

type ApiAutoParams = {
    brand?: string;
    model?: string;
    yearOfManufacture?: number;
    transmission?: "automatic" | "manual";
    mileage?: number;
    enginePower?: number;
};

type ApiRealEstateParams = {
    type?: "flat" | "house" | "room";
    address?: string;
    area?: number;
    floor?: number;
};

type ApiElectronicsParams = {
    type?: "phone" | "laptop" | "misc";
    brand?: string;
    model?: string;
    condition?: "new" | "used";
    color?: string;
};

type UpdatePayload =
    | {
          category: "auto";
          title: string;
          description?: string;
          price: number;
          params: ApiAutoParams;
      }
    | {
          category: "real_estate";
          title: string;
          description?: string;
          price: number;
          params: ApiRealEstateParams;
      }
    | {
          category: "electronics";
          title: string;
          description?: string;
          price: number;
          params: ApiElectronicsParams;
      };

const emptyParams: EditFormState["params"] = {
    type: "",
    brand: "",
    model: "",
    color: "",
    condition: "",
    yearOfManufacture: "",
    transmission: "",
    mileage: "",
    enginePower: "",
    address: "",
    area: "",
    floor: "",
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

const formatParamValue = (value: unknown) => {
    if (value === null || value === undefined || value === "") return "";
    return String(value);
};

const getInitialState = (ad: ApiItemDetail): EditFormState => ({
    category: mapCategoryToUi(ad.category),
    title: ad.title,
    price: String(ad.price),
    description: ad.description ?? "",
    params: {
        ...emptyParams,
        type: formatParamValue(ad.params?.type),
        brand: formatParamValue(ad.params?.brand),
        model: formatParamValue(ad.params?.model),
        color: formatParamValue(ad.params?.color),
        condition: formatParamValue(ad.params?.condition),
        yearOfManufacture: formatParamValue(ad.params?.yearOfManufacture),
        transmission: formatParamValue(ad.params?.transmission),
        mileage: formatParamValue(ad.params?.mileage),
        enginePower: formatParamValue(ad.params?.enginePower),
        address: formatParamValue(ad.params?.address),
        area: formatParamValue(ad.params?.area),
        floor: formatParamValue(ad.params?.floor),
    },
});

const getRequiredInputStyles = (hasError: boolean): { input: CSSProperties } => ({
    input: {
        border: hasError ? "1px solid #ec221f" : "1px solid #d9d9d9",
        borderRadius: 8,
        padding: "5px 12px",
        width: 327,
        height: 28,
        background: "#fff",
        boxSizing: "border-box",
    },
});

const getOptionalInputStyles = (value?: string): { input: CSSProperties } => ({
    input: {
        border: value ? "1px solid #d9d9d9" : "1px solid #faad14",
        borderRadius: 8,
        padding: "5px 12px",
        width: 456,
        height: 32,
        background: "#fff",
        boxSizing: "border-box",
    },
});

const toOptionalNumber = (value?: string) => {
    if (!value || !value.trim()) return undefined;
    const parsed = Number(value.replace(/[^\d.]/g, ""));
    return Number.isFinite(parsed) ? parsed : undefined;
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
        if (!formatParamValue(params.type)) missing.push("Тип");
        if (!formatParamValue(params.condition)) missing.push("Состояние");
    }

    if (item.category === "auto") {
        if (!formatParamValue(params.brand)) missing.push("Бренд");
        if (!formatParamValue(params.model)) missing.push("Модель");
        if (!formatParamValue(params.yearOfManufacture)) missing.push("Год выпуска");
    }

    if (item.category === "real_estate") {
        if (!formatParamValue(params.address)) missing.push("Адрес");
        if (!formatParamValue(params.area)) missing.push("Площадь");
        if (!formatParamValue(params.type)) missing.push("Тип");
    }

    return missing;
};

const AdEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const itemId = Number(id);

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ["item", itemId],
        queryFn: async (): Promise<ApiItemDetail> => {
            return (await getItemById(itemId)) as ApiItemDetail;
        },
        enabled: Number.isFinite(itemId) && itemId > 0,
    });

    const item = useMemo(() => data ?? null, [data]);

    const [form, setForm] = useState<EditFormState | null>(null);
    const [saved, setSaved] = useState(false);
    const [errors, setErrors] = useState<{ title?: string; price?: string }>({});

    useEffect(() => {
        if (!item) return;
        setForm(getInitialState(item));
    }, [item]);

    const updateMutation = useMutation({
        mutationFn: async (payload: UpdatePayload) => {
            return updateItem(itemId, payload);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["item", itemId] });
            await queryClient.invalidateQueries({ queryKey: ["ads"] });

            setSaved(true);

            setTimeout(() => {
                setSaved(false);
                navigate(`/ads/${itemId}`);
            }, 1500);
        },
    });

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
                <Button mt={20} variant="outline" onClick={() => refetch()}>
                    Повторить
                </Button>
                <Button mt={12} variant="light" onClick={() => navigate("/ads")}>
                    Назад
                </Button>
            </Box>
        );
    }

    if (!item || !form) {
        return (
            <Box p={40}>
                <Title order={2}>Объявление не найдено</Title>
                <Button mt={20} variant="outline" onClick={() => navigate("/ads")}>
                    Назад
                </Button>
            </Box>
        );
    }

    const updateField = <K extends keyof EditFormState>(key: K, value: EditFormState[K]) => {
        setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
    };

    const updateParam = (key: keyof EditFormState["params"], value: string) => {
        setForm((prev) =>
            prev
                ? {
                      ...prev,
                      params: {
                          ...prev.params,
                          [key]: value,
                      },
                  }
                : prev
        );
    };

    const validateField = (field: "title" | "price") => {
        if (field === "title" && !form.title.trim()) {
            setErrors((e) => ({ ...e, title: "Название должно быть заполнено" }));
        } else if (field === "price" && !form.price.trim()) {
            setErrors((e) => ({ ...e, price: "Цена должна быть заполнена" }));
        } else {
            setErrors((e) => ({ ...e, [field]: undefined }));
        }
    };

    const isValid = Boolean(form.title.trim() && form.price.trim());

    const handleSuggestDescription = () => {
        setForm((prev) =>
            prev
                ? {
                      ...prev,
                      description:
                          prev.category === "Электроника"
                              ? `Продаю ${prev.title}. Отличный вариант для работы, учёбы и повседневных задач.`
                              : `Продаю ${prev.title}. Хорошее состояние, аккуратное использование, готов к сделке.`,
                  }
                : prev
        );
    };

    const handleSuggestPrice = () => {
        const current = Number(form.price.replace(/[^\d]/g, "")) || 0;
        if (!current) return;

        const suggested =
            form.category === "Электроника"
                ? Math.round(current * 0.97)
                : form.category === "Авто"
                  ? Math.round(current * 1.02)
                  : Math.round(current * 1.01);

        updateField("price", String(suggested));
    };

    const handleSave = () => {
        validateField("title");
        validateField("price");

        if (!isValid) return;

        const normalizedPrice = Number(form.price.replace(/[^\d]/g, "")) || 0;

        const payload: UpdatePayload =
            form.category === "Авто"
                ? {
                      category: "auto",
                      title: form.title.trim(),
                      description: form.description.trim() || undefined,
                      price: normalizedPrice,
                      params: {
                          brand: form.params.brand || undefined,
                          model: form.params.model || undefined,
                          yearOfManufacture: toOptionalNumber(form.params.yearOfManufacture),
                          transmission:
                              form.params.transmission === "manual" ||
                              form.params.transmission === "automatic"
                                  ? form.params.transmission
                                  : undefined,
                          mileage: toOptionalNumber(form.params.mileage),
                          enginePower: toOptionalNumber(form.params.enginePower),
                      },
                  }
                : form.category === "Недвижимость"
                  ? {
                        category: "real_estate",
                        title: form.title.trim(),
                        description: form.description.trim() || undefined,
                        price: normalizedPrice,
                        params: {
                            type:
                                form.params.type === "flat" ||
                                form.params.type === "house" ||
                                form.params.type === "room"
                                    ? form.params.type
                                    : undefined,
                            address: form.params.address || undefined,
                            area: toOptionalNumber(form.params.area),
                            floor: toOptionalNumber(form.params.floor),
                        },
                    }
                  : {
                        category: "electronics",
                        title: form.title.trim(),
                        description: form.description.trim() || undefined,
                        price: normalizedPrice,
                        params: {
                            type:
                                form.params.type === "phone" ||
                                form.params.type === "laptop" ||
                                form.params.type === "misc"
                                    ? form.params.type
                                    : undefined,
                            brand: form.params.brand || undefined,
                            model: form.params.model || undefined,
                            condition:
                                form.params.condition === "new" || form.params.condition === "used"
                                    ? form.params.condition
                                    : undefined,
                            color: form.params.color || undefined,
                        },
                    };

        updateMutation.mutate(payload);
    };

    const handleCancel = () => {
        navigate(`/ads/${itemId}`);
    };

    const missingCount = getMissingFields(item).length;

    return (
        <Box bg="#f7f5f8" mih="100vh" p={24}>
            {saved && (
                <Box
                    style={{
                        position: "fixed",
                        top: 20,
                        right: 20,
                        width: 328,
                        height: 40,
                        padding: "9px 16px",
                        background: "#f6ffed",
                        border: "1px solid #b7eb8f",
                        borderRadius: 2,
                        zIndex: 1000,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                >
                    <Flex align="center" gap={8}>
                        <Box
                            style={{
                                width: 16,
                                height: 16,
                                borderRadius: "50%",
                                background: "#52c41a",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <IconCheck size={12} color="#fff" />
                        </Box>

                        <Text
                            style={{
                                fontWeight: 400,
                                fontSize: 14,
                                lineHeight: "157%",
                                color: "rgba(0, 0, 0, 0.85)",
                            }}
                        >
                            Изменения сохранены
                        </Text>
                    </Flex>
                </Box>
            )}

            <Paper radius={24} p={32} bg="#fff">
                <Title order={2} fw={600} fz={32} mb={24}>
                    Редактирование объявления
                </Title>

                <Flex direction="column" gap={16}>
                    <Select
                        label="Категория"
                        data={["Электроника", "Авто", "Недвижимость"]}
                        value={form.category}
                        onChange={(value) =>
                            updateField("category", (value as UiCategory) ?? "Электроника")
                        }
                        radius={8}
                        w={327}
                    />

                    <Divider color="#ededed" />

                    <Box>
                        <Text fw={600} fz={16} lh="140%" c="#000">
                            <span style={{ color: "#ff4d4f" }}>*</span> Название
                        </Text>

                        <TextInput
                            value={form.title}
                            onChange={(e) => {
                                updateField("title", e.currentTarget.value);
                                if (errors.title) {
                                    setErrors((prev) => ({ ...prev, title: undefined }));
                                }
                            }}
                            onBlur={() => validateField("title")}
                            styles={getRequiredInputStyles(Boolean(errors.title))}
                        />

                        {errors.title && (
                            <Text
                                style={{
                                    fontWeight: 400,
                                    fontSize: 12,
                                    lineHeight: "167%",
                                    color: "#ec221f",
                                }}
                            >
                                {errors.title}
                            </Text>
                        )}
                    </Box>

                    <Divider color="#ededed" />

                    <Flex align="flex-end" gap={20} wrap="wrap">
                        <Box>
                            <Text mb={8} fw={600} fz={16} lh="140%" c="#000">
                                <span style={{ color: "#ff4d4f" }}>*</span> Цена
                            </Text>

                            <TextInput
                                value={form.price}
                                onChange={(e) => {
                                    updateField("price", e.currentTarget.value.replace(/[^\d]/g, ""));
                                    if (errors.price) {
                                        setErrors((prev) => ({ ...prev, price: undefined }));
                                    }
                                }}
                                onBlur={() => validateField("price")}
                                styles={getRequiredInputStyles(Boolean(errors.price))}
                            />

                            {errors.price && (
                                <Text
                                    style={{
                                        fontWeight: 400,
                                        fontSize: 12,
                                        lineHeight: "167%",
                                        color: "#ec221f",
                                    }}
                                >
                                    {errors.price}
                                </Text>
                            )}
                        </Box>

                        <Button
                            leftSection={<IconRefresh size={14} />}
                            radius={8}
                            variant="light"
                            color="orange"
                            bg="#fff2e5"
                            c="#ff9f1a"
                            fw={400}
                            h={32}
                            onClick={handleSuggestPrice}
                        >
                            Узнать рыночную цену
                        </Button>
                    </Flex>

                    <Divider color="#ededed" />

                    <Title order={3} fw={600} fz={20}>
                        Характеристики
                    </Title>

                    <Box w={456}>
                        {form.category === "Электроника" && (
                            <>
                                <Select
                                    label="Тип"
                                    data={[
                                        { value: "phone", label: "Телефон" },
                                        { value: "laptop", label: "Ноутбук" },
                                        { value: "misc", label: "Другое" },
                                    ]}
                                    value={form.params.type || null}
                                    onChange={(value) => updateParam("type", value ?? "")}
                                    styles={getOptionalInputStyles(form.params.type)}
                                />
                                <TextInput
                                    label="Бренд"
                                    value={form.params.brand}
                                    onChange={(e) => updateParam("brand", e.currentTarget.value)}
                                    styles={getOptionalInputStyles(form.params.brand)}
                                    mt={12}
                                />
                                <TextInput
                                    label="Модель"
                                    value={form.params.model}
                                    onChange={(e) => updateParam("model", e.currentTarget.value)}
                                    styles={getOptionalInputStyles(form.params.model)}
                                    mt={12}
                                />
                                <TextInput
                                    label="Цвет"
                                    value={form.params.color}
                                    onChange={(e) => updateParam("color", e.currentTarget.value)}
                                    styles={getOptionalInputStyles(form.params.color)}
                                    mt={12}
                                />
                                <Select
                                    label="Состояние"
                                    data={[
                                        { value: "new", label: "Новое" },
                                        { value: "used", label: "Б/у" },
                                    ]}
                                    value={form.params.condition || null}
                                    onChange={(value) => updateParam("condition", value ?? "")}
                                    styles={getOptionalInputStyles(form.params.condition)}
                                    mt={12}
                                />
                            </>
                        )}

                        {form.category === "Авто" && (
                            <>
                                <TextInput
                                    label="Бренд"
                                    value={form.params.brand}
                                    onChange={(e) => updateParam("brand", e.currentTarget.value)}
                                    styles={getOptionalInputStyles(form.params.brand)}
                                />
                                <TextInput
                                    label="Модель"
                                    value={form.params.model}
                                    onChange={(e) => updateParam("model", e.currentTarget.value)}
                                    styles={getOptionalInputStyles(form.params.model)}
                                    mt={12}
                                />
                                <TextInput
                                    label="Год выпуска"
                                    value={form.params.yearOfManufacture}
                                    onChange={(e) =>
                                        updateParam("yearOfManufacture", e.currentTarget.value)
                                    }
                                    styles={getOptionalInputStyles(form.params.yearOfManufacture)}
                                    mt={12}
                                />
                                <Select
                                    label="Коробка передач"
                                    data={[
                                        { value: "automatic", label: "Автомат" },
                                        { value: "manual", label: "Механика" },
                                    ]}
                                    value={
                                        form.params.transmission === "automatic" ||
                                        form.params.transmission === "manual"
                                            ? form.params.transmission
                                            : null
                                    }
                                    onChange={(value) => updateParam("transmission", value ?? "")}
                                    styles={getOptionalInputStyles(form.params.transmission)}
                                    mt={12}
                                />
                                <TextInput
                                    label="Пробег"
                                    value={form.params.mileage}
                                    onChange={(e) => updateParam("mileage", e.currentTarget.value)}
                                    styles={getOptionalInputStyles(form.params.mileage)}
                                    mt={12}
                                />
                                <TextInput
                                    label="Мощность двигателя"
                                    value={form.params.enginePower}
                                    onChange={(e) => updateParam("enginePower", e.currentTarget.value)}
                                    styles={getOptionalInputStyles(form.params.enginePower)}
                                    mt={12}
                                />
                            </>
                        )}

                        {form.category === "Недвижимость" && (
                            <>
                                <Select
                                    label="Тип"
                                    data={[
                                        { value: "flat", label: "Квартира" },
                                        { value: "house", label: "Дом" },
                                        { value: "room", label: "Комната" },
                                    ]}
                                    value={form.params.type || null}
                                    onChange={(value) => updateParam("type", value ?? "")}
                                    styles={getOptionalInputStyles(form.params.type)}
                                />
                                <TextInput
                                    label="Адрес"
                                    value={form.params.address}
                                    onChange={(e) => updateParam("address", e.currentTarget.value)}
                                    styles={getOptionalInputStyles(form.params.address)}
                                    mt={12}
                                />
                                <TextInput
                                    label="Площадь"
                                    value={form.params.area}
                                    onChange={(e) => updateParam("area", e.currentTarget.value)}
                                    styles={getOptionalInputStyles(form.params.area)}
                                    mt={12}
                                />
                                <TextInput
                                    label="Этаж"
                                    value={form.params.floor}
                                    onChange={(e) => updateParam("floor", e.currentTarget.value)}
                                    styles={getOptionalInputStyles(form.params.floor)}
                                    mt={12}
                                />
                            </>
                        )}
                    </Box>

                    <Divider color="#ededed" />

                    <Box>
                        <Text fw={600} fz={18} mb={8}>
                            Описание
                        </Text>

                        <Textarea
                            value={form.description}
                            onChange={(e) =>
                                updateField("description", e.currentTarget.value.slice(0, 1000))
                            }
                            radius={8}
                            minRows={4}
                            autosize
                        />

                        <Flex justify="space-between" align="center" mt={8}>
                            <Button
                                leftSection={<IconBulb size={14} />}
                                radius={8}
                                variant="light"
                                color="orange"
                                bg="#fff2e5"
                                c="#ff9f1a"
                                fw={400}
                                h={32}
                                onClick={handleSuggestDescription}
                            >
                                Придумать описание
                            </Button>

                            <Text fz={12} c="#b5b5b5">
                                {form.description.length} / 1000
                            </Text>
                        </Flex>
                    </Box>

                    <Flex gap={12} mt={8}>
                        <Button
                            type="button"
                            onClick={handleSave}
                            disabled={!isValid || updateMutation.isPending}
                            style={{
                                background: isValid ? "#1890ff" : "#f3f3f3",
                                color: isValid ? "#fff" : "#999",
                            }}
                        >
                            Сохранить
                        </Button>

                        <Button
                            type="button"
                            onClick={handleCancel}
                            radius={8}
                            variant="filled"
                            bg="#d9d9d9"
                            c="#4b4b4b"
                        >
                            Отменить
                        </Button>
                    </Flex>

                    <Box mt={8}>
                        <Text fz={12} c="#8b8b8b">
                            Требуются доработки: {missingCount}
                        </Text>
                    </Box>
                </Flex>
            </Paper>
        </Box>
    );
};

export default AdEditPage;