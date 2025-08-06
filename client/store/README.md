# Zustand Store Guide

This document explains how to use Zustand stores in this application.

## Current Stores

### 1. Authentication Store (`authStore.ts`)
Manages user authentication state with persistent storage.

**Usage:**
```typescript
import { userAuthStore } from "@/store/authStore";

const { user, isAuthenticated, login, register, logout } = userAuthStore();
```

**Features:**
- Persistent user session
- Login/Register/Logout functionality
- User profile management
- Loading states and error handling

### 2. Chat Store (`chatStore.ts`)
Manages chat functionality with real-time messaging.

**Usage:**
```typescript
import { useChatStore } from "@/store/chatStore";

const { chats, currentChat, messages, sendMessage, createChat } = useChatStore();
```

**Features:**
- Chat list management
- Real-time message streaming
- Multiple loading states
- Error handling

## Creating New Stores

### Basic Store Pattern
```typescript
import { create } from "zustand";

interface MyState {
  data: any[];
  isLoading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
}

export const useMyStore = create<MyState>((set, get) => ({
  data: [],
  isLoading: false,
  error: null,
  
  fetchData: async () => {
    try {
      set({ isLoading: true, error: null });
      // API call here
      const response = await api.get("/endpoint");
      set({ data: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
```

### Store with Persistence
```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const usePersistentStore = create(
  persist(
    (set, get) => ({
      // your state and actions
    }),
    {
      name: "store-name",
      partialize: (state) => ({
        // only persist specific fields
        user: state.user,
        settings: state.settings,
      }),
    }
  )
);
```

## Best Practices

1. **TypeScript**: Always define interfaces for your state
2. **Loading States**: Include loading states for async operations
3. **Error Handling**: Implement proper error handling
4. **Persistence**: Use persist middleware for important data
5. **Selective Updates**: Use `set` with functions for complex state updates
6. **Immutability**: Always return new objects/arrays, don't mutate state

## Store Composition

For complex applications, consider splitting stores by domain:
- `authStore.ts` - Authentication
- `chatStore.ts` - Chat functionality
- `uiStore.ts` - UI state (modals, themes, etc.)
- `settingsStore.ts` - User preferences

## Performance Tips

1. **Selective Subscriptions**: Only subscribe to the state you need
2. **Shallow Comparison**: Use shallow comparison for object updates
3. **Memoization**: Use React.memo for components that depend on store state
4. **Batch Updates**: Group related state updates together

## Example: UI Store

Here's an example of a UI store you might want to add:

```typescript
// store/uiStore.ts
import { create } from "zustand";

interface UIState {
  theme: "light" | "dark";
  sidebarOpen: boolean;
  modalOpen: boolean;
  setTheme: (theme: "light" | "dark") => void;
  toggleSidebar: () => void;
  setModalOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  theme: "light",
  sidebarOpen: false,
  modalOpen: false,
  
  setTheme: (theme) => set({ theme }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setModalOpen: (open) => set({ modalOpen: open }),
}));
```

## Testing Stores

```typescript
// Example test
import { renderHook, act } from "@testing-library/react";
import { useMyStore } from "@/store/myStore";

test("should update state", () => {
  const { result } = renderHook(() => useMyStore());
  
  act(() => {
    result.current.setData([1, 2, 3]);
  });
  
  expect(result.current.data).toEqual([1, 2, 3]);
});
```