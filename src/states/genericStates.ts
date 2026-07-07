import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { LanguageType } from "../locales";
import { stateStorage } from "../utils/stateStorage";

interface GenericPersistentStates {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
}

const useGenericPersistentState = create<GenericPersistentStates>()(
  persist(
    (set) => ({
      language: "en",
      setLanguage: (lang) => set(() => ({ language: lang })),
    }),
    {
      name: "generic-state-storage",
      storage: createJSONStorage(() => stateStorage),
    }
  )
);

export { useGenericPersistentState };
