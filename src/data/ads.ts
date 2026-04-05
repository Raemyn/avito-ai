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