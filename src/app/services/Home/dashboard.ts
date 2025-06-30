import { Injectable } from '@angular/core';
import { Tarea, ActividadUsuario, ProyectoResumen } from '../../interfaces/home';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

//Los servicios implementan los objetos mapeados en las interfaces,
//con la particularidad de que reciben los parametros de la 

@Injectable({
  providedIn: 'root'
})
export class DashboardServices {
  private apiUrl: string ='http://127.0.0.1:8000/api/proyectos/';
  private apiUrl2: string ='http://127.0.0.1:8000/api/';

  constructor(private readonly http: HttpClient) { }

    // 📝 1. Obtener tareas asignadas al usuario
  getTareasAsignadas(): Observable<Tarea[]> {
    const url = this.apiUrl + 'tareas/';
    return this.http.get<Tarea[]>(url);
  }

  // 🔁 2. Obtener actividad reciente relacionada a la participacion del usuario
  getActividadUsuario(): Observable<ActividadUsuario[]> {
    const url = this.apiUrl2 + 'historial/';
    return this.http.get<ActividadUsuario[]>(url);
  }

  // 📦 3. Obtener resumen de proyectos
  getResumenProyectos(): Observable<ProyectoResumen[]> {
    const url = this.apiUrl + 'gestion/';
    return this.http.get<ProyectoResumen[]>(url);
  }
}

