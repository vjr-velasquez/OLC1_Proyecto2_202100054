import { Expresion } from "../Abstractas/Expresion";
import { Instruccion } from "../Abstractas/Instruccion";
import { Entorno } from "../Entorno/Entorno";
import { Tipo } from "../Utilidades/Tipo";
import { TipoInstruccion } from "../Utilidades/TipoInstruccion";
import { Bloque } from "./Bloque";

export class Mientras extends Instruccion {
    private bloque: Bloque;
    constructor(linea: number, columna: number, private condicion: Expresion, instrucciones: Instruccion[]) {
        super(linea, columna, TipoInstruccion.MIENTRAS);
        this.bloque = new Bloque(linea, columna, instrucciones);
    }
    public ejecutar(entorno: Entorno) {
        const entornoLocal = new Entorno(entorno, entorno.nombre + '_WHILE');
        let condicion = this.condicion.ejecutar(entornoLocal);
        if (condicion.tipo != Tipo.BOOLEANO) {
            // Tipo no válido para la condición del bucle
            return;
        }
        while (condicion.valor) {
            let bloque = this.bloque.ejecutar(entornoLocal);
            if (bloque) {
                if (bloque.valor == TipoInstruccion.CONTINUAR) {
                    continue; // Continuar con la siguiente iteración
                }
                return bloque;
            }
            condicion = this.condicion.ejecutar(entornoLocal);
        }
        return;
        // Si la condición es falsa, salir del bucle
    }
}