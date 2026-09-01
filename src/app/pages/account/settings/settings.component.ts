import { Component, OnInit } from '@angular/core';

import { CityAcronym } from 'src/app/core/data/Places';
import { UserService } from 'src/app/core/services/api-users/users.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  CityAcronym = CityAcronym;
  avatar = "default-profile1.png";
  submitted = false;
  private inspectorData = {
    uuid: "abc123-inspector",
    nombre: "Juan",
    apPaterno: "Pérez",
    apMaterno: "Gutierrez",
    sexo: "M",
    nroCarnet: "1234567",
    ciExpedido: "CB",
    nroCelular: "70000000",
    correoElectronico: "juan.perez@gmail.com",
    direccion: ""
    
  };
  inspectorFullName: string = "Juan Pérez Gutierrez";
  inspectorEmail: string = "juan.perez@gmail.com";
  inspectorUnidad: string = "Unidad de Inspección Técnica Vehicular";


  personaForm: FormGroup = this.formBuilder.group({
    uuid: ['', [Validators.required]],
    nombre: ['', [Validators.required]],
    apPaterno: ['', [Validators.required]],
    apMaterno: ['', [Validators.required]],
    sexo: ['M', [Validators.required]],
    nroCarnet: ['', [Validators.required]],
    expedido: ['', [Validators.required]],
    nroCelular: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
    correoElectronico: ['', [Validators.required, Validators.email]],
    direccion: ['']
  });

  constructor(
    private location: Location,
    private formBuilder: FormBuilder,
    private employeeService: UserService,
  ) { }

  ngOnInit(): void {
    this.loadPersonaData(this.inspectorData);
  }

  private loadPersonaData(persona: any) {
    if (persona) {
      this.personaForm.patchValue({
        uuid: persona.uuid,
        nombre: persona.nombre,
        apPaterno: persona.apPaterno,
        apMaterno: persona.apMaterno,
        sexo: persona.sexo,
        nroCarnet: persona.nroCarnet,
        expedido: this.getExpedidoDescription(persona.ciExpedido || persona.ciExpedito),
        nroCelular: persona.nroCelular || persona.celular,
        correoElectronico: persona.correoElectronico || persona.correo,
        direccion: persona.direccion
      });
    }
  }

  get form() {
    return this.personaForm.controls;
  }

  getExpedidoDescription(expedido: any): any {
    const city = this.CityAcronym.find(c => c.acronym === expedido || c.id === expedido || c.value === expedido);
    return city ? city.value : '';
  }

  getAcronymCity(city: string): string {
    let acronym = '';
    CityAcronym.forEach(element => {
      if (element['value'] === city) {
        acronym = element['acronym'];
      }
    });
    return acronym;
  }

  getIdCity(city: string): any {
    let acronym = null;
    CityAcronym.forEach(element => {
      if (element['value'] === city) {
        acronym = element['id'];
      }
    });
    return acronym;
  }

  async saveData() {
    this.submitted = true;
    if (!this.personaForm.valid) {
      this.notify('error', 'Por favor, complete todos los campos obligatorios');
      return;
    }

    const persona: any = { ...this.personaForm.value };
    persona.ciExpedito = this.getAcronymCity(persona.expedido);
    delete persona.expedido;

    this.updatePersona(persona);
  }

  /* API Services */
  private updatePersona(persona: any) {
    this.employeeService.updatePersona(persona).subscribe({
      next: (data) => {
        this.notify('success', 'Registro actualizado con exito');
      },
      error: (error) => {
        this.notify('error', 'No se puedo actualizar el Registro');
      }
    });
  }

  /* Common functions */
  private notify(type: any, message: string) {
    let timerInterval: any;
    Swal.fire({
      title: message,
      icon: type,
      timer: 2000,
      timerProgressBar: true,
      willClose: () => {
        clearInterval(timerInterval);
      },
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
      }
    });
  }

  goBack() {
    this.location.back();
  }
}