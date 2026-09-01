export interface FinePayment {
  uuid?: string;
  estado?: boolean;

  uuidInfraccion: string; 
  numeroTasa: string;
  fechaPago: Date;
}