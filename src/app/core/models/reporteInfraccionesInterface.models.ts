export interface ReporteInfraccionesInterface {
  uuid?: string;
  estado?:boolean;

  placa: string;
  nombreConductor: string;
  fechaInfraccion: string;
  fechaPago: string;
  montoTotal: number;
  numeroTaza: number;
  fechaRegistro?: string;
  grado: string;
  tipoContribuyente: string;
}
