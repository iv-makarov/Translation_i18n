import {create} from "zustand";
import {persist} from "zustand/middleware";

type ThemeProviderStore = {
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;
};

const NAME_STORE = "theme-provider";

export const useThemeProviderStore = create<ThemeProviderStore>()(
  persist(
    (set) => ({
      theme: "system",
      setTheme: (theme: ThemeProviderStore["theme"]) => set({theme}),
    }),
    {
      name: NAME_STORE,
    }
  )
);
