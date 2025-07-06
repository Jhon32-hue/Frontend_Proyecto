import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InvitarColaboradorResponse } from '../../interfaces/projects';

@Injectable({
  providedIn: 'root'
})
export class InvitarColaboradorService {

  private apiUrl = 'http://127.0.0.1:8000/api/proyectos/';

  constructor(private readonly http: HttpClient) { }

  invitarColaborador(data: {email: string; proyecto_id: number; rol_id: number}): Observable<InvitarColaboradorResponse> {
    const url = `${this.apiUrl}invitar-colaborador/`;
    return this.http.post<InvitarColaboradorResponse>(url, data);
  }
}
