import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, EventEmitter, Input, LOCALE_ID, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { FlatpickrModule } from 'angularx-flatpickr';
import Swal from 'sweetalert2';
import { SharedModule } from 'src/app/shared/shared.module';
import { Spanish } from 'flatpickr/dist/l10n/es.js';
import { ActivityService } from 'src/app/core/services/api/actividades.service';
import { Activity } from 'src/app/core/models/activity.models';

@Component({
  selector: 'app-activity',
  standalone:true,  
  imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      NgbDatepickerModule,
      FlatpickrModule,
      SharedModule,
      TranslateModule    
  ],  
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './activity.component.html',
  styleUrl: './activity.component.scss'
})

export class ActivityModalComponent {
  title = 'Actividad';
  Spanish = Spanish;
  date!: { from: Date, to: Date };
  @Input() accion!: string;
  @Input() row!: Activity;
  @Output() emitList = new EventEmitter();
  @ViewChild('dateInput') dateInput!: ElementRef;

  contentForm!: FormGroup;
  submitted = false;
  isCheckingDates = false;
  statusText: string = 'Actividad Activo';
  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private activityService: ActivityService
  ) {}

  ngOnInit(): void {
    this.formInit();
    this.setupDateValidation();
    this.formDataSet();
  }

  private formInit() {
    this.contentForm = this.formBuilder.group({
      uuid: [''],
      tipoActividad: ['', [Validators.required, Validators.maxLength(100)]],
      fechaInicio: ['', [Validators.required]],
      fechaFin: ['', [Validators.required, this.dateAfterStartValidator()]],
      activo: [false, [Validators.required]]
    });
  }


  private dateAfterStartValidator(): ValidatorFn {
  return (control) => {
    if (!this.contentForm) {
      return null;
    }
    
    const startDate = this.contentForm.get('fechaInicio')?.value;
    const endDate = control.value;
    
    if (!startDate || !endDate) {
      return null;
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    
    return end >= start ? null : { dateRangeInvalid: true };
  };
}

setupDateValidation() {
  this.contentForm.get('fechaInicio')?.valueChanges.subscribe(() => {
    this.contentForm.get('fechaFin')?.updateValueAndValidity();
  });
}

  private formDataSet() {
    if (this.accion !== '') {
      const rowData = {
        ...this.row,
        tipoActividad: this.row.tipoActividad ? this.row.tipoActividad.toUpperCase() : '',
        fechaInicio: this.row.fechaInicio ? new Date(this.row.fechaInicio) : null,
        fechaFin: this.row.fechaFin ? new Date(this.row.fechaFin) : null,
        activo: this.row.activo !== false
      };
      
      this.contentForm.patchValue(rowData);
      this.updateStatusText();
    }
  }

  updateStatusText(): void {
    this.statusText = this.contentForm.get('activo')?.value ? 'Actividad Activo' : 'Actividad Inactivo';
  }

  
  get form() {
    return this.contentForm.controls;
  }

  openDatePicker() {
    this.dateInput.nativeElement.showPicker();
  }

  async saveData() {
    this.submitted = true;
    if (this.contentForm.invalid) return;

    const formValue = this.contentForm.value;
    const data: Activity = {
      ...formValue,
      tipoActividad: formValue.tipoActividad.toUpperCase(), 
      fechaInicio: this.formatDateForBackend(formValue.fechaInicio),
      fechaFin: this.formatDateForBackend(formValue.fechaFin),
      activo: formValue.activo === 'true' || formValue.activo === true,
      estado: false
    };
    try {
      this.isCheckingDates = true;
      const hasConflict = await this.checkDateRangeConflict(data);
      if (hasConflict) {
        this.notify('Ya existe una actividad activa en el mismo rango de fechas', 'error');
        this.isCheckingDates = false;
        return;
      }

      const operation = formValue.uuid 
        ? this.activityService.update(data) 
        : this.activityService.save(data);

      operation.subscribe({
        next: () => {
          this.notify('Operación completada con éxito', 'success');
          this.emitList.emit();
          this.closeModal();
          this.isCheckingDates = false;
        },
        error: (error) => {
          this.notify(`Error: ${error.message || 'Error en la operación'}`, 'error');
          this.isCheckingDates = false;
        }
      });
    } catch (error) {
      this.isCheckingDates = false;
      this.notify('Error al validar las fechas', 'error');
    }
  }

private async checkDateRangeConflict(activity: Activity): Promise<boolean> {
  try {
    if (!activity.fechaInicio || !activity.fechaFin) {
    //  console.error('Fechas requeridas faltantes');
      return false;
    }

    const activities = await this.activityService.getAll().toPromise();
    if (!activities) return false;

    const startDate = new Date(activity.fechaInicio);
    const endDate = new Date(activity.fechaFin);

    if (activity.activo === true) {
      return activities.some(existing => {
        if (activity.uuid && existing.uuid === activity.uuid) return false;
        if (existing.activo !== true) return false;

        if (!existing.fechaInicio || !existing.fechaFin) return false;

        const existingStart = new Date(existing.fechaInicio);
        const existingEnd = new Date(existing.fechaFin);

        const datesOverlap = (
          (startDate >= existingStart && startDate <= existingEnd) ||
          (endDate >= existingStart && endDate <= existingEnd) ||
          (startDate <= existingStart && endDate >= existingEnd)
        );

        if (datesOverlap) {
          if (existing.tipoActividad === activity.tipoActividad) {
            return true;
          }
          return false;
        }

        return false;
      });
    }
    return false;
  } catch (error) {
  //  console.error('Error verificando conflictos:', error);
    return false;
  }
}

  deleteMethod() {
    if(this.row.uuid){
        this.activityService.delete(this.row.uuid).subscribe((resp) => {
        if (resp) {
            this.submitted = false;
            this.closeModal();
            this.emitList.emit();          
            this.notify(resp.message || 'Actividad eliminada correctamente', 'success');

          }
           else {
            const message = `No se pudo Eliminar el ${this.title}! `;
            this.notify(message, 'error');
          }
      });
    }
  }

  closeModal() {
    this.contentForm.reset();
    this.modalService.dismissAll();
  }

  private notify(message: string, type: any): void {
    Swal.fire({
      title: message,
      icon: type,
      timer: 3000,
      timerProgressBar: true
    });
  }

  private formatDateForBackend(date: Date | string): string {
    if (!date) return '';
      const d = new Date(date);
      return d.toISOString().split('T')[0];
    }

    convertToUppercase(event: Event) {
    const input = event.target as HTMLInputElement;
    const upperValue = input.value.toUpperCase();
    this.contentForm.get('tipoActividad')?.setValue(upperValue, {emitEvent: false});
  }

}