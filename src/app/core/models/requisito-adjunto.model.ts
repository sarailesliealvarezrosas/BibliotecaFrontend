//en este se guardan los archivos subidos
import { RequisitoInspectionInterface } from "./requisitoInspection.models";
export interface RequisitoAdjunto {
  uuid?: string;
  nombre?: string;
  descripcion?: string;
  rutaArchivo?: string;
  fechaAdjunto?: Date; 
  nombreUsuario?: string;
  uuidUsuario?: string;
  estado: boolean;
  archivoFile?: File;
  requisitoInspeccionDto?: { uuid: string } | RequisitoInspectionInterface;
}
