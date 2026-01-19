import { makeAutoObservable } from 'mobx';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'USER' | 'DRIVER';
}

export class AuthStore {
  user: User | null = null;
  isAuthenticated = false;
  isLoading = false;

  constructor() {
    makeAutoObservable(this);
    this.loadFromStorage();
    
    if (!this.isAuthenticated) {
      this.autoLogin();
    }
  }

  loadFromStorage() {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        this.user = JSON.parse(stored);
        this.isAuthenticated = true;
      } catch (e) {
        console.error('Error loading user from storage', e);
      }
    }
  }

  async login(email: string, password: string) {
    this.isLoading = true;
    try {
      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0],
        role: 'ADMIN',
      };
      
      this.user = mockUser;
      this.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(mockUser));
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      this.isLoading = false;
    }
  }

  logout() {
    this.user = null;
    this.isAuthenticated = false;
    localStorage.removeItem('user');
  }

  private autoLogin() {
    const mockUser: User = {
      id: '1',
      email: 'admin@test.com',
      name: 'Admin User',
      role: 'ADMIN',
    };
    
    this.user = mockUser;
    this.isAuthenticated = true;
    localStorage.setItem('user', JSON.stringify(mockUser));
  }

  get displayName() {
    return this.user?.name || this.user?.email || 'Usuario';
  }
}
