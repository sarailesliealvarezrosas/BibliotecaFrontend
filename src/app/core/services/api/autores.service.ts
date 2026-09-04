import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Autor } from '../../models/autor.models';
import { handleError, handleResponse } from './apiResponses';

const url = environment.backendUrl + '/autores';

@Injectable({
    providedIn: 'root'
})
export class AutorService {

    constructor(private http: HttpClient) {}

    getAll(): Observable<Autor[]> {
        return this.http.get<any>(url).pipe(
            map((res) => handleResponse<Autor[]>(res)),
            catchError(handleError('obtener autores'))
        );
    }

    getByUuid(uuid: string): Observable<Autor> {
        return this.http.get<any>(`${url}/${uuid}`).pipe(
            map((res) => handleResponse<Autor>(res)),
            catchError(handleError(`obtener autor ${uuid}`))
        );
    }

    search(nombre: string, nacionalidad: string = ''): Observable<Autor[]> {
        return this.http.get<any>(`${url}/buscar`, {
            params: { nombre, nacionalidad }
        }).pipe(
            map((res) => handleResponse<Autor[]>(res)),
            catchError(handleError('buscar autores'))
        );
    }

    save(data: Autor): Observable<Autor> {
        return this.http.post<any>(url, data).pipe(
            map((res) => handleResponse<Autor>(res)),
            catchError(handleError('guardar autor'))
        );
    }

    update(uuid: string, data: Autor): Observable<Autor> {
        return this.http.put<any>(`${url}/${uuid}`, data).pipe(
            map((res) => handleResponse<Autor>(res)),
            catchError(handleError('actualizar autor'))
        );
    }

    delete(uuid: string): Observable<any> {
        return this.http.delete<any>(`${url}/${uuid}`).pipe(
            map((res) => handleResponse<any>(res)),
            catchError(handleError('eliminar autor'))
        );
    }

    desactivar(uuid: string): Observable<any> {
        return this.http.patch<any>(`${url}/${uuid}/desactivar`, {}).pipe(
            map((res) => handleResponse<any>(res)),
            catchError(handleError('desactivar autor'))
        );
    }

    activar(uuid: string): Observable<any> {
        return this.http.patch<any>(`${url}/${uuid}/activar`, {}).pipe(
            map((res) => handleResponse<any>(res)),
            catchError(handleError('activar autor'))
        );
    }
}