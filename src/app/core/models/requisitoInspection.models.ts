import { RequisitoAdjunto } from "./requisito-adjunto.model";

export interface RequisitoInspectionInterface {
  uuid?: string;
  estado?: boolean;
  cumple?: boolean;
  fechaPresentacion?: string | Date;
  requisitoDto: { uuid?: string, descripcion?: string, obligatorio?: boolean };
  inspeccionDto: { uuid?: string };
  archivoAdjuntoDtoList?: RequisitoAdjunto[];
}