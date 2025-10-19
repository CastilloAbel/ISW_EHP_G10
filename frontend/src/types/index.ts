import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface Participante {
  nombre: string;
  dni: string;
  edad: string;
  talla: string;
}

export interface TipoActividad {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
}

export interface Actividad {
  id: number;
  nombre: string;
  descripcion: string;
  requiere_talla: number;
  cupos: number;
  tipo_id: number;
  tipo_nombre: string;
  tipo_codigo: string;
}

export interface FormData {
  tipoActividad: string;
  actividad: string;
  horarioId: string;
  cantidadPersonas: number;
  participantes: Participante[];
  terminosAceptados: boolean;
}
