import { EstadoNotificacion, TipoNotificacion } from "../data/notifications";
import { Fine } from "./fine.models";
import { Inspection } from "./inspection.models";

export interface Notification {
  uuid?: string;
  estado?: boolean;
  
  uuidUsuario: string;
  nombreNotificador: string;
  fechaNotificacion: Date;
  numeroNotificacion: string; // Auto-generado
  
  numeroIntento?: number;// 1, 2, 3
  typeNotificacion?: TipoNotificacion;
  statusNotificacion?: EstadoNotificacion;
  fechaAsistencia: Date;
  horaAsistencia: string; 
  placa?:string;
  nombrePersonaNotificada?:string;
  // fechaVencimiento?: Date;
  // fechaEntrega?: Date;
  // fechaCumplimiento?: Date;
  // fechaProximoRecordatorio?: Date;

  actividad: string;
  direccion?: string;
  esDenuncia: boolean;
  sancion?: string;//consecuenciasIncumplimiento: string;   // recordatorio: boolean;
  observacion?: string;

  inspeccionDto?: Inspection;
  infraccionDtoList?: Fine[];

  // conductorDto: ConductorDto;
  // vehiculoDto: VehiculoDto;
  // actividadDto: ActividadDto;
}
