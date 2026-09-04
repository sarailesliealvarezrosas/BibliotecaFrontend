import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Categoria } from '../../models/categoria.models';
import { handleError, handleResponse } from './apiResponses';

const url = environment.backendUrl + '/categorias';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  constructor(private http: HttpClient) {}

  getAll(): Observable<Categoria[]> {
    return this.http.get<any>(url).pipe(
      map((res) => handleResponse<Categoria[]>(res)),
      catchError(handleError('obtener categorias'))
    );
  }

  getByUuid(uuid: string): Observable<Categoria> {
    return this.http.get<any>(`${url}/${uuid}`).pipe(
      map((res) => handleResponse<Categoria>(res)),
      catchError(handleError(`obtener categoria ${uuid}`))
    );
  }

  search(descripcion: string): Observable<Categoria[]> {
    return this.http.get<any>(`${url}/buscar`, {
      params: { descripcion }
    }).pipe(
      map((res) => handleResponse<Categoria[]>(res)),
      catchError(handleError('buscar categorias'))
    );
  }

  save(data: Categoria): Observable<Categoria> {
    return this.http.post<any>(url, data).pipe(
      map((res) => handleResponse<Categoria>(res)),
      catchError(handleError('guardar categoria'))
    );
  }

  update(uuid: string, data: Categoria): Observable<Categoria> {
    return this.http.put<any>(`${url}/${uuid}`, data).pipe(
      map((res) => handleResponse<Categoria>(res)),
      catchError(handleError('actualizar categoria'))
    );
  }

  delete(uuid: string): Observable<any> {
    return this.http.delete<any>(`${url}/${uuid}`).pipe(
      map((res) => handleResponse<any>(res)),
      catchError(handleError('eliminar categoria'))
    );
  }

  desactivar(uuid: string): Observable<any> {
    return this.http.patch<any>(`${url}/${uuid}/desactivar`, {}).pipe(
      map((res) => handleResponse<any>(res)),
      catchError(handleError('desactivar categoria'))
    );
  }

  activar(uuid: string): Observable<any> {
    return this.http.patch<any>(`${url}/${uuid}/activar`, {}).pipe(
      map((res) => handleResponse<any>(res)),
      catchError(handleError('activar categoria'))
    );
  }
}