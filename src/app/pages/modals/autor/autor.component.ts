import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { SharedModule } from 'src/app/shared/shared.module';
import { Autor } from 'src/app/core/models/autor.models';
import { AutorService } from 'src/app/core/services/api/autores.service';

@Component({
    selector: 'app-autor',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        TranslateModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    templateUrl: './autor.component.html',
    styleUrl: './autor.component.scss'
})
export class AutorModalComponent {

    title = 'Autor';

    @Input() accion!: string;
    @Input() row!: Autor;
    @Output() emitList = new EventEmitter();

    contentForm!: FormGroup;
    submitted = false;
    statusText = 'Autor Activo';

    constructor(
        private modalService: NgbModal,
        private formBuilder: FormBuilder,
        private autorService: AutorService
    ) {}

    ngOnInit(): void {
        this.formInit();
        this.formDataSet();
    }

    private formInit() {
        this.contentForm = this.formBuilder.group({
            uuid: [''],
            nombres: ['', [Validators.required, Validators.maxLength(75)]],
            apellidos: ['', [Validators.required, Validators.maxLength(75)]],
            nacionalidad: ['', [Validators.required, Validators.maxLength(45)]],
            fechaNacimiento: [''],
            biografia: [''],
            activo: [true]
        });
    }

    private formDataSet() {
        if (this.accion !== '' && this.row) {
            this.contentForm.patchValue({
                uuid: this.row.uuid,
                nombres: this.row.nombres,
                apellidos: this.row.apellidos,
                nacionalidad: this.row.nacionalidad,
                fechaNacimiento: this.row.fechaNacimiento,
                biografia: this.row.biografia,
                activo: this.row.activo !== false
            });

            this.updateStatusText();
        }
    }

    get form() {
        return this.contentForm.controls;
    }

    updateStatusText(): void {
        this.statusText = this.contentForm.get('activo')?.value ? 'Autor Activo' : 'Autor Inactivo';
    }

    saveData() {
        this.submitted = true;

        if (this.contentForm.invalid) {
            return;
        }

        const formValue = this.contentForm.value;

        const data: Autor = {
            nombres: formValue.nombres.trim(),
            apellidos: formValue.apellidos.trim(),
            nacionalidad: formValue.nacionalidad.trim(),
            fechaNacimiento: formValue.fechaNacimiento || null,
            biografia: formValue.biografia?.trim() || null
        };

        const operation = formValue.uuid
            ? this.autorService.update(formValue.uuid, data)
            : this.autorService.save(data);

        operation.subscribe({
            next: () => {
                this.notify('Operación completada con éxito', 'success');
                this.emitList.emit();
                this.closeModal();
            },
            error: (error) => {
                this.notify(error.message || error || 'Error en la operación', 'error');
            }
        });
    }

    deleteMethod() {
        if (!this.row?.uuid) {
            return;
        }

        this.autorService.delete(this.row.uuid).subscribe({
            next: () => {
                this.notify('Autor eliminado correctamente', 'success');
                this.emitList.emit();
                this.closeModal();
            },
            error: (error) => {
                this.notify(error.message || error || 'No se pudo eliminar el autor', 'error');
            }
        });
    }

    closeModal() {
        this.contentForm?.reset();
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

    convertToUppercase(field: string) {
        const control = this.contentForm.get(field);
        const value = control?.value;

        if (value) {
            control?.setValue(value.toUpperCase(), { emitEvent: false });
        }
    }
}