import { ContribuyenteType } from "./contribuyenteType.models";

export interface ConductorInterface {
  uuid?: string;
  estado?: boolean;
  nombre:string;
  primerApellido: string;
  segundoApellido?:string;
  apellidoEsposo?:string;
  numeroDocumento: string;
  tipoDocumento: string;
  email?: string;
  expedido?: number;
  nroTelefono:number;
  tipoContribuyenteDto?:ContribuyenteType;
  vehiculoDtoList?:any[];
}
