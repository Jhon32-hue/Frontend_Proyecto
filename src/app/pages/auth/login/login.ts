import { Component, Renderer2, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth } from '../../../interfaces/auth';
import { AuthServices } from '../../../services/Auth/auth';
import { LogoTaskly } from '../../../component/logo-taskly/logo-taskly';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, LogoTaskly, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  email: string = '';
  password: string = '';
  darkMode: boolean = false;
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private authServices: AuthServices,
    private router: Router,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    const savedDark = localStorage.getItem('darkMode');
    if (savedDark !== null) {
      this.setDarkMode(savedDark === 'true');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      this.setDarkMode(prefersDark.matches);
    }
  }

  toggleDarkMode() {
    this.setDarkMode(!this.darkMode);
    localStorage.setItem('darkMode', this.darkMode.toString());
  }

  private setDarkMode(enabled: boolean) {
    this.darkMode = enabled;
    const root = document.documentElement;
    if (enabled) {
      this.renderer.addClass(root, 'dark');
    } else {
      this.renderer.removeClass(root, 'dark');
    }
  }

  onLogin() {
    const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}/;

    if (!this.email.trim() || !this.password.trim()) {
      this.errorMessage = 'Por favor valida los datos ingresados';
      this.resetError();
      return;
    }

    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Formato de correo no válido';
      this.resetError();
      return;
    }

    this.loading = true;

    this.authServices.login(this.email, this.password).subscribe({
      next: (res: any) => {
        const adaptedResponse: Auth = {
          refresh: res.refresh,
          access: res.access,
          user: {
            user_id: res.user_id,
            email: res.email,
            nombre_completo: res.nombre_completo
          }
        };

        localStorage.setItem('refreshToken', adaptedResponse.refresh);
        localStorage.setItem('accessToken', adaptedResponse.access);
        localStorage.setItem('user', JSON.stringify(adaptedResponse.user));
        localStorage.setItem('nombre_completo', adaptedResponse.user.nombre_completo);
        localStorage.setItem('user_id', adaptedResponse.user.user_id.toString());
        localStorage.setItem('email', adaptedResponse.user.email);

        this.errorMessage = '';
        this.loading = false;

        this.router.navigate(['/dashboard']).then(navigated => {
          console.log('¿Redirigido?', navigated);
        });
      },
      error: (err) => {
        console.error('Error en login:', err);
        this.loading = false;
        this.errorMessage = err?.error?.message || 'Ocurrió un error al iniciar sesión';
        this.resetError();
      }
    });
  }

  loginWithGoogle() {
    console.log('Iniciar sesión con Google...');
    // Aquí se integra el Firebase Auth o backend (OAuth2) para Google
  }

  private resetError() {
    setTimeout(() => this.errorMessage = '', 5000);
  }
}
