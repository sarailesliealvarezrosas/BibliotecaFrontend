export interface UfvsInterface {
    uuid?: string;
    estado?:boolean;
  
    fecha: string | Date;///true =eliminado   false = visible habilitado  // string
    valor: number,
    //descripcion: string
  }