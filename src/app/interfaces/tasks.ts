export type EstadoTarea = 'por_hacer' | 'en_progreso' | 'hecha';

export interface Tasks {
  id_tarea: number;
  id_hu: number;           // FK a la HU
  titulo: string;
  descripcion: string;
  participacion_asignada: number;
  estado_tarea: EstadoTarea;
  fecha_creación: string;
  fecha_actualizacion: string;
}
