// Imprimir.ts
import { Expresion } from "../Abstractas/Expresion";
import { Instruccion } from "../Abstractas/Instruccion";
import { Entorno } from "../Entorno/Entorno";
import { TipoInstruccion } from "../Utilidades/TipoInstruccion";

export class Imprimir extends Instruccion{
    constructor(linea: number, columna: number, private expresion: Expresion, private nl: string){
        super(linea, columna, TipoInstruccion.IMPRIMIR);
    }

    private toStringSafe(v: any): string {
        if (v === null || v === undefined) return "";
        if (typeof v === "string") return v;
        if (typeof v === "number" || typeof v === "boolean") return String(v);
        try { return JSON.stringify(v); } catch { return String(v); }
    }

    public ejecutar(entorno: Entorno) {
        const ret = this.expresion ? this.expresion.ejecutar(entorno) : null;
        const texto = this.toStringSafe(ret ? ret.valor : "");
        entorno.setPrint(texto);
        if (this.nl) entorno.setPrint("\n");
    }
}
