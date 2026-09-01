import { EmissionParameter } from "./emission-parameter.models";
import { FuelType } from "./fuelType.models";
import { Inspection } from "./inspection.models";

export interface InspectionDetailInterface {
  uuid?: string;
  estado?: boolean;
  valor: number;
  resultadoParcial: boolean;
  tipoPrueba?: number;                
  nroEjecucion?: number;  
  limitePermisible?: number;    
  inspeccionDto?: { uuid: string } | Inspection;
  tipoParametroDto?: { uuid: string, nombre:string, unidad:string } | EmissionParameter;
  tipoCombustibleDto?:FuelType;
}

