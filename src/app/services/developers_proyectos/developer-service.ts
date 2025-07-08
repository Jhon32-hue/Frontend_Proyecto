import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Participacion {
  id_participacion: number;
  id_usuario: {
    id: number;
    nombre_completo: string;
    email: string;
  };
  id_rol: {
    nombre_rol: string;
    
  };
}


@Injectable({
  providedIn: 'root'
})
export class DevloperService {
  private apiUrl = 'http://localhost:8000/api/participacion/';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los developers de un proyecto (rol: developer)
   */
  obtenerDevelopersPorProyecto(proyectoId: number): Observable<Participacion[]> {
    const params = new HttpParams()
      .set('proyecto', proyectoId.toString())
      .set('rol', 'developer');

    return this.http.get<Participacion[]>(this.apiUrl, { params });
  }
}
