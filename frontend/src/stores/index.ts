import { createContext, useContext } from 'react';
import { AuthStore, authStore } from './auth.store';

// Root store that holds all stores
export class RootStore {
    authStore: AuthStore;

    constructor() {
        this.authStore = authStore;
    }
}

// Create singleton root store
export const rootStore = new RootStore();

// React Context for the store
export const StoreContext = createContext<RootStore>(rootStore);

// Custom hook to use the store
export function useStore(): RootStore {
    const context = useContext(StoreContext);
    if (!context) {
        throw new Error('useStore must be used within a StoreProvider');
    }
    return context;
}

// Custom hook for auth store specifically
export function useAuthStore(): AuthStore {
    const { authStore } = useStore();
    return authStore;
}

// Re-export stores
export { authStore } from './auth.store';
export type { User } from './auth.store';
