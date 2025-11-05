import { create } from "zustand";
import { fetchAttractions } from "../services/api";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create zustand store
const useStore = create(
  persist(
    (set, get) => ({
      attractions: [],
      favorites: [],
      loading: false,
      error: null,

      fetchAttractions: async () => {
        set({ loading: true, error: null });
        try {
          const data = await fetchAttractions();
          set({ attractions: data, loading: false });
        } catch (error) {
          set({ error: "Failed to fetch attractions", loading: false });
        }
      },

      toggleFavorite: (id) => {
        const { favorites } = get();
        const isFavorite = favorites.includes(id);
        const newFavorites = isFavorite
          ? favorites.filter((favId) => favId !== id)
          : [...favorites, id];
        set({ favorites: newFavorites });
      },

      isFavorite: (id) => get().favorites.includes(id),
    }),
    {
      name: "store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useStore;
