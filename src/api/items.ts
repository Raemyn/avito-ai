import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

export type ApiAd = {
  id: number;
  category: "auto" | "real_estate" | "electronics";
  title: string;
  price: number;
  needsRevision: boolean;
  description?: string;
  params?: any;
};

export type GetItemsParams = {
  q?: string;
  limit?: number;
  skip?: number;
  needsRevision?: boolean;
  categories?: string;
  sortColumn?: "title" | "createdAt" | "price";
  sortDirection?: "asc" | "desc";
};

type GetItemsArgs = {
  params?: GetItemsParams;
  signal?: AbortSignal;
};

type GetItemByIdArgs = {
  id: number;
  signal?: AbortSignal;
};

export const getItems = async ({ params, signal }: GetItemsArgs = {}) => {
  const { data } = await api.get("/items", {
    params,
    signal,
  });
  return data;
};

export const getItemById = async ({ id, signal }: GetItemByIdArgs) => {
  const { data } = await api.get(`/items/${id}`, {
    signal,
  });
  return data;
};

export const updateItem = async (id: number, payload: any) => {
  const { data } = await api.put(`/items/${id}`, payload);
  return data;
};