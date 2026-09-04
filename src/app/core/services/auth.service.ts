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
    
    const storedUser = this.tokenStorage.getUser();
    this.currentUserSubject = new BehaviorSubject<any>(storedUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }


  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${API_URL}/auth/login`, { username, password })
      .pipe(
        tap(response => {
          if (response && response.token) {
       
            this.tokenStorage.saveToken(response.token);
            this.tokenStorage.saveUser(response);
            this.currentUserSubject.next(response);
          }
        })
      );
  }

    logout(): void {
    this.tokenStorage.signOut();
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  public isLoggedIn(): boolean {
    const user = this.currentUserValue;
    return !!user && !!this.tokenStorage.getToken();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  public getToken(): string | null {
    return this.tokenStorage.getToken();
  }


  public getRole(): string {
    const user = this.currentUserValue;
    return user?.rol || '';
  }


  isAdmin(): boolean {
    const role = this.getRole();
    return role === 'SUPER_ADMIN' || role === 'ENCARGADO';
  }

  hasRoutePermission(route: string): boolean {
      return this.isLoggedIn();
  }

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

  public getAvatar(): string {
    const user = this.currentUserValue;
    return user?.avatar || 'default-profile1.png';
  }

  public getUsername(): string {
    const user = this.currentUserValue;
    return user?.username || '';
  }
}