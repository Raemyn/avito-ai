import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    clearDraft,
    getAdById,
    getMissingFields,
    saveAd,
    saveDraft,
    type Ad,
} from "../../data/ads";
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

type Category = Ad["category"];

type EditFormState = {
    category: Category;
    title: string;
    price: string;
    description: string;
    params: NonNullable<Ad["params"]> & {
        yearOfManufacture?: string;
        transmission?: string;
        mileage?: string;
        enginePower?: string;
        address?: string;
        area?: string;
        floor?: string;
    };
};

const emptyParams = {
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

const getCategoryParams = (ad?: Ad | null): EditFormState["params"] => ({
    ...emptyParams,
    ...(ad?.params ?? {}),
    type: ad?.params?.type ?? "",
    brand: ad?.params?.brand ?? "",
    model: ad?.params?.model ?? "",
    color: ad?.params?.color ?? "",
    condition: ad?.params?.condition ?? "",
    yearOfManufacture: ad?.params?.yearOfManufacture ?? "",
    transmission: ad?.params?.transmission ?? "",
    mileage: ad?.params?.mileage ?? "",
    enginePower: ad?.params?.enginePower ?? "",
    address: ad?.params?.address ?? "",
    area: ad?.params?.area ?? "",
    floor: ad?.params?.floor ?? "",
});

const getInitialState = (ad: Ad): EditFormState => ({
    category: ad.category,
    title: ad.title,
    price: ad.price.replace(/[^\d]/g, ""),
    description: ad.description ?? "",
    params: getCategoryParams(ad),
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

const AdEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const ad = useMemo(() => {
        return getAdById(Number(id));
    }, [id]);

    const draftKey = Number(id || 0);

    const [form, setForm] = useState<EditFormState | null>(null);
    const [saved, setSaved] = useState(false);
    const [errors, setErrors] = useState<{ title?: string; price?: string }>({});

    useEffect(() => {
        if (!ad) return;

        const draft = localStorage.getItem(`ad-edit-draft-v1-${draftKey}`);
        if (draft) {
            try {
                const parsed = JSON.parse(draft) as Partial<EditFormState>;
                setForm({
                    category: (parsed.category ?? ad.category) as Category,
                    title: parsed.title ?? ad.title,
                    price: parsed.price ?? ad.price.replace(/[^\d]/g, ""),
                    description: parsed.description ?? ad.description ?? "",
                    params: {
                        ...getCategoryParams(ad),
                        ...(parsed.params ?? {}),
                    },
                });
                return;
            } catch {
                // fallback ниже
            }
        }

        setForm(getInitialState(ad));
    }, [ad, draftKey]);

    useEffect(() => {
        if (!form || !id) return;
        saveDraft(draftKey, form);
    }, [form, id, draftKey]);

    if (!ad || !form) {
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

        const nextAd: Ad = {
            ...ad,
            category: form.category,
            title: form.title.trim(),
            price: `${normalizedPrice} ₽`,
            description: form.description.trim(),
            params: {
                type: form.params.type || undefined,
                brand: form.params.brand || undefined,
                model: form.params.model || undefined,
                color: form.params.color || undefined,
                condition: form.params.condition || undefined,
                yearOfManufacture: form.params.yearOfManufacture || undefined,
                transmission: form.params.transmission || undefined,
                mileage: form.params.mileage || undefined,
                enginePower: form.params.enginePower || undefined,
                address: form.params.address || undefined,
                area: form.params.area || undefined,
                floor: form.params.floor || undefined,
            },
            needsFix:
                getMissingFields({
                    ...ad,
                    category: form.category,
                    title: form.title,
                    price: `${normalizedPrice} ₽`,
                    description: form.description,
                    params: {
                        type: form.params.type || undefined,
                        brand: form.params.brand || undefined,
                        model: form.params.model || undefined,
                        color: form.params.color || undefined,
                        condition: form.params.condition || undefined,
                        yearOfManufacture: form.params.yearOfManufacture || undefined,
                        transmission: form.params.transmission || undefined,
                        mileage: form.params.mileage || undefined,
                        enginePower: form.params.enginePower || undefined,
                        address: form.params.address || undefined,
                        area: form.params.area || undefined,
                        floor: form.params.floor || undefined,
                    },
                }).length > 0,
            updatedAt: new Date().toLocaleString("ru-RU", {
                day: "numeric",
                month: "long",
                hour: "2-digit",
                minute: "2-digit",
            }),
        };

        saveAd(nextAd);
        clearDraft(draftKey);
        setSaved(true);

        setTimeout(() => {
            setSaved(false);
            navigate(`/ads/${ad.id}`);
        }, 1500);
    };

    const handleCancel = () => {
        clearDraft(draftKey);
        navigate(`/ads/${ad.id}`);
    };

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
                            updateField("category", (value as Category) ?? "Электроника")
                        }
                        radius={8}
                        w={327}
                    />

                    <Divider color="#ededed" />

                    <Box>
                        <Text fw={600} fz={16} lh="140%"  c="#000">
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
                                    updateField(
                                        "price",
                                        e.currentTarget.value.replace(/[^\d]/g, "")
                                    );
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
                                <TextInput
                                    label="Тип"
                                    value={form.params.type}
                                    onChange={(e) => updateParam("type", e.currentTarget.value)}
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
                                <TextInput
                                    label="Состояние"
                                    value={form.params.condition}
                                    onChange={(e) => updateParam("condition", e.currentTarget.value)}
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
                                    value={form.params.yearOfManufacture ?? ""}
                                    onChange={(e) =>
                                        updateParam("yearOfManufacture", e.currentTarget.value)
                                    }
                                    styles={getOptionalInputStyles(form.params.yearOfManufacture)}
                                    mt={12}
                                />
                                <TextInput
                                    label="Коробка передач"
                                    value={form.params.transmission ?? ""}
                                    onChange={(e) => updateParam("transmission", e.currentTarget.value)}
                                    styles={getOptionalInputStyles(form.params.transmission)}
                                    mt={12}
                                />
                                <TextInput
                                    label="Пробег"
                                    value={form.params.mileage ?? ""}
                                    onChange={(e) => updateParam("mileage", e.currentTarget.value)}
                                    styles={getOptionalInputStyles(form.params.mileage)}
                                    mt={12}
                                />
                                <TextInput
                                    label="Мощность двигателя"
                                    value={form.params.enginePower ?? ""}
                                    onChange={(e) => updateParam("enginePower", e.currentTarget.value)}
                                    styles={getOptionalInputStyles(form.params.enginePower)}
                                    mt={12}
                                />
                            </>
                        )}

                        {form.category === "Недвижимость" && (
                            <>
                                <TextInput
                                    label="Тип"
                                    value={form.params.type}
                                    onChange={(e) => updateParam("type", e.currentTarget.value)}
                                    styles={getOptionalInputStyles(form.params.type)}
                                />
                                <TextInput
                                    label="Адрес"
                                    value={form.params.address ?? ""}
                                    onChange={(e) => updateParam("address", e.currentTarget.value)}
                                    styles={getOptionalInputStyles(form.params.address)}
                                    mt={12}
                                />
                                <TextInput
                                    label="Площадь"
                                    value={form.params.area ?? ""}
                                    onChange={(e) => updateParam("area", e.currentTarget.value)}
                                    styles={getOptionalInputStyles(form.params.area)}
                                    mt={12}
                                />
                                <TextInput
                                    label="Этаж"
                                    value={form.params.floor ?? ""}
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
                            onClick={handleSave}
                            disabled={!isValid}
                            style={{
                                background: isValid ? "#1890ff" : "#f3f3f3",
                                color: isValid ? "#fff" : "#999",
                            }}
                        >
                            Сохранить
                        </Button>

                        <Button
                            onClick={handleCancel}
                            radius={8}
                            variant="filled"
                            bg="#d9d9d9"
                            c="#4b4b4b"
                        >
                            Отменить
                        </Button>
                    </Flex>
                </Flex>
            </Paper>
        </Box>
    );
};

export default AdEditPage;