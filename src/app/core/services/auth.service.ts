import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { TokenStorageService } from './token-storage.service';
import { environment } from 'src/environments/environment';

const API_URL = `${environment.backendUrl}`;

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorageService,
    private router: Router
  ) {
    // Inicializar con el usuario almacenado en sessionStorage
    const storedUser = this.tokenStorage.getUser();
    this.currentUserSubject = new BehaviorSubject<any>(storedUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  // Login: Envía credenciales al backend
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${API_URL}/auth/login`, { username, password })
      .pipe(
        tap(response => {
          if (response && response.token) {
            // Guardar token y usuario
            this.tokenStorage.saveToken(response.token);
            this.tokenStorage.saveUser(response);
            this.currentUserSubject.next(response);
          }
        })
      );
  }

  // Logout: Limpia sessionStorage y redirige al login
  logout(): void {
    this.tokenStorage.signOut();
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  // Verifica si el usuario está logueado
  public isLoggedIn(): boolean {
    const user = this.currentUserValue;
    return !!user && !!this.tokenStorage.getToken();
  }

  // Obtiene el usuario actual (sincrónico)
  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  // Obtiene el token del usuario
  public getToken(): string | null {
    return this.tokenStorage.getToken();
  }

  // Obtiene el rol del usuario
  public getRole(): string {
    const user = this.currentUserValue;
    return user?.rol || '';
  }

  // Verifica si es administrador
  isAdmin(): boolean {
    const role = this.getRole();
    return role === 'SUPER_ADMIN' || role === 'ENCARGADO';
  }

  // Verifica si tiene un permiso específico (simplificado)
  hasRoutePermission(route: string): boolean {
    // Aquí puedes implementar lógica de permisos según tu backend
    // Por ahora, retorna true si está logueado
    return this.isLoggedIn();
  }

  // Obtiene el dashboard URL según el rol
  getDashboardUrl(): string {
    const role = this.getRole();
    switch (role) {
      case 'SUPER_ADMIN':
      case 'ENCARGADO':
        return '/';
      default:
        return '/';
    }
  }

  // Obtiene el avatar del usuario
  public getAvatar(): string {
    const user = this.currentUserValue;
    return user?.avatar || 'default-profile1.png';
  }

  // Obtiene el username del usuario
  public getUsername(): string {
    const user = this.currentUserValue;
    return user?.username || '';
  }
}