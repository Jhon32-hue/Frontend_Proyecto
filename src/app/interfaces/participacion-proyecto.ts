export interface ParticipacionProyecto {
  id_participacion: number;
  id_usuario: { id: number; email: string; nombre_completo: string } | null;
  id_proyecto: { id_proyecto: number; nombre: string } | null;
  id_rol: { id_rol: number; nombre_rol: string; descripcion: string } | null;
  estado_participacion: boolean;
  fecha_incorporacion: string;
  invitado_por: { id: number; nombre_completo: string } | null;
}

export interface Rol {
  id_rol: number;       
  clave: string;        
  nombre: string;       
}
