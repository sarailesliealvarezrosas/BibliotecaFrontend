import { Vehicle } from "./vehicle.models";
import { VehicleClass } from "./vehicleClass.models";

export interface TechnicalData {
  uuid?: string;
  estado?: boolean;

  marca: string;
  modelo: string;
  color: string;
  pais: string;
  yearFabricacion?:number;  //ManufacturingYear

  // Classification
  tipoClaseVehiculoDto: VehicleClass; 
  servicio: string;         //PARTICULAR
  tiempoMotor?: string;    // 2 Tiempo , 4 Tiempos
  tipoMotor: string;        //Chispa , Compresión
  // tipoCombustion: string;  
  categoriaVehiculo: 'Liviano' | 'Mediano' | 'Pesado' | string;
  clasificacion: string;    //  M1, M2, N1
  tipoVehiculo: string;     //muevo reemplazado , transformado
  tipoCarroceria?: string;  //bodyType 
  traccion: string;         //delantera (FWD), trasera (RWD), total (AWD) o integral (4WD)
 
  // Specifications  
  numeroPuertas?: number;
  numeroAsientos?: number;
  capacidadCarga?: number;  //Tn.  pesoBruto
  cilindrada?: number;      //Cc.  
  kilometraje?: number;     //Km  
  tamanoMotor?: number;
  numeroMotor?: string;    //engineNumber
  emisionStandard?: string;

  vehiculoDto?: Vehicle; 
}