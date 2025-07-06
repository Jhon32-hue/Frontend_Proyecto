export interface ProjectCreate {
    nombre: string;
    descripcion: string;
    estado_proyecto: string;
}

export interface DeleteProject {
    id_proyecto: number;
    nombre: string;
    descripcion: string;
    estado_proyecto: boolean;
    usuario: number;
}

export interface UsuarioAColaborar {
  id: number;
  email: string;
  estado: 'activo' | 'inactivo'; // Estado del usuario
}

export interface Proyecto {
  id: number;
  nombre: string;
}

export interface RolAsignado {
  id: number;
  nombre_rol: string; // El nombre del rol asignado (por ejemplo: 'scrum_master')
}

export interface ParticipacionInvitado {
  id: number;
  estado_participacion: 'inactivo'; // Estado de la participación (en este caso siempre 'inactivo' al crear la invitación)
}

export interface InvitadoPor {
  id: number;
  email: string;
  nombre_completo: string;
}

export interface InvitarColaboradorResponse {
  mensaje: string; // Mensaje de éxito
  usuario: UsuarioAColaborar;
  proyecto: Proyecto;
  rol_asignado: RolAsignado;
  participacion: ParticipacionInvitado;
  invitado_por: InvitadoPor;
  link_principal: string; // Enlace principal (para completar el registro o iniciar sesión y aceptar invitación)
}
