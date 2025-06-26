export interface Auth {
  refresh: string;
  access: string;
  user: User;
}

export interface User {
  user_id: number;
  email: string;
  nombre_completo: string;
}

// Esta es la respuesta que se recibe al registrar
export interface Register {
  id: number;
  email: string;
  nombre_completo: string;
  estado_cuenta: boolean;
  fecha_registro: number;
  ultima_conexion: string | null;
  is_active: boolean;
}

// Esta es la interfaz para el cuerpo (payload) que se envía en el registro
export interface RegisterRequest {
  email: string;
  nombre_completo: string;
  password: string;
}
