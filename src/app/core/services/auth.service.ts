import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { TokenStorageService } from './token-storage.service';
import { logout, logoutSuccess } from 'src/app/store/Authentication/authentication.actions';
import { MenuItem } from 'src/app/layouts/sidebar/menu.model';
import { UserRol } from '../data/UserData';
import { GlobalComponent } from 'src/app/global-component';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

  constructor(private router: Router) {}

  public isLoggedIn(): boolean {
    return true;
  }

  isAdmin(): boolean {
    return true;
  }

  hasPermission(modulo: string): string[] {
    return [];
  }

  hasRoutePermission(route: string): boolean {
    return true;
  }

  getDashboardUrl(): string {
    return '/';
  }

  logout() {
    this.router.navigate(['/']);
  }

  public tokenUser(): any {
    return null;
  }

  public currentUser(): any {
    return null;
  }

  public getAvatar(): string {
    return 'default-profile1.png';
  }

  public getRole(): string {
    return '';
  }
}