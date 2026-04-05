import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type UiCategory = "Электроника" | "Авто" | "Недвижимость";

export type EditFormState = {
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

type AdEditStore = {
  drafts: Record<string, EditFormState>;
  setDraft: (itemId: string, draft: EditFormState) => void;
  clearDraft: (itemId: string) => void;
};

export const useAdEditStore = create<AdEditStore>()(
  persist(
    (set) => ({
      drafts: {},

      setDraft: (itemId, draft) =>
        set((state) => ({
          drafts: {
            ...state.drafts,
            [itemId]: draft,
          },
        })),

      clearDraft: (itemId) =>
        set((state) => {
          const next = { ...state.drafts };
          delete next[itemId];

          return { drafts: next };
        }),
    }),
    {
      name: "ad-edit-drafts",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        drafts: state.drafts,
      }),
    }
  )
);