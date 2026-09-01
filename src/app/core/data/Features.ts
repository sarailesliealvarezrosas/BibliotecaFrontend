
export const engineTimeTypes = [
  {value:'2 Tiempos'},
  {value:'4 Tiempos'}
];
export const engineTypes =
[
  {value:"Chispa"},
  {value:"Compresión"}
]
export const fuelTypes = [
  { value: 'Gasolina', ignition: 'Chispa' },
  { value: 'Gasolina-Aceite', ignition: 'Chispa' },
  { value: 'Gas natural vehicular (GNV o CNG)', ignition: 'Chispa' },
  { value: 'Gas licuado de petróleo (GLP o LPG)', ignition: 'Chispa' },
  { value: 'Etanol (bioetanol)', ignition: 'Chispa' },
  { value: 'Flex Fuel (bi-fuel)', ignition: 'Chispa' },

  { value: 'Diésel', ignition: 'Compresión' },
  { value: 'Biodiésel', ignition: 'Compresión' },

  { value: 'Electricidad (vehículos eléctricos)', ignition: 'Otro' },
  { value: 'Hidrógeno (pilas de combustible)', ignition: 'Otro' }
];

export const vehicleGroups = [
  {value:'Automovil'},
  {value:'Ciclomotor'},
  {value:'Vehiculo Pesado'},
  {value:'Maquinaria'},
  {value:'Remolque'}
];
export const vehicleClasses = [
  { value: "automovil", label: "Automóvil", group: "Automovil" },
  { value: "camioneta", label: "Camioneta", group: "Automovil" },
  { value: "vagoneta", label: "Vagoneta", group: "Automovil" },
  { value: "jeep", label: "Jeep", group: "Automovil" },
  { value: "furgoneta", label: "Furgoneta", group: "Automovil" },
  { value: "ambulancia", label: "Ambulancia", group: "Automovil" },

  { value: "moto", label: "Moto", group: "Ciclomotor" },
  { value: "torpedo", label: "Torpedo", group: "Ciclomotor" },
  { value: "quadratrack", label: "Quadratrack", group: "Ciclomotor" },

  { value: "camion", label: "Camión", group: "Vehiculo Pesado" },
  { value: "camionRemolque", label: "Camión con Remolque", group: "Vehiculo Pesado" },
  { value: "tractorCamion", label: "Tractor-Camión", group: "Vehiculo Pesado" },
  { value: "microbus", label: "Microbus", group: "Vehiculo Pesado" },
  { value: "micro", label: "Micro", group: "Vehiculo Pesado" },
  { value: "bus", label: "Bus", group: "Vehiculo Pesado" },
  { value: "miniBus", label: "MiniBus", group: "Vehiculo Pesado" },

  { value: "tractor", label: "Tractor", group: "Maquinaria" },
  { value: "aplanador", label: "Aplanador", group: "Maquinaria" },
  { value: "elevadoresCarga", label: "Elevadores de carga", group: "Maquinaria" },
  { value: "acopiados", label: "Acopiados", group: "Maquinaria" },

  { value: "remolque", label: "Remolque", group: "Remolque" }
];

export const serviceTypes= [      
  { value: "particular", label: "Particular" },
  { value: "publico", label: "Público" },
  { value: "oficial", label: "Oficial" },
]
export const vehicleTypes= [      
  { value: "NUEVO" },
  { value: "TRANSFORMADO" },
  { value: "REMPLAZADO" },
  { value: "CONVERTIVO" },
  { value: "REEMPLACADO"}
]

export const vehicleCategory= [      
  { value: "liviano", "label": "Liviano" },
  { value: "mediamo", "label": "Mediano" },
  { value: "pesado", "label": "Pesado" },
]
export const classifications= [
      {
        value: "M1",
        "label": "M1",
        "description": "Vehículos para transporte de pasajeros con hasta 8 asientos además del conductor",
        "group": "Passenger Vehicles"
      },
      {
        value: "M2",
        "label": "M2",
        "description": "Vehículos para transporte de pasajeros con más de 8 asientos y masa máxima hasta 5 toneladas",
        "group": "Passenger Vehicles"
      },
      {
        value: "M3",
        "label": "M3",
        "description": "Vehículos para transporte de pasajeros con más de 8 asientos y masa máxima superior a 5 toneladas",
        "group": "Passenger Vehicles"
      },
      {
        value: "N1",
        "label": "N1",
        "description": "Vehículos para transporte de mercancías con masa máxima hasta 3.5 toneladas",
        "group": "Goods Vehicles"
      },
      {
        value: "N2",
        "label": "N2",
        "description": "Vehículos para transporte de mercancías con masa máxima entre 3.5 y 12 toneladas",
        "group": "Goods Vehicles"
      },
      {
        value: "N3",
        "label": "N3",
        "description": "Vehículos para transporte de mercancías con masa máxima superior a 12 toneladas",
        "group": "Goods Vehicles"
      },
      {
        value: "O1",
        "label": "O1",
        "description": "Remolques con masa máxima hasta 0.75 toneladas",
        "group": "Trailers"
      },
      {
        value: "O2",
        "label": "O2",
        "description": "Remolques con masa máxima entre 0.75 y 3.5 toneladas",
        "group": "Trailers"
      },
      {
        value: "O3",
        "label": "O3",
        "description": "Remolques con masa máxima entre 3.5 y 10 toneladas",
        "group": "Trailers"
      },
      {
        value: "O4",
        "label": "O4",
        "description": "Remolques con masa máxima superior a 10 toneladas",
        "group": "Trailers"
      },
      {
        value: "L1",
        "label": "L1",
        "description": "Vehículos de dos ruedas con motor de cilindrada hasta 50 cm³ y velocidad máxima de 50 km/h",
        "group": "Motorcycles & Mopeds"
      },
      {
        value: "L2",
        "label": "L2",
        "description": "Vehículos de tres ruedas con motor de cilindrada hasta 50 cm³ y velocidad máxima de 50 km/h",
        "group": "Motorcycles & Mopeds"
      },
      {
        value: "L3",
        "label": "L3",
        "description": "Motocicletas de dos ruedas con motor de cilindrada superior a 50 cm³ o velocidad máxima superior a 50 km/h",
        "group": "Motorcycles & Mopeds"
      },
      {
        value: "L4",
        "label": "L4",
        "description": "Motocicletas con sidecar",
        "group": "Motorcycles & Mopeds"
      },
      {
        value: "L5",
        "label": "L5",
        "description": "Triciclos motorizados",
        "group": "Motorcycles & Mopeds"
      },
      {
        value: "L6",
        "label": "L6",
        "description": "Cuadriciclos ligeros con masa en vacío hasta 350 kg y velocidad máxima de 45 km/h",
        "group": "Motorcycles & Mopeds"
      },
      {
        value: "L7",
        "label": "L7",
        "description": "Cuadriciclos pesados con masa en vacío hasta 400 kg (550 kg para transporte de mercancías) y potencia máxima de 15 kW",
        "group": "Motorcycles & Mopeds"
      },
      {
        value: "T",
        "label": "T",
        "description": "Tractores agrícolas o forestales motorizados",
        "group": "Special Purpose Vehicles"
      },
      {
        value: "G",
        "label": "G",
        "description": "Vehículos todoterreno",
        "group": "Special Purpose Vehicles"
      },
      {
        value: "SA",
        "label": "SA",
        "description": "Autocaravana (vehículo vivienda)",
        "group": "Special Purpose Vehicles"
      },
      {
        value: "SB",
        "label": "SB",
        "description": "Vehículo blindado",
        "group": "Special Purpose Vehicles"
      },
      {
        value: "SC",
        "label": "SC",
        "description": "Ambulancia",
        "group": "Special Purpose Vehicles"
      },
      {
        value: "SD",
        "label": "SD",
        "description": "Coche fúnebre",
        "group": "Special Purpose Vehicles"
      }
]

export const vehicleFields = [

  { name: 'classification', label: 'Clasificación', type: 'select', options: classifications, required: true },
  { name: 'engineType', label: 'Tipo de motor', type: 'select', options: ['Chispa', 'Compresión'], required: true },
  { name: 'fuelType', label: 'Combustible', type: 'select', options: [], required: true },
  { name: 'displacement', label: 'Cilindrada (cc)', type: 'number', required: true },
  { name: 'modelYear', label: 'Año de modelo', type: 'number', required: true },
  { name: 'altitude', label: 'Altitud (msnm)', type: 'number', required: true },


  { name: 'gvwr', label: 'Peso bruto vehicular (kg)', type: 'number', required: false },
  { name: 'seats', label: 'Número de asientos', type: 'number', required: false },
  { name: 'injectionType', label: 'Tipo de inyección (diésel)', type: 'select', 
    options: ['Directa', 'Indirecta', 'No aplica'], required: false },
  { name: 'cargoCapacity', label: 'Capacidad de carga (kg)', type: 'number', 
    required: false, showIf: (values: { classification: string; }) => ['N1', 'N2', 'N3', 'O1', 'O2', 'O3', 'O4'].includes(values.classification) },
  { name: 'emissionStandard', label: 'Norma de emisión', type: 'select', 
    options: ['EURO II', 'EURO IV', 'EPA Tier 1', 'EPA Tier 2'], required: false },
];