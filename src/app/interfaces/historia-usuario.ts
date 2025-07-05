export type EstadoHu = 'por_hacer' | 'en_proceso' | 'cerrada';


export interface HistoriaUsuario {
  id: number;
  proyecto: number;                    // id del Proyecto
  participacion_asignada: number|null; // id de Participacion (o null)
  titulo: string;
  descripcion: string;
  estado: EstadoHu;
  puntos_historia: number;
  tiempo_estimado_horas: number;
  fecha_creacion: string;              // '2025‑07‑04T14:23:18Z'
  fecha_cierre: string|null;           // puede ser null
}