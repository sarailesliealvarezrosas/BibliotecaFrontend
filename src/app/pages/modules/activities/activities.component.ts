import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ngxCsv } from 'ngx-csv/ngx-csv';

import { Spanish } from 'flatpickr/dist/l10n/es.js';
//import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ActivityService } from 'src/app/core/services/api/actividades.service';
import { ModalImportComponent } from 'src/app/shared/modal-import/modal-import.component';
import { Activity } from 'src/app/core/models/activity.models';
import { ActivityModalComponent } from '../../modals/activity/activity.component';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent {
  title = "Actividades";
  date!: { from: Date, to: Date };
  Spanish = Spanish;

  breadCrumbItems!: Array<{}>;
  //canActivate: string[] = [];
  
  itemsList:any[]=[];
  temp: any[] = [];
  
  loading: boolean = true;

  viewMode: 'table' | 'cards' = 'table';

  startDate: Date | null = null;
  endDate: Date | null = null;

  fechaInicioRango: any = null;
  fechaFinRango: any = null;
  searchTerm: string = '';

  activitiesList: any[] = [];
  allActivities: Activity[] = []; 

constructor(
    private modalService: NgbModal,
   // private authService: AuthenticationService,
    private activityService: ActivityService
  ) {
    //this.canActivate = this.authService.hasPermission(this.title);
  }
  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: '' },
      { label: this.title, active: true }
    ];
    this.itemsList = [
      {name: 'Tipo Actividad', prop: 'tipoActividad', visible: true},
      {name: 'Fecha Inicio', prop: 'fechaInicio', visible: true,date:true},
      {name: 'Fecha Fin', prop: 'fechaFin', visible: true,date:true},
      {name: 'Estado', prop: 'activo', visible: true, tag:true},
     ];

    this.getActivities();
  }

  selectedItems:any[] =[];
  getSelectedItems(items: any) {
    this.selectedItems = items;
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'table' ? 'cards' : 'table';
    localStorage.setItem('dataTableViewMode', this.viewMode);
  }

  public openModal(content: any | undefined, accion: string, size: string) {
    const modalRef = this.modalService.open(ActivityModalComponent, {
      backdrop: 'static',
      size: size
    });
    modalRef.componentInstance.row = content;
    modalRef.componentInstance.accion = accion;
    modalRef.componentInstance.emitList.subscribe(() => {
      this.searchTerm = '';
      this.getActivities();
    });
  }

  headersImport = ['Tipo Actividad','Fecha Inicio', 'Fecha Fin', 'Activo'];

   // Csv File Export
public openModalImport() {
  const modalRef = this.modalService.open(ModalImportComponent, {
    size: 'lg', backdrop: 'static'
  });
  
  modalRef.componentInstance.titles = this.headersImport.map(header => 
    ({ prop: header, name: header, visible: true }));
  modalRef.componentInstance.itemsList = this.temp;
 
  modalRef.componentInstance.checkExistsFn = (registro: Activity) => {
    if (!registro.tipoActividad || !registro.fechaInicio || !registro.fechaFin) {
      return false;
    }
    if (!registro.activo) return false;
    
    const upperTipoActividad = registro.tipoActividad.toUpperCase();
    
    return this.temp.some(item =>
      item.activo === true && item.tipoActividad?.toUpperCase() === upperTipoActividad &&
      item.fechaInicio && item.fechaFin &&
      this.datesOverlap(
        new Date(item.fechaInicio),
        new Date(item.fechaFin),
        new Date(registro.fechaInicio),
        new Date(registro.fechaFin)
      )
    );
  };
  
  modalRef.componentInstance.mapRowFn = (row: any, lookupData: any): Activity => {
    const parseDate = (dateStr: string): Date => {
      if (!dateStr) throw new Error('Fecha requerida');
      
      const dateParts = dateStr.split(/[/-]/);
      if (dateParts.length !== 3) throw new Error('Formato de fecha inválido (use DD/MM/YYYY)');
      
      const day = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10) - 1;
      const year = parseInt(dateParts[2], 10);
      
      if (isNaN(day) || isNaN(month) || isNaN(year)) {
        throw new Error('Formato de fecha inválido (use números)');
      }
      
      const date = new Date(year, month, day);
      
      if (isNaN(date.getTime())) {
        throw new Error('Fecha inválida');
      }
      
      return date;
    };
    
    const tipoActividad = row['Tipo Actividad']?.toString().trim();
    if (!tipoActividad) {
      throw new Error('El tipo de actividad es requerido');
    }

    const fechaInicio = parseDate(row['Fecha Inicio']);
    const fechaFin = parseDate(row['Fecha Fin']);
    
    if (fechaFin < fechaInicio) {
      throw new Error(`La fecha fin (${this.formatDate(fechaFin)}) no puede ser anterior a la fecha inicio (${this.formatDate(fechaInicio)})`);
    }
    
    const activoValue = row['Activo']?.toString().toLowerCase().trim();
    const activo = activoValue === 'activo' || activoValue === 'si' || activoValue === 'true';
    
    return {
      tipoActividad: tipoActividad.toUpperCase(),
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
      activo: activo
    };
  };
  
  modalRef.componentInstance.validateRecordFn = async (record: Activity) => {
    if (!record.tipoActividad || !record.fechaInicio || !record.fechaFin) {
      return { valid: false, message: 'Todos los campos son requeridos' };
    }

    if (record.activo) {
      const hasConflict = [...this.temp, ...(modalRef.componentInstance.newItems || [])]
        .filter(item => item !== record)
        .some(item => 
          item.activo && item.tipoActividad?.toUpperCase() === record.tipoActividad.toUpperCase() &&
          this.datesOverlap(
            new Date(item.fechaInicio),
            new Date(item.fechaFin),
            new Date(record.fechaInicio),
            new Date(record.fechaFin))
        );
      
      if (hasConflict) {
        return {
          valid: false,
          message: `Conflicto: Ya existe una actividad ACTIVA con el mismo nombre (${record.tipoActividad}) y rango de fechas superpuesto.`
        };
      }
    }
    
    return { valid: true };
  };
  
  modalRef.componentInstance.createRecordFn = async (record: Activity) => {
    try {
      if (!record.tipoActividad || !record.fechaInicio || !record.fechaFin) {
        return { success: false, message: 'Todos los campos son requeridos' };
      }
      record.tipoActividad = record.tipoActividad.toUpperCase();
      if (record.fechaFin < record.fechaInicio) {
        return { success: false, message: 'La fecha fin no puede ser anterior a la fecha inicio' };
      }

      if (record.activo) {
        const activities = await this.activityService.getAll().toPromise();
        const hasConflict = activities?.some(item => 
          item.activo && item.tipoActividad?.toUpperCase() === record.tipoActividad.toUpperCase() &&
          item.uuid !== record.uuid &&
          this.datesOverlap(
            new Date(item.fechaInicio),
            new Date(item.fechaFin),
            new Date(record.fechaInicio),
            new Date(record.fechaFin))
        );
        
        if (hasConflict) {
          return { 
            success: false, 
            message: 'Conflicto en BD: Ya existe una actividad ACTIVA con el mismo nombre y rango de fechas.' 
          };
        }
      }

      const result = await this.activityService.save(record).toPromise();
      return { success: true, data: result };
    } catch (error: any) {
      return { 
        success: false, 
        message: error?.message || 'Error al guardar la actividad' 
      };
    }
  };
  
  modalRef.componentInstance.actionCompleted.subscribe(() => {
    this.getActivities();
  });
}

private datesOverlap(start1: Date, end1: Date, start2: Date, end2: Date): boolean {
  return (
    (start1 >= start2 && start1 <= end2) ||
    (end1 >= start2 && end1 <= end2) ||
    (start1 <= start2 && end1 >= end2)
  );
}

   csvFileExport() {
    const itemsToExport = this.selectedItems.length > 0 ? this.selectedItems : this.activitiesList;
    
    const list = itemsToExport.map((item: any) => ({
      tipoActividad: item.tipoActividad || '',
      fechaInicio: this.formatDate(item.fechaInicio || ''),
      fechaFin: this.formatDate(item.fechaFin || ''),
      activo: item.activo ? 'ACTIVO' : 'INACTIVO'
    }));
  
    new ngxCsv(list, this.title, {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      title: 'Lista de ' + this.title,
      useBom: true,
      noDownload: false,
      headers: this.headersImport
    });
  }

applyFilters(): void {
  this.activitiesList = this.allActivities.filter((item: Activity) => {
    const matchesSearch = !this.searchTerm || this.doesItemMatchSearch(item, this.searchTerm.toLowerCase());
    const matchesFechaInicio = !this.fechaInicioRango ? true : this.isDateInRange(new Date(item.fechaInicio), this.fechaInicioRango);
    const matchesFechaFin = !this.fechaFinRango ? true : this.isDateInRange(new Date(item.fechaFin), this.fechaFinRango);

    return matchesSearch && matchesFechaInicio && matchesFechaFin;
  });
}

private isDateInRange(date: Date, range: any): boolean {
  if (!range || !range.from || !range.to) return true;
  
  const fromDate = new Date(range.from);
  const toDate = new Date(range.to);
  
  fromDate.setHours(0, 0, 0, 0);
  toDate.setHours(23, 59, 59, 999);
  date.setHours(12, 0, 0, 0);
  
  return date >= fromDate && date <= toDate;
}

private doesItemMatchSearch(item: Activity, searchLower: string): boolean {
  if (!searchLower) return true;

  const searchTerms = searchLower.split(' ').filter(term => term.length > 0);
  return searchTerms.every(term => {
    return (
      (item.activo !== undefined && item.activo.toString().toLowerCase().includes(term)) ||
      (item.tipoActividad && item.tipoActividad.toLowerCase().includes(term)) ||
      (item.fechaInicio && this.formatDate(item.fechaInicio).toLowerCase().includes(term)) ||
      (item.fechaFin && this.formatDate(item.fechaFin).toLowerCase().includes(term))
    );
  });
}

clearFechaInicioRango(): void {
  this.fechaInicioRango = null;
  this.applyFilters();
}

clearFechaFinRango(): void {
  this.fechaFinRango = null;
  this.applyFilters();
}

performSearch(): void {
  this.applyFilters();
}

  onDateRangeChange(dates: Date[]): void {
    if (dates.length === 2) {
      const [startDate, endDate] = dates;
      const normStart = new Date(startDate.setHours(0, 0, 0, 0));
      const normEnd = new Date(endDate.setHours(23, 59, 59, 999));
      
      this.activitiesList = this.temp.filter(item => {
        const inicio = item.fechaInicio ? new Date(item.fechaInicio) : null;
        const fin = item.fechaFin ? new Date(item.fechaFin) : null;
        
        if (!inicio && !fin) return false;
        
        const inicioInRange = inicio && inicio >= normStart && inicio <= normEnd;
        const finInRange = fin && fin >= normStart && fin <= normEnd;
        
        return inicioInRange || finInRange;
      });
    }
  }

  formatDate = (dateStr: Date | string): string => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

/**API REST Services */
  private getActivities(): void {
    this.loading = true;
    this.activityService.getAll().subscribe({
      next: (data: Activity[]) => {
        this.loading = false;
        this.allActivities = data;
        this.applyFilters();
      },
      error: (error) => {
        this.loading = false;
        console.error('Error al obtener las actividades', error);
      }
    });
  }

}