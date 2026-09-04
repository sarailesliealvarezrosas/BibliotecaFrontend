export interface Autor {
    uuid?: string;
    nombres: string;
    apellidos: string;
    nacionalidad: string;
    fechaNacimiento?: string;
    biografia?: string;
    activo?: boolean;
}