import { Component, ViewChild } from '@angular/core';
import {DecimalPipe} from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import {CityAcronym}  from 'src/app/core/data/Places';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})

export class ProfileComponent {

  CityAcronym=CityAcronym;
  // userData: any;
//  userType:string='';
  userData: any = {
    uuid: 'abc123-inspector',
    designacion: {
      personaDto: {
        fullName: 'Juan Pérez Gutierrez'
      }
    }
  };
  userType: string = 'INSPECTOR';


  persona:any = null;
  funcionario!:any;
  avatar="default-profile1.png";
  // userRol =UserRol;

  constructor(
  //  private authService:AuthenticationService, 
    private modalService: NgbModal
  ) {}

 
  ngOnInit(): void {
    this.avatar = "default-profile1.png";
    // Ya no necesitamos AuthenticationService

    this.persona = this.userData.designacion.personaDto;

    const funcionarioString = localStorage.getItem('assignaments');

    this.funcionario = funcionarioString
      ? JSON.parse(funcionarioString)
      : null;
  }

  public openModal() {
    // const modalRef = this.modalService.open(PassResetComponent, {
    //     backdrop: 'static',
    // });
    // modalRef.componentInstance.userData = this.userData;
  }

  getAcronymCity(city: any): any {
    let acronym = null;
    CityAcronym.forEach(element => {
      if (element['value'] === city) {
        acronym = element['id'];
      }
    });
    return acronym;
  }
  
  getCityDescription(ciExpedido: any): string {
    const cityById = CityAcronym.find(c => c.id === ciExpedido);  
    if (cityById) {
      return cityById.value;
    }
    // const cityByDescription = CityAcronym.find(c => c.description === ciExpedido);
    // if (cityByDescription) {
    //   return cityByDescription.description;
    // }  
    return ciExpedido;
  }
   
}
