import { Expresion } from "../Abstractas/Expresion";
import { Instruccion } from "../Abstractas/Instruccion";
import { Entorno } from "../Entorno/Entorno";
import { Tipo, TipoRetorno } from "../Utilidades/Tipo";
import { TipoInstruccion } from "../Utilidades/TipoInstruccion";
import { Bloque } from "./Bloque";

// 👉 NUEVO: importo para poder declarar la variable del for si no existe
import { DeclaracionID } from "../Instrucciones/DeclaracionID";
import { Primitivo } from "../Expresiones/Primitivo";

export class Para extends Instruccion{
    private bloque: Bloque;

    constructor(
        linea: number,
        columna: number,
        private inicio: string,                      // nombre del iterador (id)
        private limiteInferior: Expresion,           // expr inicial
        private limiteSuperior: Expresion,           // expr final
        private paso: string,                        // 'incremento' | 'decremento'
        private instrucciones: Instruccion[]
    ) {
        super(linea, columna, TipoInstruccion.PARA);
        this.bloque = new Bloque(linea, columna, instrucciones);
    }

    public ejecutar(entorno: Entorno) {
        // El for tiene su propio entorno (scope del iterador)
        const entornoLocal = new Entorno(entorno, entorno.nombre + '_FOR');

        // Evaluamos límites
        const limInf = this.limiteInferior.ejecutar(entornoLocal);
        if (limInf.tipo !== Tipo.ENTERO) return;

        const limSup = this.limiteSuperior.ejecutar(entornoLocal);
        if (limSup.tipo !== Tipo.ENTERO) return;

        // Asegurar que la variable de iteración exista en el entorno del for.
        // Si no existe, la declaramos como entero (caso: "para (entero i = 0; ...)" o incluso "para (i = 0; ...)" sin declaración previa).
        if (!entornoLocal.getVariable(this.inicio)) {
            const decl = new DeclaracionID(
                this.linea,
                this.columna,
                this.inicio,
                Tipo.ENTERO,
                new Primitivo(this.linea, this.columna, limInf.valor, Tipo.ENTERO)
            );
            decl.ejecutar(entornoLocal);
        } else {
            // Si ya existe en este scope, seteamos el valor inicial
            entornoLocal.setVariable(this.inicio, limInf.valor);
        }

        // Ejecutamos el for en el entorno local y actualizamos el iterador en ese mismo entorno
        if (this.paso === 'incremento') {
            for (let i = limInf.valor; i <= limSup.valor; i++) {
                entornoLocal.setVariable(this.inicio, i);

                const resultado = this.bloque.ejecutar(entornoLocal);
                if (resultado) {
                    if (resultado.valor === TipoInstruccion.CONTINUAR) {
                        continue;
                    }
                    return resultado;
                }
            }
            return;
        } else if (this.paso === 'decremento') {
            for (let i = limInf.valor; i >= limSup.valor; i--) {
                entornoLocal.setVariable(this.inicio, i);

                const resultado = this.bloque.ejecutar(entornoLocal);
                if (resultado) {
                    if (resultado.valor === TipoInstruccion.CONTINUAR) {
                        continue;
                    }
                    return resultado;
                }
            }
            return;
        }
    }
}
