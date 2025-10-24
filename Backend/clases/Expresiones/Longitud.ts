import { Expresion } from "../Abstractas/Expresion";
import { Entorno } from "../Entorno/Entorno";
import { Tipo, TipoRetorno } from "../Utilidades/Tipo";
import { TipoExpresion } from "../Utilidades/TipoExpresion";

export class Longitud extends Expresion {
    constructor(linea: number, columna: number, public valor: Expresion) {
        super(linea, columna, TipoExpresion.PRIMITIVO);
    }

    public ejecutar(entorno: Entorno): TipoRetorno {
        const valor = this.valor.ejecutar(entorno);
        if (valor.tipo === Tipo.CADENA) {
            return { valor: valor.valor.length, tipo: Tipo.ENTERO };
        } 
        return { valor: 0, tipo: Tipo.ENTERO };
    }
}