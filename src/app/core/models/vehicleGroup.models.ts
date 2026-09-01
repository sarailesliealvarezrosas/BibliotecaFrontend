import { VehicleClass } from "./vehicleClass.models";

export interface VehicleGroup {
  uuid?: string;
  estado?: boolean;
  nombre: string;
  descripcion: string;
  
  tipoClaseVehiculoDtoList?: VehicleClass[]
}

