import { Expresion } from "../Abstractas/Expresion";
import { Instruccion } from "../Abstractas/Instruccion";
import { Entorno } from "../Entorno/Entorno";
import { TipoRetorno } from "../Utilidades/Tipo";
import { TipoInstruccion } from "../Utilidades/TipoInstruccion";
import { Bloque } from "./Bloque";

export class Si extends Instruccion {
    private bloqueIf: Bloque;
    private bloqueElseIf: Bloque | null;
    private bloqueElse: Bloque | null;
    
    constructor(
        linea: number, 
        columna: number, 
        private condicion: Expresion, 
        private instruccionesIf: Instruccion[], 
        private condicionElseIf: Expresion | null, 
        private instruccionesElseIf: Instruccion[] | null, 
        private instruccionesElse: Instruccion[] | null
    ) {
        super(linea, columna, TipoInstruccion.SI);
        this.bloqueIf = new Bloque(linea, columna, instruccionesIf);
        this.bloqueElseIf = condicionElseIf ? new Bloque(linea, columna, instruccionesElseIf || []) : null;
        this.bloqueElse = instruccionesElse ? new Bloque(linea, columna, instruccionesElse) : null;
    }

    public ejecutar(entorno: Entorno) {
        const entornoLocal = new Entorno(entorno, entorno.nombre + '_IF');
        let condicion = this.condicion.ejecutar(entorno);
        
        if (condicion.valor) {
            let resultado = this.bloqueIf.ejecutar(entornoLocal);
            if (resultado) return resultado;
            return;
        }
        
        // Else if
        if (this.bloqueElseIf && this.condicionElseIf) {
            let condicionElseIf = this.condicionElseIf.ejecutar(entorno);
            if (condicionElseIf.valor) {
                let resultado = this.bloqueElseIf.ejecutar(entornoLocal);
                if (resultado) return resultado;
                return;
            }
        }
        
        // Else
        if (this.bloqueElse) {
            let resultado = this.bloqueElse.ejecutar(entornoLocal);
            if (resultado) return resultado;
        }
        
        return;
    }
}