import { Injectable } from '@angular/core';
import { Auth } from '../../interfaces/auth';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

//Los servicios implementan los objetos mapeados en las interfaces,
//con la particularidad de que reciben los parametros de la petición

@Injectable({
  providedIn: 'root'
})
export class AuthServices {
  private apiUrl: string = 'http://127.0.0.1:8000/api/usuarios/'

  constructor(private readonly http:HttpClient) { }

  login(emailFromParameter: string, passwordFromParameter: string): Observable<Auth> {
    const url = this.apiUrl + 'token/'

    const body = {
      email : emailFromParameter,
      password : passwordFromParameter
    }

    return this.http.post<Auth>(url, body)
    }
}
