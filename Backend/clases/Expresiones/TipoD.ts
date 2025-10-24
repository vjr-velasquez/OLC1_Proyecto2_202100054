import { Expresion } from "../Abstractas/Expresion";
import { Entorno } from "../Entorno/Entorno";
import { Tipo, TipoRetorno } from "../Utilidades/Tipo";
import { TipoExpresion } from "../Utilidades/TipoExpresion";

export class TipoD extends Expresion {
    constructor(linea: number, columna: number, public valor: Expresion) {
        super(linea, columna, TipoExpresion.PRIMITIVO);
    }

    public ejecutar(entorno: Entorno): TipoRetorno {
        const valor = this.valor.ejecutar(entorno);
        if (valor.tipo === Tipo.ENTERO) {
            return { valor: "Entero", tipo: Tipo.ENTERO };
        } else if (valor.tipo === Tipo.DECIMAL) {
            return { valor: "Decimal", tipo: Tipo.DECIMAL };
        }
        else if (valor.tipo === Tipo.CARACTER) {
            return { valor: "Caracter", tipo: Tipo.CARACTER };
        }
        else if (valor.tipo === Tipo.CADENA) {
            return { valor: "Cadena", tipo: Tipo.CADENA };
        }
        else if (valor.tipo === Tipo.BOOLEANO) {
            return { valor: "Booleano", tipo: Tipo.BOOLEANO };
        }
        else if (valor.tipo === Tipo.OBJETO) {
            return { valor: "Objeto", tipo: Tipo.OBJETO };
        }
        return { valor: valor.valor, tipo: Tipo.NULL };
    }
}