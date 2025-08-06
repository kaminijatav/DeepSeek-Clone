import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  // Theme
  theme: "light" | "dark";
  
  // Sidebar
  sidebarOpen: boolean;
  
  // Modals
  modalOpen: boolean;
  modalType: string | null;
  
  // Notifications
  notifications: Array<{
    id: string;
    type: "success" | "error" | "warning" | "info";
    message: string;
    duration?: number;
  }>;
  
  // Loading states
  globalLoading: boolean;
  
  // Actions
  setTheme: (theme: "light" | "dark") => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  openModal: (type: string) => void;
  closeModal: () => void;
  addNotification: (notification: Omit<UIState["notifications"][0], "id">) => void;
  removeNotification: (id: string) => void;
  setGlobalLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Initial state
      theme: "light",
      sidebarOpen: false,
      modalOpen: false,
      modalType: null,
      notifications: [],
      globalLoading: false,

      // Actions
      setTheme: (theme) => {
        set({ theme });
        // Apply theme to document
        document.documentElement.setAttribute("data-theme", theme);
      },

      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
      },

      setSidebarOpen: (open) => {
        set({ sidebarOpen: open });
      },

      openModal: (type) => {
        set({ modalOpen: true, modalType: type });
      },

      closeModal: () => {
        set({ modalOpen: false, modalType: null });
      },

      addNotification: (notification) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newNotification = { ...notification, id };
        
        set((state) => ({
          notifications: [...state.notifications, newNotification],
        }));

        // Auto-remove notification after duration (default: 5000ms)
        const duration = notification.duration || 5000;
        setTimeout(() => {
          get().removeNotification(id);
        }, duration);
      },

      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },

      setGlobalLoading: (loading) => {
        set({ globalLoading: loading });
      },
    }),
    {
      name: "ui-storage",
      partialize: (state) => ({
        theme: state.theme,
      }),
    }
  )
);