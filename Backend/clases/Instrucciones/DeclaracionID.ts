import { Expresion } from "../Abstractas/Expresion";
import { Instruccion } from "../Abstractas/Instruccion";
import { Entorno } from "../Entorno/Entorno";
import { Tipo, TipoRetorno } from "../Utilidades/Tipo";
import { TipoInstruccion } from "../Utilidades/TipoInstruccion";

export class DeclaracionID extends Instruccion {
    constructor(linea: number, columna: number, private id: string | string[], private tipo: Tipo | Tipo[], private valor: Expresion | null) {
        super(linea, columna, TipoInstruccion.CREAR_VARIABLE);
    }

    public ejecutar(entorno: Entorno):any {
        if (typeof this.id === 'string' && typeof this.tipo === 'number' && this.valor) {
            const valor: TipoRetorno = this.valor?.ejecutar(entorno)
            if (valor.tipo === this.tipo) {
                entorno.guardarVariable(this.id, valor.valor, this.tipo, this.linea, this.columna)
            } else {
                // Error semántico - Tipo de dato incorrecto
            }
        }
        else if (typeof this.id === 'string' && typeof this.tipo === 'number' && this.valor === null) {
            if(this.tipo === Tipo.ENTERO || this.tipo === Tipo.DECIMAL) {
                entorno.guardarVariable(this.id, 0, this.tipo, this.linea, this.columna)
            }
            else if(this.tipo === Tipo.CADENA) {
                entorno.guardarVariable(this.id, '', this.tipo, this.linea, this.columna)
            }
            else if(this.tipo === Tipo.BOOLEANO) { 
                entorno.guardarVariable(this.id, false, this.tipo, this.linea, this.columna)
            }
            else if(this.tipo === Tipo.CARACTER) {
                entorno.guardarVariable(this.id, '', this.tipo, this.linea, this.columna)
            }
        }
    }
}