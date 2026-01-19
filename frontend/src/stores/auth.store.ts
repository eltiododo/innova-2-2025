import { makeAutoObservable, runInAction } from 'mobx';

export interface User {
    id: string;
    username: string;
    email: string;
    role: 'ADMIN' | 'USER' | 'DRIVER';
}

export class AuthStore {
    user: User | null = null;
    isAuthenticated = false;
    isLoading = false;
    error: string | null = null;

    constructor() {
        makeAutoObservable(this);
        // Check for existing session on initialization
        this.checkAuth();
    }

    // Check if user has a valid session (e.g., token in localStorage)
    checkAuth() {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (storedUser && token) {
            runInAction(() => {
                this.user = JSON.parse(storedUser);
                this.isAuthenticated = true;
            });
        }
    }

    // Login action
    async login(email: string, _password: string): Promise<boolean> {
        this.isLoading = true;
        this.error = null;

        try {
            // TODO: Replace with actual API call
            // const response = await fetch('/api/auth/login', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({ email, password }),
            // });

            // Simulated successful login for development
            await new Promise(resolve => setTimeout(resolve, 1000));

            const mockUser: User = {
                id: '1',
                username: 'Admin Usuario',
                email: email,
                role: 'ADMIN',
            };
            const mockToken = 'mock-jwt-token-' + Date.now();

            runInAction(() => {
                this.user = mockUser;
                this.isAuthenticated = true;
                this.isLoading = false;
            });

            // Persist to localStorage
            localStorage.setItem('user', JSON.stringify(mockUser));
            localStorage.setItem('token', mockToken);

            return true;
        } catch (error) {
            runInAction(() => {
                this.error = error instanceof Error ? error.message : 'Error de autenticación';
                this.isLoading = false;
            });
            return false;
        }
    }

    // Logout action
    logout() {
        this.user = null;
        this.isAuthenticated = false;
        this.error = null;

        // Clear localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }

    // Computed property for display name
    get displayName(): string {
        return this.user?.username || 'Usuario';
    }

    // Computed property for user role
    get userRole(): string {
        return this.user?.role || 'USER';
    }

    // Check if user has admin privileges
    get isAdmin(): boolean {
        return this.user?.role === 'ADMIN';
    }
}

// Create singleton instance
export const authStore = new AuthStore();
