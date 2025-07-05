import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ParticipacionProyecto } from '../../interfaces/participacion-proyecto';

@Injectable({
  providedIn: 'root',
})
export class ParticipacionService {
  private apiUrl: string = 'http://127.0.0.1:8000/api/proyectos/gestion/';

  constructor(private readonly http: HttpClient) {}
  
  getParticipacionesPorProyecto(idProyecto: number): Observable<ParticipacionProyecto[]> {
    const url = `${this.apiUrl}${idProyecto}/con-participaciones/`;
    return this.http.get<ParticipacionProyecto[]>(url);
  }
}
