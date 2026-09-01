import { AirMonitoringData } from "./air-monitoring-data.models";

export interface AirStation {
  uuid?: string;
  estado?: boolean;

  nombre:string;
  tipo: string;
  descripcion?: string;
  ubicacion: string;
  
  medicionAireDtoList?:AirMonitoringData;
}