import { Instruccion } from "../Abstractas/Instruccion";
import { Entorno } from "../Entorno/Entorno";
import { Parametro } from "../Expresiones/Parametro";
import { Tipo } from "../Utilidades/Tipo";
import { TipoInstruccion } from "../Utilidades/TipoInstruccion";

export class Metodo extends Instruccion { 
    constructor(linea: number, columna: number, public nombreMetodo: string, public tipo: Tipo, public parametros: Parametro[], public instrucciones: Instruccion[]) {
        super(linea, columna, TipoInstruccion.DECLARAR_METODO);
    }

    public ejecutar(entorno: Entorno) {
        entorno.guardarMetodo(this.nombreMetodo, this);
    }
}