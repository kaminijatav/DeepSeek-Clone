import { userAuthStore } from "../../store/authStore";
import { useChatStore } from "../../store/chatStore";
import { useUIStore } from "../../store/uiStore";

/**
 * Custom hook that provides access to all stores
 * This makes it easier to access multiple stores in a single component
 */
export const useStores = () => {
  const auth = userAuthStore();
  const chat = useChatStore();
  const ui = useUIStore();

  return {
    auth,
    chat,
    ui,
  };
};

/**
 * Hook for authentication-related state and actions
 */
export const useAuth = () => {
  return userAuthStore();
};

/**
 * Hook for chat-related state and actions
 */
export const useChat = () => {
  return useChatStore();
};

/**
 * Hook for UI-related state and actions
 */
export const useUI = () => {
  return useUIStore();
};