import { EmissionMetric } from "./emission-metric.models";

export interface EmissionParameter  {//tipo_parametros
  uuid?: string;
  estado?: boolean;
  
  activo: boolean;
  nombre: string;
  descripcion: string;
  unidad: string;

  limiteEmisionDtoList?:EmissionMetric[];
  detalleInspeccionDtoList?:any[]
}
