export interface sellerModel {
    id_vendedor: number;
    marca: string;
    nombre: string;
    apellido: string;
    telefono: number;
    carnet: number;
    direccion: string;
    mail: string;
    alquiler: number;
    exhibicion: number;
    delivery: number;
    adelanto_servicio: number;
    comision_porcentual: number;
    comision_fija: number;
    fecha: Date | undefined; 
    fecha_vigencia: Date;
    almacen_caja: number;
    deuda: number;
    id_trabajador: number;
}