import { EmissionParameter } from "./emission-parameter.models";
import { FuelType } from "./fuelType.models";
import { VehicleGroup } from "./vehicleGroup.models";

export interface EmissionMetric {//limites_emision
  uuid?: string;
  estado?: boolean;

  fechaInicio:Date;
  fechaFin?:Date;
  activo:boolean;
  limite:number;

  tiempoMotor?:string;   //2 Tiempos ,4 Tiempos
  tipoMotor:string;   //Chispa , Compresión
  tipoCombustibleDto: FuelType;

  claseVehiculoDto?:VehicleGroup;  
  categoriaVehiculo?:string;  //liviano, Mediano, Pesado
  categoria?:string;   //  M1, M2, N1 ...

  yearFabricacionInicio?:number;
  yearFabricacionFin?:number
  altitudMinima?:number; //metros sobre nivel del mar
  altitudMaxima?:number; //metros sobre nivel del mar
  cilindradaMinimo?:number;   //Cc.
  cilindradaMaximo?:number;   //Cc.

  pesoBrutoMinimo?: number; //Kg
  pesoBrutoMaximo?: number; //Kg
  capacidadCargaMinimo?: number;//Tn.
  capacidadCargaMaximo?: number;//Tn.

  cicloPrueba?:string;
  normativa?:string;

  tipoParametroDto: EmissionParameter;
}