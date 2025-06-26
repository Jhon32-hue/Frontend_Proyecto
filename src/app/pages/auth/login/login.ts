import { Component, Renderer2 } from '@angular/core'; 
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
export class Login {
  email: string = '';
  password: string = '';
  darkMode: boolean = false;
  errorMessage: string = '';

  constructor(
    private authServices: AuthServices,
    private router: Router,
    private renderer: Renderer2
  ) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.setDarkMode(prefersDark.matches);

    prefersDark.addEventListener('change', (e) => {
      this.setDarkMode(e.matches);
    });
  }

  onLogin() {
    const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}/;

    if (!this.email.trim() || !this.password.trim()) {
      this.errorMessage = 'Por favor valida los datos ingresados';
      setTimeout(() => this.errorMessage = '', 5000);
      return;
    }

    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Formato de correo no válido';
      setTimeout(() => this.errorMessage = '', 5000);
      return;
    }

    this.authServices.login(this.email, this.password).subscribe({
      next: (res: any) => {
        console.log('Respuesta del backend:', res);

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

        this.router.navigate(['/dashboard']).then(navigated => {
        console.log('¿Redirigido?', navigated);
      });
      },
      error: (err) => {
        console.error('Error en login:', err);
        this.errorMessage = err?.error?.message || 'Ocurrió un error al iniciar sesión';
        setTimeout(() => this.errorMessage = '', 5000);
      }
    });
  }

  toggleDarkMode() {
    this.setDarkMode(!this.darkMode);
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
}
