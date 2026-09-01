export interface Activity {
  uuid?: string;
  estado?: boolean;
  activo?: boolean;
  fechaInicio: Date;
  fechaFin: Date;
  tipoActividad: string;
  
}