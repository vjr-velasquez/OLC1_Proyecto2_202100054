export enum Tipo{
    ENTERO,
    DECIMAL,
    BOOLEANO,
    CARACTER,
    CADENA,
    NULL,
    OBJETO,
    VECTOR  
}

export type TipoRetorno = {valor: any, tipo: Tipo}