import { Vehicle } from "./vehicle.models";

export interface VehiclePhoto {
  uuid?: string;
  estado?: boolean;
  
  nombre?: string;
  ruta?: string;
  nombreUsuario: string;
  uuidUsuario:string;
  archivoFile: number;
  
  vehiculoDto?: Vehicle;
  // private MultipartFile archivoFile;
}
