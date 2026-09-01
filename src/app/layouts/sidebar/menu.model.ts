export interface MenuItem {
  uuid?: any;
  estado?:boolean;
  modulo?: string;
  codigo?:string;

  orden?:number;
  nombreMenu:string;
  accion?:string;
  icono?: string;
  ruta?: string;
  permisoHijoListDto?: any;
  permisoPadreDto?: any;
  
  isTitle?: boolean;
  badge?: any;
  isLayout?: boolean;
  isCollapsed?: any;
  subNivel?:boolean
}
