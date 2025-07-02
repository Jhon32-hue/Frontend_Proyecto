import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ProjectCreate } from '../../pages/projects/project-create/project-create';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl: string = 'http://127.0.0.1:8000/api/proyectos/';

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}

  createProject(data: ProjectCreate): Observable<ProjectCreate> {
    const url = this.apiUrl + 'gestion/';
    return this.http.post<ProjectCreate>(url, data);
  }

  deleteProject(id: number): Observable<any> {
  const url = `${this.apiUrl}gestion/${id}/`;
  return this.http.delete(url);
}

}
