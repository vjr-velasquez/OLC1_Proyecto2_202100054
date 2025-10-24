import { Instruccion } from "../Abstractas/Instruccion";
import { Expresion } from "../Abstractas/Expresion";
import { Entorno } from "../Entorno/Entorno";
import { TipoInstruccion } from "../Utilidades/TipoInstruccion";

export class Case extends Instruccion {
    constructor(linea: number, columna: number, public condicion: Expresion, public instrucciones: Instruccion[]) {
        super(linea, columna, TipoInstruccion.CASE);
    }
    
    public ejecutar(entorno: Entorno) {
        const entornoLocal = new Entorno(entorno, 'Case');
        let condicion = this.condicion.ejecutar(entorno);
        if (condicion) {
            let bloque = this.instrucciones;
            for (let i = 0; i < bloque.length; i++) {
                let instruccion = bloque[i].ejecutar(entornoLocal);
                if (instruccion) {
                    return instruccion;
                }
            }
        }
    }
}