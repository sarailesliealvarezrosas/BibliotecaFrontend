// persona.service.ts

import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ConductorInterface } from '../models/conductor.models';
import { Owner } from '../models/owner.models';
import { ConductorService } from './api/conductor.service';
import { OwnerService } from './api/owner.service';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  constructor(
    private conductorService: ConductorService,
    private ownerService: OwnerService
  ) {}

  searchByDocumentNumber(documentNumber: string): Observable<{
    conductores: ConductorInterface[],
    owners: Owner[],
    type: 'combined'
  }> {
    if (!documentNumber || documentNumber.length < 2) {
      return of({ conductores: [], owners: [], type: 'combined' });
    }

    return forkJoin({
      conductores: this.conductorService.searchConductores(documentNumber).pipe(
        catchError(() => of([]))
      ),
      owners: this.ownerService.searchOwners(documentNumber).pipe(
        catchError(() => of([]))
      )
    }).pipe(
      map(results => ({
        ...results,
        type: 'combined' as const
      }))
    );
  }

  // Método para obtener detalles completos
  getPersonDetails(uuid: string, type: 'owner' | 'conductor'): Observable<Owner | ConductorInterface | null> {
    if (type === 'owner') {
      return this.ownerService.getByUuid(uuid).pipe(
        catchError(() => of(null))
      );
    } else {
      return this.conductorService.getByUuid(uuid).pipe(
        catchError(() => of(null))
      );
    }
  }
}