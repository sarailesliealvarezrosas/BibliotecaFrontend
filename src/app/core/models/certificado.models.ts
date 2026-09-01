import { Inspection } from "./inspection.models";

export interface CertificadoInterface { 
  uuid?: string;
  estado?: boolean;

  codigo: string;
  qrContent: string;
  fechaEmision: string;
  fechaVencimiento: string;
  esValido: boolean;
  inspeccionDto: Inspection; 

} 