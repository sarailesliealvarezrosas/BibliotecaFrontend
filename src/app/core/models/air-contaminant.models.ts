import { AirMonitoringData } from "./air-monitoring-data.models";

export interface AirContaminant {
  uuid?: string;
  estado?: boolean;

  nombre:string;
  descripcion: string;
  
  medicionAireDtoList?:AirMonitoringData;
}