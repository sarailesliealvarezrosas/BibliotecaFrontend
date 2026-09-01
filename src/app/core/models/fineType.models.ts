import { GradoInfraccion } from "../data/gradeInfraction";
import { ContribuyenteType } from "./contribuyenteType.models";
import { Regulation } from "./regulation.models";

export interface FineType {
  uuid?: string;
  estado?: boolean;
  esAutomatico: boolean;
  grado: GradoInfraccion;
  descripcion: string;
  articulo: string;
  valorUFV: number;
  conceptoRuat:string;
  tipoContribuyenteDto: ContribuyenteType;
  reglamentoDto: Regulation;
  infraccionDtoList?: any[];
}