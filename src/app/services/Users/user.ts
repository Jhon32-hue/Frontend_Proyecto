import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
    private apiUrl = 'http://127.0.0.1:8000/api/proyectos/gestion/estadisticas/';

  constructor(private http: HttpClient) {}

  obtenerEstadisticas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}




