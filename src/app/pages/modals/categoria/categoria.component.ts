import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { SharedModule } from 'src/app/shared/shared.module';
import { Categoria } from 'src/app/core/models/categoria.models';
import { CategoriaService } from 'src/app/core/services/api/categorias.service';

@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './categoria.component.html',
  styleUrl: './categoria.component.scss'
})
export class CategoriaModalComponent {

  title = 'Categoría';

  @Input() accion!: string;
  @Input() row!: Categoria;
  @Output() emitList = new EventEmitter();

  contentForm!: FormGroup;
  submitted = false;
  statusText = 'Categoría Activa';

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private categoriaService: CategoriaService
  ) {}

  ngOnInit(): void {
    this.formInit();
    this.formDataSet();
  }

  private formInit() {
    this.contentForm = this.formBuilder.group({
      uuid: [''],
      descripcion: ['', [Validators.required, Validators.maxLength(75)]],
      activo: [true]
    });
  }

  private formDataSet() {
    if (this.accion !== '' && this.row) {
      this.contentForm.patchValue({
        uuid: this.row.uuid,
        descripcion: this.row.descripcion,
        activo: this.row.activo !== false
      });

      this.updateStatusText();
    }
  }

  get form() {
    return this.contentForm.controls;
  }

  updateStatusText(): void {
    this.statusText = this.contentForm.get('activo')?.value ? 'Categoría Activa' : 'Categoría Inactiva';
  }

  saveData() {
    this.submitted = true;

    if (this.contentForm.invalid) {
      return;
    }

    const formValue = this.contentForm.value;

    const data: Categoria = {
      descripcion: formValue.descripcion.trim()
    };

    const operation = formValue.uuid
      ? this.categoriaService.update(formValue.uuid, data)
      : this.categoriaService.save(data);

    operation.subscribe({
      next: () => {
        this.notify('Operación completada con éxito', 'success');
        this.emitList.emit();
        this.closeModal();
      },
      error: (error) => {
        this.notify(error.message || 'Error en la operación', 'error');
      }
    });
  }

  deleteMethod() {
    if (!this.row?.uuid) {
      return;
    }

    this.categoriaService.delete(this.row.uuid).subscribe({
      next: () => {
        this.notify('Categoría eliminada correctamente', 'success');
        this.emitList.emit();
        this.closeModal();
      },
      error: (error) => {
        this.notify(error.message || 'No se pudo eliminar la categoría', 'error');
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

  convertToUppercase(event: Event) {
    const input = event.target as HTMLInputElement;
    const upperValue = input.value.toUpperCase();
    this.contentForm.get('descripcion')?.setValue(upperValue, { emitEvent: false });
  }
}