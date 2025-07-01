import { Injectable } from '@angular/core';
import { Auth } from '../../interfaces/auth';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Register, RegisterRequest } from '../../interfaces/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthServices {
  private apiUrl: string = 'http://127.0.0.1:8000/api/usuarios/';

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}

  login(emailFromParameter: string, passwordFromParameter: string): Observable<Auth> {
    const url = this.apiUrl + 'token/';
    const body = { email: emailFromParameter, password: passwordFromParameter };
    return this.http.post<Auth>(url, body);
  }

  register(data: RegisterRequest): Observable<Register> {
    const url = this.apiUrl + 'registro/';
    return this.http.post<Register>(url, data);
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
}
