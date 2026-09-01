export interface AirIndiceIca {
  uuid?: string;
  estado?: boolean;

  activo: boolean;
  categoria: string;
  color: string;
  valorMinimo: number;
  valorMaximo?: number;
  descripcion: string;
  recomendacion?: string;
  norma?: string;
}