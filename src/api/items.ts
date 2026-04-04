import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080",
});

/* ================= TYPES ================= */

export type ApiAd = {
    id: number;
    category: "auto" | "real_estate" | "electronics";
    title: string;
    price: number;
    needsRevision: boolean;
    description?: string;
    params?: any;
};

/* ================= REQUESTS ================= */

// список объявлений
export const getItems = async (params?: {
    q?: string;
    limit?: number;
    skip?: number;
    needsRevision?: boolean;
    categories?: string;
}) => {
    const { data } = await api.get("/items", { params });
    return data;
};

// одно объявление
export const getItemById = async (id: number) => {
    const { data } = await api.get(`/items/${id}`);
    return data;
};

// обновление
export const updateItem = async (id: number, payload: any) => {
    const { data } = await api.put(`/items/${id}`, payload);
    return data;
};