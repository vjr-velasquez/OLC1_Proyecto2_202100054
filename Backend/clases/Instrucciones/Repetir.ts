import { Expresion } from "../Abstractas/Expresion";
import { Instruccion } from "../Abstractas/Instruccion";
import { Entorno } from "../Entorno/Entorno";
import { Tipo } from "../Utilidades/Tipo";
import { TipoInstruccion } from "../Utilidades/TipoInstruccion";
import { Bloque } from "./Bloque";

export class Repetir extends Instruccion {
    private bloque: Bloque;
    constructor(linea: number, columna: number, instrucciones: Instruccion[], private condicion: Expresion) {
        super(linea, columna, TipoInstruccion.REPETIR);
        this.bloque = new Bloque(linea, columna, instrucciones);
    }
    public ejecutar(entorno: Entorno) {
        const entornoLocal = new Entorno(entorno, entorno.nombre + '_DOWHILE');
        let condicion = this.condicion.ejecutar(entornoLocal);
        if (condicion.tipo != Tipo.BOOLEANO) {
            // Tipo no válido para la condición del bucle
            return;
        }
        do {
            let bloque = this.bloque.ejecutar(entornoLocal);
            if (bloque) {
                if (bloque.valor == TipoInstruccion.CONTINUAR) {
                    continue; // Continuar con la siguiente iteración
                }
                return bloque;
            }
            condicion = this.condicion.ejecutar(entornoLocal);
        } while (condicion.valor);
        return;
    }
}