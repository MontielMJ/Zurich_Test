import { Injectable } from '@angular/core';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';

export interface UserInfo {
  fullname: string;
  name: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'authToken';
  private userKey = 'userEmail';
  private isLoggedInKey = 'isLoggedIn';
  private userRoleKey = 'userRole';

  private authStatus = new BehaviorSubject<boolean>(this.isLoggedIn());
  public authStatus$ = this.authStatus.asObservable();

  private userInfo = new BehaviorSubject<{ email: string, name: string, role: string } | null>(this.getUserInfo());
  public userInfo$ = this.userInfo.asObservable();

  constructor(private apiService: ApiService) {
    this.checkInitialAuthState();
  }

  private checkInitialAuthState(): void {
    const isLoggedIn = this.isLoggedIn();
    this.authStatus.next(isLoggedIn);
    this.userInfo.next(this.getUserInfo());
  }
  login(credentials: { username: string; password: string }): Observable<any> {
    return this.apiService.login(credentials).pipe(
      tap(response => {
        if (response && response.token) {
          this.setAuthData(response.token, credentials.username);
          this.authStatus.next(true);
          this.userInfo.next(this.getUserInfo());
        }
      })
    );
  }

  private setAuthData(token: string, fullname: string): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, fullname);
    localStorage.setItem(this.isLoggedInKey, 'true');
    const role = this.getUserRole();
    if (role) {
      localStorage.setItem(this.userRoleKey, role);
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
  getUserRole(): string | null {
    const payload = this.getTokenPayload();
    const roleFromToken = payload?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
    return roleFromToken || localStorage.getItem(this.userRoleKey);
  }
  isLoggedIn(): boolean {
    return localStorage.getItem(this.isLoggedInKey) === 'true' && this.getToken() !== null;
  }
  getUserEmail(): string | null {
    return localStorage.getItem(this.userKey);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.isLoggedInKey);
    localStorage.removeItem(this.userRoleKey);

    this.authStatus.next(false);
    this.userInfo.next(null);

    console.log('Sesión cerrada');
  }


  getUserInfo(): { email: string, name: string, role: string } | null {
    if (!this.isLoggedIn()) return null;

    const email = this.getUserEmail();
    const name = this.getUserName() || email || 'Usuario';
    const role = this.getUserRole() || 'Usuario';

    return { email: email || '', name, role };
  }

  getTokenPayload(): any {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (error) {
      console.error('Error decodificando token:', error);
      return null;
    }
  }

  getUserName(): string | null {
    const payload = this.getTokenPayload();
    return payload?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || null;
  }

  isAdmin(): boolean {
    const role = this.getUserRole();
    return role === 'Admin';
  }

  // Verificar si el usuario tiene un rol específico
  hasRole(role: string): boolean {
    const userRole = this.getUserRole();
    return userRole === role;
  }

}