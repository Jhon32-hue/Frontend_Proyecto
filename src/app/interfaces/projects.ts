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