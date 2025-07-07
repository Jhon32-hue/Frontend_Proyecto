import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterRequest } from '../../interfaces/auth';
import { Router } from '@angular/router';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthServices {
  private apiUrl: string = 'http://127.0.0.1:8000/api/usuarios/';
  private invitacionUrl: string = 'http://127.0.0.1:8000/api/gestion-invitacion/';

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}

  // ─────────── AUTH BÁSICA ───────────

  login(emailFromParameter: string, passwordFromParameter: string): Observable<any> {
    const url = this.apiUrl + 'token/';
    const body = { email: emailFromParameter, password: passwordFromParameter };
    return this.http.post<any>(url, body);
  }

  register(data: RegisterRequest): Observable<any> {
    const url = this.apiUrl + 'registro/';
    return this.http.post<any>(url, data).pipe(
      tap((response) => {
        if (response && response.accessToken) {
          localStorage.setItem('accessToken', response.accessToken);
          console.log('Token guardado en localStorage:', response.accessToken);
        }
      }),
      catchError((error) => {
        console.error('Error al registrar:', error);
        throw error;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    this.router.navigate(['']);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp;
      return Date.now() < exp * 1000;
    } catch {
      return false;
    }
  }

  getUsuarioActual(): { user_id: number; email: string; nombre_completo: string } | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  // ─────────── GESTIÓN DE INVITACIONES ───────────

  /**
   * Verifica si la invitación es válida y si el usuario está activo o no.
   */
  verificarInvitacion(uid: string, participacion: string, token: string): Observable<any> {
    const params = { uid, participacion, token };
    return this.http.get<any>(this.invitacionUrl, { params });
  }

  /**
   * Acepta la invitación si el usuario ya está registrado y activo.
   */
  aceptarInvitacion(participacion: string, token: string, uid: string): Observable<any> {
    const params = { uid, participacion, token };
    return this.http.post<any>(this.invitacionUrl, {}, { params });
  }

  /**
   * Acepta la invitación si el usuario está inactivo (completa nombre y contraseña).
   */
  aceptarInvitacionConDatos(
    uid: string,
    participacion: string,
    token: string,
    nombre_completo: string,
    password: string
  ): Observable<any> {
    const params = { uid, participacion, token };
    const body = { nombre_completo, password };
    return this.http.post<any>(this.invitacionUrl, body, { params });
  }
}
