export type RolesUser = 'project management' | 'scrum_master' | 'developer';


export interface Users {
    nombre_rol: RolesUser,
    descripcion: string,
}
