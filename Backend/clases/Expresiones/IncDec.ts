import { Instruccion } from "../Abstractas/Instruccion";
import { Entorno } from "../Entorno/Entorno";
import { TipoInstruccion } from "../Utilidades/TipoInstruccion";

export class IncDec extends Instruccion{
    constructor(linea: number, columna: number, private id: string, private operacion: string, private tipo: string) {
        super(linea, columna, TipoInstruccion.INCREMENTO);
    }

    public ejecutar(entorno: Entorno) {
        let valor = entorno.getVariable(this.id);
        if (valor !== undefined) {
            let v : number;
            switch (this.operacion) {
                case 'inc':
                    if (this.tipo === 'exp'){
                        v = valor?.valor + 1;
                        entorno.setVariable(this.id, v);
                        return {valor: v, tipo: valor?.tipo};
                    }else if (this.tipo === 'ins'){
                        v = valor?.valor + 1;
                        entorno.setVariable(this.id, v);
                        return
                    }
                case 'dec':
                    if (this.tipo === 'exp'){
                        v = valor?.valor - 1;
                        entorno.setVariable(this.id, v);
                        return {valor: v, tipo: valor?.tipo};
                    }else if (this.tipo === 'ins'){
                        v = valor?.valor - 1;
                        entorno.setVariable(this.id, v);
                        return
                    }
                default:
                    // Error: Operacion no soportadas
            }
        }
    }
}