import { Component, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LogoTaskly } from '../../../component/logo-taskly/logo-taskly';
import { AuthServices } from '../../../services/Auth/auth';
import { RegisterRequest } from '../../../interfaces/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, LogoTaskly, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  fullName: string = '';
  email: string = '';
  password: string = '';
  darkMode: boolean = false;

  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private renderer: Renderer2,
    private authService: AuthServices,
    private router: Router
  ) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.setDarkMode(prefersDark.matches);

    prefersDark.addEventListener('change', (e) => {
      this.setDarkMode(e.matches);
    });
  }

  onRegister() {
    // Validaciones previas
    if (!this.fullName.trim() || !this.email.trim() || !this.password.trim()) {
      this.errorMessage = 'Todos los campos son obligatorios';
      this.successMessage = '';
      setTimeout(() => this.errorMessage = '', 5000);
      return;
    }

    const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Formato de correo no válido';
      this.successMessage = '';
      setTimeout(() => this.errorMessage = '', 5000);
      return;
    }

    const payload: RegisterRequest = {
      email: this.email,
      nombre_completo: this.fullName,
      password: this.password
    };

    this.loading = true;
    this.authService.register(payload).subscribe({
      next: (response) => {
        this.successMessage = 'Registro exitoso';
        this.errorMessage = '';
        this.loading = false;

        this.fullName = '';
        this.email = '';
        this.password = '';

        console.log('Respuesta de backend:', response);

        // Redirección con espera
        setTimeout(() => {
          this.successMessage = '';
          this.router.navigate(['/dashboard']).then(navigated => {
            console.log('¿Redirigido?', navigated);
          });
        }, 2000);
      },

      error: (error) => {
        this.errorMessage = error?.error?.detail || 'Error al registrar';
        this.successMessage = '';
        this.loading = false;
        console.error('Error al registrar:', error);
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
