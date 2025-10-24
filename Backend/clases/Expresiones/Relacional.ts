import { Expresion } from "../Abstractas/Expresion";
import { Entorno } from "../Entorno/Entorno";
import { Tipo, TipoRetorno } from "../Utilidades/Tipo";
import { TipoExpresion } from "../Utilidades/TipoExpresion";
import { relacional } from "../Utilidades/RelacionalDominante";

export class Relacional extends Expresion{
    private tipo: Tipo = Tipo.NULL;
    constructor(linea: number, columna: number, public exp1: Expresion, public signo: string, public exp2: Expresion) {
        super(linea, columna, TipoExpresion.RELACIONAL);
    }

    public ejecutar(entorno: Entorno): TipoRetorno {
        switch(this.signo) {
            case '==':
                return this.igual(entorno);
            case '!=':
                return this.diferente(entorno);
            case '>=':
                return this.mayorIgual(entorno);
            case '<=':
                return this.menorIgual(entorno);
            case '>':
                return this.mayor(entorno);
            case '<':
                return this.menor(entorno);
            default:
                throw new Error(`Operador logico no reconocido: ${this.signo}`);
        }
    }

    igual (entorno: Entorno): TipoRetorno {
        const valor1 = this.exp1.ejecutar(entorno);
        const valor2 = this.exp2.ejecutar(entorno);
        this.tipo = Tipo.BOOLEANO;
        let comparador:number = relacional[valor1.tipo][valor2.tipo];
        if (comparador === 1) {
            return {valor: valor1.valor === valor2.valor, tipo: this.tipo};
        }
        // Error semántico: Los tipos no son comparables
        return {valor: 'NULL', tipo: Tipo.NULL};
    }
    diferente (entorno: Entorno): TipoRetorno {
        const valor1 = this.exp1.ejecutar(entorno);
        const valor2 = this.exp2.ejecutar(entorno);
        this.tipo = Tipo.BOOLEANO;
        let comparador:number = relacional[valor1.tipo][valor2.tipo];
        if (comparador === 1) {
            return {valor: valor1.valor !== valor2.valor, tipo: this.tipo};
        }
        // Error semántico: Los tipos no son comparables
        return {valor: 'NULL', tipo: Tipo.NULL};
    }
    mayorIgual (entorno: Entorno): TipoRetorno {
        const valor1 = this.exp1.ejecutar(entorno);
        const valor2 = this.exp2.ejecutar(entorno);
        this.tipo = Tipo.BOOLEANO;
        let comparador:number = relacional[valor1.tipo][valor2.tipo];
        if (comparador === 1) {
            return {valor: valor1.valor >= valor2.valor, tipo: this.tipo};
        }
        // Error semántico: Los tipos no son comparables
        return {valor: 'NULL', tipo: Tipo.NULL};
    }
    menorIgual (entorno: Entorno): TipoRetorno {
        const valor1 = this.exp1.ejecutar(entorno);
        const valor2 = this.exp2.ejecutar(entorno);
        this.tipo = Tipo.BOOLEANO;
        let comparador:number = relacional[valor1.tipo][valor2.tipo];
        if (comparador === 1) {    
            return {valor: valor1.valor <= valor2.valor, tipo: this.tipo};
        }
        // Error semántico: Los tipos no son comparables
        return {valor: 'NULL', tipo: Tipo.NULL};
    }
    mayor (entorno: Entorno): TipoRetorno {
        const valor1 = this.exp1.ejecutar(entorno);
        const valor2 = this.exp2.ejecutar(entorno);
        this.tipo = Tipo.BOOLEANO;
        let comparador:number = relacional[valor1.tipo][valor2.tipo];
        if (comparador === 1) {
            return {valor: valor1.valor > valor2.valor, tipo: this.tipo};
        }
        // Error semántico: Los tipos no son comparables
        return {valor: 'NULL', tipo: Tipo.NULL};
    }
    menor (entorno: Entorno): TipoRetorno {
        const valor1 = this.exp1.ejecutar(entorno);
        const valor2 = this.exp2.ejecutar(entorno);
        this.tipo = Tipo.BOOLEANO;
        let comparador:number = relacional[valor1.tipo][valor2.tipo];
        if (comparador === 1) {
            return {valor: valor1.valor < valor2.valor, tipo: this.tipo};
        }
        // Error semántico: Los tipos no son comparables
        return {valor: 'NULL', tipo: Tipo.NULL};
    }
}