import { ConductorInterface } from "./conductor.models";
import { Inspection } from "./inspection.models";
import { Owner } from "./owner.models";
import { TechnicalData } from "./technical-data.models";

import { Fine } from "./fine.models";
import { VehiclePhoto } from "./vehiclePhoto.models";
import { VehicleFuelType } from "./vehicleFuelType.models";

export interface Vehicle {
  uuid?: string;
  estado?: boolean;
  fechaRegistro: Date;
  esMovil: boolean;
  esOficial: boolean;
  esUnidadIndustrial: boolean;
  jurisdiccionOrigen: string;

  placa?: string;                   //Matrícula / Placa — The public identifier shown on the vehicle
  poliza: string;                   //Insurance policy number
  vinNumeroIdentificacion?: string; //VIN (Vehicle Identification Number) — A unique global identifier for the vehicle, 17 characters
  pinNumeroIdentificacion?:string;  //PIN 
  placaAnterior?:string;
  nroCopiasPlaca: number;               
      // registrationNumber?: string;  //Official government registration number
      // fleetNumber?: string;        //Company-assigned fleet number (if part of a fleet)
      // rfidTagId?: string;          //RFID tag for automatic recognition or gate systems   
    soatNumber?: string;
    gpsTrackerId?: string;

  datoTecnicoDto: TechnicalData;
  vehiculoTipoCombustibleDtoList?: VehicleFuelType[];
  fotoVehiculoDtoList?: VehiclePhoto[];
  propietarioDto?:Owner;
  
  conductorDtoList?: ConductorInterface[];  //
  inspeccionDtoList?:Inspection[];// 
  infraccionDtoList?:Fine[];
}
