import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type SortMode =
  | "new"
  | "old"
  | "cheap"
  | "expensive"
  | "title_asc"
  | "title_desc";

export type UiCategory = "Авто" | "Электроника" | "Недвижимость";
export type ViewMode = "grid" | "list";

type AdsStore = {
  view: ViewMode;
  sortMode: SortMode;
  selectedCategories: UiCategory[];
  onlyNeedsFix: boolean;
  currentPage: number;
  searchTerm: string;

  setView: (view: ViewMode) => void;
  setSortMode: (sortMode: SortMode) => void;
  toggleCategory: (category: UiCategory) => void;
  setOnlyNeedsFix: (value: boolean) => void;
  setCurrentPage: (value: number) => void;
  setSearchTerm: (value: string) => void;
  resetFilters: () => void;
};

const initialState = {
  view: "grid" as ViewMode,
  sortMode: "new" as SortMode,
  selectedCategories: [] as UiCategory[],
  onlyNeedsFix: false,
  currentPage: 1,
  searchTerm: "",
};

export const useAdsStore = create<AdsStore>()(
  persist(
    (set) => ({
      ...initialState,

      setView: (view) => set({ view }),

      setSortMode: (sortMode) =>
        set({
          sortMode,
          currentPage: 1,
        }),

      toggleCategory: (category) =>
        set((state) => ({
          selectedCategories: state.selectedCategories.includes(category)
            ? state.selectedCategories.filter((item) => item !== category)
            : [...state.selectedCategories, category],
          currentPage: 1,
        })),

      setOnlyNeedsFix: (value) =>
        set({
          onlyNeedsFix: value,
          currentPage: 1,
        }),

      setCurrentPage: (value) => set({ currentPage: value }),

      setSearchTerm: (value) =>
        set({
          searchTerm: value,
          currentPage: 1,
        }),

      resetFilters: () =>
        set({
          ...initialState,
        }),
    }),
    {
      name: "ads-filters-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        view: state.view,
        sortMode: state.sortMode,
        selectedCategories: state.selectedCategories,
        onlyNeedsFix: state.onlyNeedsFix,
        searchTerm: state.searchTerm,
      }),
    }
  )
);