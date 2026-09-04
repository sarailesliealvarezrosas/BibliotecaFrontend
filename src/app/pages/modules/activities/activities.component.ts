import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Spanish } from 'flatpickr/dist/l10n/es.js';
import { ActivityService } from 'src/app/core/services/api/actividades.service';
//import { ModalImportComponent } from 'src/app/shared/modal-import/modal-import.component';
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
    private activityService: ActivityService
  ) {  }
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

private datesOverlap(start1: Date, end1: Date, start2: Date, end2: Date): boolean {
  return (
    (start1 >= start2 && start1 <= end2) ||
    (end1 >= start2 && end1 <= end2) ||
    (start1 <= start2 && end1 >= end2)
  );
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