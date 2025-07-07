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

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}

  login(emailFromParameter: string, passwordFromParameter: string): Observable<any> {
    const url = this.apiUrl + 'token/';
    const body = { email: emailFromParameter, password: passwordFromParameter };
    return this.http.post<any>(url, body);
  }

  // Método register corregido para incluir almacenamiento del token en localStorage
  register(data: RegisterRequest): Observable<any> {
    const url = this.apiUrl + 'registro/';
    return this.http.post<any>(url, data).pipe(
      tap((response) => {
        // Verifica que la respuesta contiene el token
        if (response && response.accessToken) {
          localStorage.setItem('accessToken', response.accessToken);
          console.log('Token guardado en localStorage:', response.accessToken);  // Log para verificar
        }
      }),
      catchError((error) => {
        // Manejo de errores
        console.error('Error al registrar:', error);
        throw error; // Re-lanzamos el error para que el componente lo maneje
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

  aceptarInvitacion(participacion: string, token: string, uid: string): Observable<any> {
  const url = `http://127.0.0.1:8000/api/gestion-invitacion/`;
  const params = {
    participacion,
    token,
    uid  
  };

  return this.http.post<any>(url, {}, {
    params,
    headers: {}  // no Authorization
  });
}
}