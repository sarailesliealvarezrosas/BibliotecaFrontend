import { VehicleGroup } from "./vehicleGroup.models";

export interface VehicleClass {
  uuid?: string;
  estado?: boolean;
  nombre: string;
  descripcion: string;
  claseVehiculoDto: VehicleGroup
}