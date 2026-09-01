import { ContribuyenteType } from "./contribuyenteType.models";
import { Vehicle } from "./vehicle.models";

export interface Owner {
  [x: string]: any;
  uuid?: string;
  estado?: boolean;
  
  tipoContribuyenteDto: ContribuyenteType;
  codigoContribuyente?:string;
  nombreCompleto?: string;
  
  nombre: string;
  primerApellido:string;
  segundoApellido?:string;
  apellidoEsposo?:string;

  tipoDocumento: string;
  numeroDocumento: string;
  expedido: number;
  estadoCivil?:string;
  fechaNacimiento?:string;
  genero?:string; 

  email?:string;
  nroTelefono?: string;
  
  vehiculoDtoList?:Vehicle[]
}
