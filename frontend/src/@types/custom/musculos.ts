export type Musculo = {
    id: number
    nombre: string
    activo: boolean
    esGlobal: boolean
    updatedAt?: Date
    createdAt?: Date
    creado_por: string
}

export type MusculoFiltro = {
    nombre?: string
    activo?: boolean
    esGlobal?: boolean
}

export type NuevoMusculo = {
    nombre: string
    activo: boolean
    esGlobal: boolean
}

export type ApiMusculosResponse = {
    ok:string,
    status:number,
    message:string,
    data: Musculo[],
    timestamp: string
}

export type ApiMusculosByIdResponse = {
    ok:string,
    status:number,
    message:string,
    data: Musculo,
    timestamp: string
}