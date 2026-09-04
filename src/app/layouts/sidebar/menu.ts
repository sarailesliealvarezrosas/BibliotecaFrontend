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