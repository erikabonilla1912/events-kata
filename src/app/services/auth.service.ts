import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';

  login(email: string, password: string): boolean {
    if (email === 'admin@example.com' && password === 'admin123') {
      localStorage.setItem(this.TOKEN_KEY, 'true');
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return localStorage.getItem(this.TOKEN_KEY) === 'true';
  }
}
