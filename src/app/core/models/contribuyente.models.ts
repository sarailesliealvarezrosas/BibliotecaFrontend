export interface Contribuyente {
  // nombre_completo: any;
  // numero_documento: any;
  uuid?: string;
  estado?: boolean;
  
  username?: string;
  password?: string;
  estadoUsuario: string; 
  verificationCode?: string; //no en bk
  tipoContribuyente?:string;
  codigoContribuyente?:string;
  tipoDocumento: string;
  numeroDocumento: string;
  expedido: string;
  nombre: string;
  primerApellido: string; 
  segundoApellido: string; 
  fullName?:string;
  fullDocument?:string;
  fechaNacimiento: string;
  estadoCivil: string;
  nroNit?: string;
  genero: string; 
  celular: string;
  email: string;
  direccion?: string;
}
