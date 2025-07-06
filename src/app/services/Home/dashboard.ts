import { Injectable } from '@angular/core';
import { Tarea, ActividadUsuario, ProyectoResumen } from '../../interfaces/home';
import { Observable, } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardServices {
  private apiUrl: string = 'http://127.0.0.1:8000/api/proyectos/';
  private apiUrl2: string = 'http://127.0.0.1:8000/api/';

  constructor(private readonly http: HttpClient) { }

  // 📝 1. Obtener tareas asignadas al usuario
  getTareasAsignadas(): Observable<Tarea[]> {
    const url = `${this.apiUrl}tareas/`;
    return this.http.get<Tarea[]>(url);
  }

  // 🔁 2. Obtener actividad reciente relacionada a la participación del usuario
  getActividadUsuario(): Observable<ActividadUsuario[]> {
    const url = `${this.apiUrl2}historial/`;
    return this.http.get<ActividadUsuario[]>(url);
  }

  // 📦 3. Obtener resumen de proyectos
  getResumenProyectos(): Observable<ProyectoResumen[]> {
  const url = `${this.apiUrl}gestion/`;
  return this.http.get<ProyectoResumen[]>(url).pipe(
    map((data) => {
      // Verificar si la respuesta es un array
      if (Array.isArray(data)) {
        return data;
      } else {
        console.error('Error: Se esperaba un array, pero la respuesta es:', data);
        return []; // Retornar un array vacío si no es un array
      }
    }),
    catchError((err) => {
      console.error('Error al obtener proyectos:', err);
      return of([]); // Si hay error, retornar un array vacío
    })
  );
}

  // 📝 4. Obtener un proyecto por ID
  getProyectoById(id: number): Observable<ProyectoResumen> {
    const url = `${this.apiUrl}gestion/${id}/`; // Endpoint para obtener un proyecto específico por ID
    return this.http.get<ProyectoResumen>(url);
  }

  // 📌 5. Actualizar estado de un proyecto
  updateEstadoProyecto(id: number, nuevoEstado: string): Observable<any> {
    const url = `${this.apiUrl}gestion/${id}/`;
    const body = { estado_proyecto: nuevoEstado };
    return this.http.patch(url, body);
  }

  // 🔄 6. Obtener historial de actividades (si es necesario)
  getHistorialActividades(): Observable<any> {
    const url = `${this.apiUrl2}historial/`;
    return this.http.get(url);
  }
}
