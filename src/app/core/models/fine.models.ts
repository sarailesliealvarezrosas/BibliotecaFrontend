
import { StatusInfraccion } from "../data/StatusInfraction";
import { FineType } from "./fineType.models";
import { Inspection } from "./inspection.models";
import { Notification } from "./notification.models";
import { Vehicle } from "./vehicle.models";

export interface Fine {
  uuid?: string;
  estado?: boolean;

  numeroTasa?: string; 
  motivo: string;
  montoTotal: number;
  fechaInfraccion: Date;
  statusInfraccion: StatusInfraccion;
  fechaPago?: Date;
  estadoPago: boolean;
  nombreRegistrador: string;
  uuidUsuario: string;

  tipoInfraccionDto: FineType;
  vehiculoDto: Vehicle;
  inspeccionDto?: Inspection;
  notificacionDto?: Notification;

  generadoSistema:boolean;
  enPlazo:boolean;
}