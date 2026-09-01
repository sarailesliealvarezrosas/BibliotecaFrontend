import { AirIndiceIca } from "./air-indice-ica.models";

export interface RiskGroup {
  uuid?: string;
  estado?: boolean;

  grupo: string;  
  recomendacion: string;  
  categoriaAireDto: AirIndiceIca
}