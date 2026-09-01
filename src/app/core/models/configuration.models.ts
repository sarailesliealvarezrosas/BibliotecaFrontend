export interface Configuration { 
  uuid?: string;
  estado?: boolean;

  clave: string; //until 10 caracteres
  valor: string;
  unidad: string;
  descripcion: string;
  fechaInicio: Date;
  fechaFin: Date;
  resolucionApoyo: string;
  registradoPor: string; //untill 100 c
  uuidUsuario: string; //64 carac
  fechaRegistro: Date;
  activo: boolean;
}