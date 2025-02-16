export type Device = {
    id: number
    nombre: string
    descripcion: string
    activo: boolean
}

export type NewDevice = {
    nombre: string
    descripcion: string
    activo: boolean
}


export type ApiDevicesReponse = {
    ok:string,
    status:number,
    message:string,
    data: Device[],
    timestamp: string
}

export type ApiDeviceReponse = {
    ok:string,
    status:number,
    message:string,
    data: Device,
    timestamp: string
}