import { create } from "zustand";
import type { IMerchant } from "@/types";

interface IAppState {
  sidebarCollapsed: boolean;
  notificationsOpen: boolean;
  merchant: IMerchant | null;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setNotificationsOpen: (open: boolean) => void;
  setMerchant: (merchant: IMerchant | null) => void;
}

export const useAppStore = create<IAppState>((set) => ({
  sidebarCollapsed: false,
  notificationsOpen: false,
  merchant: null,
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setNotificationsOpen: (open) => set({ notificationsOpen: open }),
  setMerchant: (merchant) => set({ merchant }),
}));
