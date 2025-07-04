export interface Tarea {
    id_tarea: number;
    titulo: string; 
    descripcion: string;
    fecha_creacion: string;
    fecha_actualizacion: string;
    id_hu: number;
    participacion_asignada: number;
}

export interface ActividadUsuario {
    id_actividad: number;
    usuario: string;
    proyecto: number;
    nombre_proyecto: string;
    tarea: number;
    nombre_tarea: string;
    historia_usuario: number;
    nombre_hu: string;
    participacion: number;
    rol_participacio: string;
    accion_realizada: string;
    fecha_hora: string;
}

export interface ProyectoResumen {
  id_proyecto: number;
  nombre: string;
  descripcion: string;
  estado_proyecto: 'activo' | 'en_progreso' | 'hecho' | 'finalizado';
  usuario: number;
}
