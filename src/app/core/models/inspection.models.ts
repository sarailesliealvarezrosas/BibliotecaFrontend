import { ConductorInterface } from "./conductor.models";
import { EquipmentInterface } from "./equipment.models";
import { InspectionDetailInterface } from "./InspectionDetail.models";
import { RequisitoInspectionInterface } from "./requisitoInspection.models";
import { Vehicle } from "./vehicle.models";
export interface Inspection {
  uuid?: string;
  estado?: boolean;
  codigo?:string;
  fechaInspeccion: Date | string;
  lugarInspeccion: string;
  nombreInspector: string;
  uuidUsuario: string;
  observacion?: string;
  resultado: boolean;
  altitud: number;
  //equipo: string;
  examenVisualConforme: boolean;
  gasesEscapeConforme: boolean;
  fechaProximaInspeccion: Date | string;
  vehiculoDto?: Vehicle;
   conductorDto?: ConductorInterface | {
    uuid: string;
    nombre: string;
    primerApellido:string;
    segundoApellido?:string;
    apellidoEsposo?:string;
    numeroDocumento: string;
    tipoDocumento: string;
    email?:string 
    nroTelefono?:number;
    expedido?: number;
    tipoContribuyenteDto: {
      uuid: string;
      codigo: string;
      descripcion: string;
    }
  }
  actividadDto?: { uuid: string; tipoActividad?: string;};
  eventoDto?: { uuid: string; titulo?:string; direccion?:string; };
  detalleInspeccionDtoList?: InspectionDetailInterface[];
  requisitoInspeccionDtoList?: RequisitoInspectionInterface[];
  equipoDto?:{uuid: string; nombre?:string; version?:string;};

}