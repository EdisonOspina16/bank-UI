const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface RegisterData {
  email: string;
  phoneCountry: string;
  phoneNumber: string;
  pin: string;
  firstName: string;
  lastName: string;
  docType: string;
  docNumber: string;
}

export interface LoginData {
  docType: string;
  docNumber: string;
  pin: string;
}

export interface AuthResponse {
  message: string;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  user: {
    id: string;
    email: string;
    phoneCountry: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    docType: string;
    docNumber: string;
  };
}

export class AuthService {
  static async register(data: RegisterData): Promise<{ message: string; tokens: any; user: any }> {
    const response = await fetch(`${API_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const body = await response.json();
    if (!response.ok) {
      throw new Error(body.error || 'Error al registrarse.');
    }

    return body;
  }

  static async login(data: LoginData): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const body = await response.json();
    if (!response.ok) {
      throw new Error(body.error || 'Error al iniciar sesión.');
    }

    return body;
  }

  static saveSession(authData: AuthResponse): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', authData.tokens.accessToken);
      localStorage.setItem('refreshToken', authData.tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(authData.user));
    }
  }

  static getSessionUser() {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  static getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  }

  static async refreshSession(): Promise<string | null> {
    if (typeof window === 'undefined') return null;
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return null;

    try {
      const response = await fetch(`${API_URL}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      if (!response.ok) return null;
      const body = await response.json();
      if (body?.tokens?.accessToken) {
        localStorage.setItem('accessToken', body.tokens.accessToken);
        if (body.tokens.refreshToken) {
          localStorage.setItem('refreshToken', body.tokens.refreshToken);
        }
        return body.tokens.accessToken as string;
      }
    } catch {
      return null;
    }
    return null;
  }

  static logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }

  static isAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('accessToken');
    }
    return false;
  }
}
