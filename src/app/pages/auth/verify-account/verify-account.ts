import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthServices } from '../../../services/Auth/auth';
import { CommonModule } from '@angular/common';
import { LogoTaskly } from '../../../component/logo-taskly/logo-taskly';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'verify-account',
  standalone: true,
  templateUrl: './verify-account.html',
  styleUrl: './verify-account.css',
  imports: [CommonModule, LogoTaskly,FormsModule]
})
export class VerifyAccount implements OnInit {
  loading = false;
  errorMessage = '';
  successMessage = '';
  darkMode = false;

  uid = '';
  token = '';
  participacion = '';

  usuarioActivo = false;
  datosUsuario: any = null;
  nombre_completo = '';
  password = '';

  constructor(
    private route: ActivatedRoute,
    private authServices: AuthServices,
    private router: Router,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.setInitialDarkMode();
    this.uid = this.route.snapshot.queryParamMap.get('uid') || '';
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    this.participacion = this.route.snapshot.queryParamMap.get('participacion') || '';

    if (!this.uid || !this.token || !this.participacion) {
      this.errorMessage = '❌ Faltan parámetros en el enlace.';
      return;
    }

    this.verificarInvitacion();
  }

  verificarInvitacion(): void {
    this.loading = true;
    this.authServices.verificarInvitacion(this.uid, this.participacion, this.token).subscribe({
      next: (res) => {
        this.usuarioActivo = res.usuario_activo;
        this.datosUsuario = res;
        this.loading = false;

        if (this.usuarioActivo) {
          this.enviarAceptacion();
        }
      },
      error: (err) => {
        this.errorMessage = err?.error?.error || '❌ Error al verificar invitación.';
        this.loading = false;
      }
    });
  }

  enviarAceptacion(): void {
    this.loading = true;
    this.authServices.aceptarInvitacion(this.participacion, this.token, this.uid).subscribe({
      next: (res) => {
        localStorage.setItem('accessToken', res.access || '');
        localStorage.setItem('refreshToken', res.refresh || '');
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
        this.errorMessage = err?.error?.error || '❌ Error al aceptar invitación.';
        this.loading = false;
      }
    });
  }

  completarRegistro(): void {
    if (!this.nombre_completo || !this.password) {
      this.errorMessage = '❌ Debes ingresar nombre y contraseña.';
      return;
    }

    this.loading = true;

    this.authServices.aceptarInvitacionConDatos(
      this.uid,
      this.participacion,
      this.token,
      this.nombre_completo,
      this.password
    ).subscribe({
      next: (res) => {
        localStorage.setItem('accessToken', res.access || '');
        localStorage.setItem('refreshToken', res.refresh || '');
        localStorage.setItem('user_id', res.usuario.id.toString());
        localStorage.setItem('email', res.usuario.email);
        localStorage.setItem('nombre_completo', res.usuario.nombre);
        localStorage.setItem('user', JSON.stringify(res.usuario));
        localStorage.setItem('participacion_id', res.proyecto.id.toString());

        this.successMessage = '🎉 Registro completado. Redirigiendo...';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/dashboard']), 1500);
      },
      error: (err) => {
        this.errorMessage = err?.error?.error || '❌ Error al completar registro.';
        this.loading = false;
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
