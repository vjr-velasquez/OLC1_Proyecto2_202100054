import { Expresion } from "../Abstractas/Expresion";
import { Entorno } from "../Entorno/Entorno";
import { Tipo, TipoRetorno } from "../Utilidades/Tipo";
import { TipoExpresion } from "../Utilidades/TipoExpresion";

export class Casteo extends Expresion {
    constructor(linea: number, columna: number, public tipo: Tipo, public valor: Expresion) {
        super(linea, columna, TipoExpresion.CASTEO);
    }

    public ejecutar(entorno: Entorno): TipoRetorno {
        const valor = this.valor.ejecutar(entorno);
        const tipo = this.tipo;
        if (valor.tipo === Tipo.ENTERO) {
            if (tipo === Tipo.DECIMAL) {
                return { valor: parseFloat(valor.valor).toFixed(1), tipo: tipo };
            } else if (tipo === Tipo.CARACTER) {
                return { valor: String.fromCharCode(Number(valor.valor)), tipo: tipo };
            } else if (tipo === Tipo.CADENA) {
                return { valor: valor.valor.toString(), tipo: tipo };
            }
        }else if (valor.tipo === Tipo.DECIMAL) {
            if (tipo === Tipo.ENTERO) {
                return { valor: parseInt(valor.valor), tipo: tipo };
            } else if (tipo === Tipo.CADENA) {
                return { valor: valor.valor.toString(), tipo: tipo };
            }
        } else if (valor.tipo === Tipo.CARACTER) {
            if (tipo === Tipo.ENTERO) {
                return { valor: valor.valor.toString().charCodeAt(0), tipo: tipo };
            } else if (tipo === Tipo.DECIMAL) {
                return { valor: parseFloat(valor.valor.toString().charCodeAt(0)), tipo: tipo };
            }
        }
        return { valor: valor.valor, tipo: tipo };
    }
}