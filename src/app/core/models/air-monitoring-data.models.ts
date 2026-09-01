import { AirContaminant } from "./air-contaminant.models";
import { AirStation } from "./air-station.models";

export interface AirMonitoringData {
  uuid?: string;
  estado?: boolean;

  valor: number;
  fecha: Date;
  mes: string;
  dia: number;
  
  contaminanteDto:AirContaminant;
  estacionDto: AirStation;  

  recomendaciones?:string;
  categoria?:string
}