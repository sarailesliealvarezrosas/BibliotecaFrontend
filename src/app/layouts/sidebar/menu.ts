
// import { MenuItem } from './menu.model';

// export const MENU: MenuItem[] = [
//   { nombreMenu: 'Inicio', ruta: '/', icono: 'las la-tachometer-alt' },
//   { nombreMenu: 'Panel de Aire', ruta: '/air-dashboard', icono: 'las la-wind' },

//   { nombreMenu: 'Administración', isTitle: true },
//   {
//     nombreMenu: 'Administración', icono: 'las la-cogs', isCollapsed: true,
//     permisoHijoListDto: [
//       { nombreMenu: 'Actividades', ruta: '/admin/activities'},
//       { nombreMenu: 'UFVs', ruta: '/admin/ufvs' },
//       { nombreMenu: 'Tipos de Infracción', ruta: '/admin/infractions' },
//       { nombreMenu: 'Parámetros', ruta: '/admin/metrics' },
//       { nombreMenu: 'Tipos de Contribuyente', ruta: '/admin/contribuyente-type' },
//       { nombreMenu: 'Normativas', ruta: '/admin/regulations' },
//       { nombreMenu: 'Requisitos', ruta: '/admin/requirements' },
//       { nombreMenu: 'Configuraciones', ruta: '/admin/configurations' },
//     ]
//   },

//   {
//     nombreMenu: 'Ajustes Técnicos', icono: 'las la-tools', isCollapsed: true,
//     permisoHijoListDto: [
//       { nombreMenu: 'Equipos', ruta: '/settings/equipments' },
//       { nombreMenu: 'Combustibles', ruta: '/settings/fuels' },
//       { nombreMenu: 'Datos Técnicos', ruta: '/settings/data' },
//       { nombreMenu: 'Tipos', ruta: '/settings/types' },
//     ]
//   },

//   {
//     nombreMenu: 'Gestión', icono: 'las la-clipboard-list', isCollapsed: true,
//     permisoHijoListDto: [
//       { nombreMenu: 'Calendario', ruta: '/management/calendar' },
//       { nombreMenu: 'Inspección Técnica', ruta: '/management/technical-inspection' },
//       { nombreMenu: 'Multas', ruta: '/management/fines' },
//     ]
//   },

//   {
//     nombreMenu: 'Información', icono: 'las la-car', isCollapsed: true,
//     permisoHijoListDto: [
//       { nombreMenu: 'Vehículos', ruta: '/info/vehicles' },
//       { nombreMenu: 'Certificaciones', ruta: '/info/certifications' },
//       { nombreMenu: 'Notificaciones', ruta: '/info/notifications' },
//       { nombreMenu: 'Propietarios', ruta: '/info/owners' },
//       { nombreMenu: 'Conductores', ruta: '/info/drivers' },
//     ]
//   },

//   {
//     nombreMenu: 'Aire', icono: 'las la-smog', isCollapsed: true,
//     permisoHijoListDto: [
//       { nombreMenu: 'Índices ICA', ruta: '/air/indices-ica' },
//       { nombreMenu: 'Datos de Monitoreo', ruta: '/air/monitoring-data' },
//       { nombreMenu: 'Grupos de Riesgo', ruta: '/air/risk-groups' },
//       { nombreMenu: 'Estaciones', ruta: '/air/stations' },
//       { nombreMenu: 'Contaminantes', ruta: '/air/contaminants' },
//     ]
//   },

//   {
//     nombreMenu: 'Reportes', icono: 'las la-chart-bar', isCollapsed: true,
//     permisoHijoListDto: [
//       { nombreMenu: 'Notificaciones', ruta: '/reports/notifications' },
//       { nombreMenu: 'Infracciones', ruta: '/reports/infractions' },
//       { nombreMenu: 'Multas y Sanciones', ruta: '/reports/fines' },
//       { nombreMenu: 'Inspecciones por Fechas', ruta: '/reports/inspection' },
//     ]
//   },
// ];

import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  // ========== INICIO ==========
  { nombreMenu: 'Inicio', ruta: '/', icono: 'las la-tachometer-alt' },

  // ========== BIBLIOTECA ==========
  {
    nombreMenu: 'Biblioteca',
    icono: 'las la-book',
    isCollapsed: true,
    permisoHijoListDto: [
      { nombreMenu: 'Libros', ruta: '/biblioteca/libros' },
      { nombreMenu: 'Categorías', ruta: '/biblioteca/categorias' },
      { nombreMenu: 'Subcategorías', ruta: '/biblioteca/subcategorias' },
      { nombreMenu: 'Autores', ruta: '/biblioteca/autores' },
      { nombreMenu: 'Ubicaciones', ruta: '/biblioteca/ubicaciones' },
      { nombreMenu: 'Lectores', ruta: '/biblioteca/lectores' },
    ]
  },

  // ========== PRÉSTAMOS ==========
  {
    nombreMenu: 'Préstamos',
    icono: 'las la-hand-holding-heart',
    isCollapsed: true,
    permisoHijoListDto: [
      { nombreMenu: 'Prestar Libro', ruta: '/prestamos/nuevo' },
      { nombreMenu: 'Devoluciones', ruta: '/prestamos/devoluciones' },
      { nombreMenu: 'Historial', ruta: '/prestamos/historial' },
    ]
  },

  // ========== REPORTES ==========
  {
    nombreMenu: 'Reportes',
    icono: 'las la-chart-bar',
    isCollapsed: true,
    permisoHijoListDto: [
      { nombreMenu: 'Libros por Categoría', ruta: '/reportes/libros-categoria' },
      { nombreMenu: 'Préstamos por Fechas', ruta: '/reportes/prestamos-fechas' },
      { nombreMenu: 'Lectores Activos', ruta: '/reportes/lectores-activos' },
      { nombreMenu: 'Libros Más Prestados', ruta: '/reportes/libros-populares' },
    ]
  },

  // ========== ADMINISTRACIÓN (opcional) ==========
  {
    nombreMenu: 'Administración',
    icono: 'las la-cogs',
    isCollapsed: true,
    permisoHijoListDto: [
      { nombreMenu: 'Actividades', ruta: '/admin/activities' },  // ← Lo mantienes como ejemplo
      { nombreMenu: 'Usuarios', ruta: '/admin/usuarios' },
      { nombreMenu: 'Configuraciones', ruta: '/admin/configuraciones' },
    ]
  },
];