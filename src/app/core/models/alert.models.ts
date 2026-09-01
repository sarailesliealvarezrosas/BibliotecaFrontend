import { Activity } from "./activity.models";
import { Fine } from "./fine.models";
import { Notification } from "./notification.models";
import { Vehicle } from "./vehicle.models";

export interface Alert {
    uuid?: string;
    estado?: boolean;

    tipo: string;
    mensaje: string;
    fechaAlerta: Date | string;
    uuidDestinatario: string;
    rolDestinatario: string;
    esLeido: boolean;
    notificacionDto?: Notification;
    infraccionDto?: Fine;
    vehiculoDto?: Vehicle;
  }