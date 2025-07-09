import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../interfaces/auth'; 
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private baseUrl = 'http://127.0.0.1:8000/api'; // base limpia

  constructor(private http: HttpClient) {}

  obtenerEstadisticas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/proyectos/gestion/estadisticas/`);
  }

  obtenerUsuarioActual(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/usuarios/perfil/`);
  }

 actualizarPerfil(data: User) {
  return this.http.patch<User>(`${this.baseUrl}/usuarios/perfil/`, data);
}




}
