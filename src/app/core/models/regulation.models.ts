export interface Regulation {
  uuid?: string;
  estado?: boolean;
  
  activo:boolean;
  codigo: string;
  descripcion:string;
  fechaEmision: Date;
}
