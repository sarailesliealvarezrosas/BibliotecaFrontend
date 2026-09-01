import { FuelType } from "./fuelType.models";

export interface VehicleFuelType {
  uuid?: string;
  estado?: boolean;
  
  esPrimario: boolean;
  tipoCombustibleDto: FuelType;
}
