import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { handleResponse, handleError } from './apiResponses';
import { environment } from 'src/environments/environment';

import { Activity } from '../../models/activity.models';

const url = environment.backendUrl + '/actividad';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  constructor(private http: HttpClient) { }
  
  getAll(): Observable<Activity[]> {
    return this.http.get<{ status: string; payload: any }>(`${url}`).pipe(
      map((res) => handleResponse<Activity[]>(res)),
      catchError(handleError('obtener todos las Actividades'))
    );
  }

  getByUuid(uuid: string): Observable<Activity> {
    return this.http.get<{ status: string; payload: any }>(`${url}/uuid/${uuid}`).pipe(
      map((res) => handleResponse<Activity>(res)),
      catchError(handleError(`obtener Actividad por UUID (${uuid})`))
    );
  }

  save(data: Activity): Observable<Activity> {
    return this.http.post<{ status: string; payload: any }>(`${url}`, data).pipe(
      map((res) => handleResponse<Activity>(res)),
      catchError(handleError('guardar Actividad'))
    );
  }

  update(data: Activity): Observable<Activity> {
    return this.http.put<{ status: string; payload: any }>(`${url}`, data).pipe(
      map((res) => handleResponse<Activity>(res)),
      catchError(handleError('actualizar Actividad'))
    );
  }

  delete(uuid: string): Observable<any> {
    return this.http.delete<{ status: string; payload: any }>(`${url}/${uuid}`).pipe(
      map((res) => handleResponse<Activity>(res)),
      catchError(handleError(`eliminar Actividad por UUID (${uuid})`))
    );
  }
  
}