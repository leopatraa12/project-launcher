import { create } from "zustand";

export type DashboardSection = "home" | "server" | "community" | "store";

interface DashboardNavState {
  requestedSection: DashboardSection | null;
  scrollToSection: (section: DashboardSection) => void;
  clearRequestedSection: () => void;
}

const useDashboardNav = create<DashboardNavState>()((set) => ({
  requestedSection: null,
  scrollToSection: (section) => set({ requestedSection: section }),
  clearRequestedSection: () => set({ requestedSection: null }),
}));

export { useDashboardNav };
