import { createContext, useContext } from 'react';
import { AuthStore } from './authStore';

class RootStore {
  authStore: AuthStore;

  constructor() {
    this.authStore = new AuthStore();
  }
}

export const rootStore = new RootStore();

export const StoreContext = createContext<RootStore>(rootStore);

export const useStore = () => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return store;
};

export const useAuthStore = () => {
  const { authStore } = useStore();
  return authStore;
};

export { AuthStore };
