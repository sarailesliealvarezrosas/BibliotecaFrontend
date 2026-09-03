// import { Component } from '@angular/core';
// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [],
//   templateUrl: './login.component.html',
//   styleUrl: './login.component.scss'
// })
// export class LoginComponent {

// }
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../../../core/services/auth.service';
import { TokenStorageService } from '../../../core/services/token-storage.service';
import { GlobalComponent } from '../../../global-component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  submitted = false;
  loading = false;
  loginError = '';
  passwordFieldType = 'password';
  appName = GlobalComponent.NAME_APP;
  currentYear = new Date().getFullYear();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthenticationService,
    private tokenStorage: TokenStorageService
  ) {
    // Si ya está logueado, redirigir al dashboard
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  // Getter para fácil acceso a los campos del formulario
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.loginError = '';

    // Si el formulario es inválido, detener
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    const { username, password } = this.loginForm.value;

    this.authService.login(username, password)
      .pipe(first())
      .subscribe({
        next: (data) => {
          // Guardar toast para mostrar mensaje de bienvenida
          sessionStorage.setItem('toast', 'true');
          // Redirigir al dashboard
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.loginError = error || 'Credenciales incorrectas. Por favor, inténtalo de nuevo.';
          this.loading = false;
        }
      });
  }

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }
}