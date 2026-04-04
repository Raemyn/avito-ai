export type Ad = {
    id: number;
    category: "Электроника" | "Авто" | "Недвижимость";
    title: string;
    price: string;
    createdAt: string;
    updatedAt: string;
    needsFix: boolean;
    description?: string;
    params?: {
        type?: string;
        brand?: string;
        model?: string;
        color?: string;
        condition?: string;
        yearOfManufacture?: string;
        transmission?: string;
        mileage?: string;
        enginePower?: string;
        address?: string;
        area?: string;
        floor?: string;
    };
};

export const baseAds: Ad[] = [
    {
        id: 1,
        category: "Электроника",
        title: "MacBook Pro 16”",
        price: "64000 ₽",
        createdAt: "10 марта 22:39",
        updatedAt: "10 марта 23:12",
        needsFix: true,
        description: 'Продаю MacBook Pro 16" на M1 Pro. Отличное состояние.',
        params: {
            type: "Ноутбук",
            brand: "Apple",
            model: "M1 Pro",
        },
    },
    {
        id: 2,
        category: "Электроника",
        title: "iPhone 14 Pro",
        price: "85000 ₽",
        createdAt: "9 марта 12:10",
        updatedAt: "9 марта 13:00",
        needsFix: false,
        description: "Почти новый iPhone.",
        params: {
            type: "Смартфон",
            brand: "Apple",
            model: "14 Pro",
            color: "Чёрный",
            condition: "Б/У",
        },
    },
    {
        id: 3,
        category: "Электроника",
        title: "Наушники Sony",
        price: "2990 ₽",
        createdAt: "8 марта 12:20",
        updatedAt: "8 марта 13:00",
        needsFix: false,
        description: "Беспроводные наушники.",
        params: {
            type: "Аудио",
            brand: "Sony",
        },
    },
    {
        id: 4,
        category: "Авто",
        title: "Volkswagen Polo",
        price: "1100000 ₽",
        createdAt: "7 марта",
        updatedAt: "7 марта",
        needsFix: true,
    },
    {
        id: 5,
        category: "Авто",
        title: "Toyota Camry",
        price: "3900000 ₽",
        createdAt: "6 марта",
        updatedAt: "6 марта",
        needsFix: false,
    },
    {
        id: 6,
        category: "Авто",
        title: "Omoda C5",
        price: "2900000 ₽",
        createdAt: "5 марта",
        updatedAt: "5 марта",
        needsFix: false,
    },
    {
        id: 7,
        category: "Недвижимость",
        title: "Студия 25м²",
        price: "15000000 ₽",
        createdAt: "4 марта",
        updatedAt: "4 марта",
        needsFix: false,
    },
    {
        id: 8,
        category: "Недвижимость",
        title: "1-к квартира 44м²",
        price: "19000000 ₽",
        createdAt: "3 марта",
        updatedAt: "3 марта",
        needsFix: true,
    },
    {
        id: 9,
        category: "Недвижимость",
        title: "Дом 120м²",
        price: "35000000 ₽",
        createdAt: "2 марта",
        updatedAt: "2 марта",
        needsFix: false,
    },
    {
        id: 10,
        category: "Электроника",
        title: "iPad Air",
        price: "37000 ₽",
        createdAt: "1 марта",
        updatedAt: "1 марта",
        needsFix: false,
    },
    {
        id: 11,
        category: "Электроника",
        title: "Marshall Major IV",
        price: "20000 ₽",
        createdAt: "28 февраля",
        updatedAt: "28 февраля",
        needsFix: false,
    },
    {
        id: 12,
        category: "Авто",
        title: "BMW 5 Series",
        price: "4500000 ₽",
        createdAt: "27 февраля",
        updatedAt: "27 февраля",
        needsFix: true,
    },
];

const ADS_STORAGE_KEY = "ads-overrides-v1";

/* ================= helpers ================= */

const readJson = <T,>(key: string, fallback: T): T => {
    if (typeof window === "undefined") return fallback;

    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
};

/* ================= CRUD ================= */

export const getAds = () => {
    const overrides = readJson<Record<string, Ad>>(ADS_STORAGE_KEY, {});
    return baseAds.map((ad) => {
        const merged = overrides[String(ad.id)] ?? ad;

        return {
            ...merged,
            params: merged.params || {},
        };
    });
};

export const getAdById = (id: number) => {
    if (!id || Number.isNaN(id)) return undefined;
    return getAds().find((ad) => ad.id === id);
};

export const saveAd = (ad: Ad) => {
    if (typeof window === "undefined") return;

    const overrides = readJson<Record<string, Ad>>(ADS_STORAGE_KEY, {});
    overrides[String(ad.id)] = ad;

    localStorage.setItem(ADS_STORAGE_KEY, JSON.stringify(overrides));
};

/* ================= VALIDATION ================= */

export const getMissingFields = (ad: Ad): string[] => {
    const missing: string[] = [];

    if (!ad.title?.trim()) missing.push("Название");

    if (!ad.price || Number(ad.price.replace(/[^\d]/g, "")) === 0) {
        missing.push("Цена");
    }

    if (!ad.description?.trim()) {
        missing.push("Описание");
    }

    if (ad.category === "Электроника") {
        if (!ad.params?.brand) missing.push("Бренд");
        if (!ad.params?.model) missing.push("Модель");
    }

    if (ad.category === "Авто") {
        if (!ad.params?.brand) missing.push("Бренд");
        if (!ad.params?.model) missing.push("Модель");
        if (!ad.params?.yearOfManufacture) missing.push("Год выпуска");
    }

    if (ad.category === "Недвижимость") {
        if (!ad.params?.address) missing.push("Адрес");
        if (!ad.params?.area) missing.push("Площадь");
    }

    return missing;
};

/* ================= DRAFT ================= */

export const saveDraft = (id: number, data: unknown) => {
    if (typeof window === "undefined") return;

    localStorage.setItem(
        `ad-edit-draft-v1-${id}`,
        JSON.stringify(data)
    );
};

export const clearDraft = (id: number) => {
    if (typeof window === "undefined") return;

    localStorage.removeItem(`ad-edit-draft-v1-${id}`);
};