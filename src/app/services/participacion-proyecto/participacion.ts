import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ParticipacionProyecto } from '../../interfaces/participacion-proyecto';
import { Rol } from '../../interfaces/participacion-proyecto';  
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ParticipacionService {
  private apiUrl: string = 'http://127.0.0.1:8000/api/proyectos/gestion/';
  private rolesUrl: string = 'http://127.0.0.1:8000/api/usuarios/';  
  constructor(private readonly http: HttpClient) {}

  // Obtener participaciones por proyecto
  getParticipacionesPorProyecto(idProyecto: number): Observable<ParticipacionProyecto[]> {
    const url = `${this.apiUrl}${idProyecto}/con-participaciones/`;
    return this.http.get<ParticipacionProyecto[]>(url);
  }

  // Obtener roles disponibles
  getRoles(): Observable<Rol[]> {
  const url = `${this.rolesUrl}roles`;
  return this.http.get<{ roles: Rol[] }>(url).pipe(
    map(response => response.roles)
  );
}

  editarParticipacion(id: number, data: Partial<ParticipacionProyecto>): Observable<ParticipacionProyecto> {
    const url = `http://127.0.0.1:8000/api/proyectos/participaciones/${id}/`;
    return this.http.patch<ParticipacionProyecto>(url, data);
  }

}
