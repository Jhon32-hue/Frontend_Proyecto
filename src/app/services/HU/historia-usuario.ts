import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HistoriaUsuario } from '../../interfaces/historia-usuario'; // ruta correcta a tu interface

@Injectable({
  providedIn: 'root'
})
export class HistoriaUsuarioService {
  private readonly endpoint = 'http://127.0.0.1:8000/api/proyectos/historia_usuario/';

  constructor(private readonly http: HttpClient) {}

  /** 🔹 Todas las HU del usuario autenticado */
  listAll(): Observable<HistoriaUsuario[]> {
    return this.http.get<HistoriaUsuario[]>(this.endpoint);
  }

  /** 🔹 HU asociadas a un proyecto específico */
  listByProyecto(proyectoId: number): Observable<HistoriaUsuario[]> {
    return this.http.get<HistoriaUsuario[]>(this.endpoint, {
      params: { proyecto: proyectoId.toString() }
    });
  }

  /** 🔹 Actualizar parcialmente una HU */
  update(id: number, payload: Partial<HistoriaUsuario>): Observable<HistoriaUsuario> {
    return this.http.patch<HistoriaUsuario>(`${this.endpoint}${id}/`, payload);
  }

  /** 🔹 Crear nueva HU */
  create(payload: Partial<HistoriaUsuario>): Observable<HistoriaUsuario> {
    return this.http.post<HistoriaUsuario>(this.endpoint, payload);
  }

  /** 🔹 Eliminar HU */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}${id}/`);
  }
}
