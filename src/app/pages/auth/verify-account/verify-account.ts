import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthServices } from '../../../services/Auth/auth';
import { CommonModule } from '@angular/common';
import { LogoTaskly } from '../../../component/logo-taskly/logo-taskly';

@Component({
  selector: 'verify-account',
  standalone: true,
  templateUrl: './verify-account.html',
  styleUrl: './verify-account.css',
  imports: [CommonModule, LogoTaskly]
})
export class VerifyAccount implements OnInit {

  loading = false;
  errorMessage = '';
  successMessage = '';
  darkMode = false;

  constructor(
    private route: ActivatedRoute,
    private authServices: AuthServices,
    private router: Router,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.setInitialDarkMode();
    this.aceptarInvitacion();
  }

  aceptarInvitacion(): void {
    const uid = this.route.snapshot.queryParamMap.get('uid');
    const participacion = this.route.snapshot.queryParamMap.get('participacion');
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!uid || !participacion || !token) {
      this.errorMessage = '❌ Faltan parámetros en el enlace de invitación.';
      return;
    }

    this.loading = true;

    this.authServices.aceptarInvitacion(participacion, token, uid).subscribe({
      next: (res) => {
        if (res.access && res.refresh) {
          localStorage.setItem('accessToken', res.access);
          localStorage.setItem('refreshToken', res.refresh);
        }

        localStorage.setItem('user_id', res.usuario.id.toString());
        localStorage.setItem('email', res.usuario.email);
        localStorage.setItem('nombre_completo', res.usuario.nombre);
        localStorage.setItem('user', JSON.stringify(res.usuario));
        localStorage.setItem('participacion_id', res.proyecto.id.toString());

        this.successMessage = '🎉 Invitación aceptada exitosamente. Redirigiendo...';
        this.loading = false;

        setTimeout(() => this.router.navigate(['/dashboard']), 1500);
      },
      error: (err) => {
        console.error('❌ Error al aceptar invitación:', err);
        this.errorMessage = err?.error?.error || 'Ocurrió un error al aceptar la invitación.';
        this.loading = false;
        setTimeout(() => (this.errorMessage = ''), 5000);
      }
    });
  }

  // ─────────── DARK MODE ───────────
  toggleDarkMode(): void {
    this.setDarkMode(!this.darkMode);
  }

  private setDarkMode(enabled: boolean): void {
    this.darkMode = enabled;
    localStorage.setItem('darkMode', enabled.toString());
    const root = document.documentElement;
    enabled
      ? this.renderer.addClass(root, 'dark')
      : this.renderer.removeClass(root, 'dark');
  }

  private setInitialDarkMode(): void {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      this.setDarkMode(saved === 'true');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      this.setDarkMode(prefersDark.matches);
      prefersDark.addEventListener('change', (e) => this.setDarkMode(e.matches));
    }
  }
}
