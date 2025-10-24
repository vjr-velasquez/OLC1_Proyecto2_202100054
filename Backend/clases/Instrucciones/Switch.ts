import { Instruccion } from "../Abstractas/Instruccion";
import { Expresion } from "../Abstractas/Expresion";
import { Entorno } from "../Entorno/Entorno";
import { TipoInstruccion } from "../Utilidades/TipoInstruccion";
import { Case } from "./Case";
import { Console } from "console";

export class Switch extends Instruccion {
    constructor(linea: number, columna: number, public condicion: Expresion, public cases: Instruccion[], public defaultCase: Instruccion[]) {
        super(linea, columna, TipoInstruccion.SWITCH);
    }

    public ejecutar(entorno: Entorno) {
        const entornoLocal = new Entorno(entorno, 'Switch');
        let encontrado = false;

        for (let i = 0; i < this.cases.length; i++) {
            let caso = this.cases[i];
            if (caso instanceof Case) {
                let valorCaso = caso.condicion.ejecutar(entorno);
                if (valorCaso.valor) {
                    encontrado = true;
                    for (let instruccion of caso.instrucciones) {
                        let resultado = instruccion.ejecutar(entornoLocal);
                        if (resultado) {
                            return resultado;
                        }
                    }
                }
            }
        }

        if (!encontrado && this.defaultCase.length > 0) {
            for (let instruccion of this.defaultCase) {
                let resultado = instruccion.ejecutar(entornoLocal);
                if (resultado) {
                    return resultado;
                }
            }
        }
    }
}