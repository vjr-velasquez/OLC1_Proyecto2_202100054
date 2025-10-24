import { Expresion } from "../Abstractas/Expresion";
import { Entorno } from "../Entorno/Entorno";
import { Tipo, TipoRetorno } from "../Utilidades/Tipo";
import { TipoExpresion } from "../Utilidades/TipoExpresion";

export class Redondear extends Expresion {
    constructor(linea: number, columna: number, public valor: Expresion) {
        super(linea, columna, TipoExpresion.PRIMITIVO);
    }

    public ejecutar(entorno: Entorno): TipoRetorno {
        const valor = this.valor.ejecutar(entorno);
        if (valor.tipo === Tipo.DECIMAL) {
            return { valor: Math.round(valor.valor), tipo: Tipo.ENTERO };
        }
        return { valor: valor.valor, tipo: valor.tipo };
    }
}