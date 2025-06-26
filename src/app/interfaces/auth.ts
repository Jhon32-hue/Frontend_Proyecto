
//Primero se mapea la respuesta de la petición del Json
export interface Auth {
    refresh : string,
    access : string,
    user : User
}

export interface User {
    user_id : number,
    email : string,
    nombre_completo : string
}