import { Activity } from "./activity.models";

export interface Event {
    uuid?: string;
    estado?: boolean;

    institucion?: string;
    titulo:string;
    descripcion:string;
    fechaInicio: Date;
    fechaFin?: Date;
    horaInicio?: string; // "HH:mm:ss"
    horaFin?: string; // "HH:mm:ss"
    
    direccion?:string;
    distrito?:string;
    latitud?:number;
    longitud?:number;
    altitud?:number;

    actividadDto: Activity;
  }