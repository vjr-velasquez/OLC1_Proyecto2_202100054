// Backend/Clases/Instrucciones/Asignacion.ts
import { Expresion } from "../Abstractas/Expresion";
import { Instruccion } from "../Abstractas/Instruccion";
import { Entorno } from "../Entorno/Entorno";
import { TipoInstruccion } from "../Utilidades/TipoInstruccion";
import { Tipo } from "../Utilidades/Tipo";

export class Asignacion extends Instruccion {
  constructor(
    linea: number,
    columna: number,
    private id: string,
    private valor: Expresion
  ) {
    super(linea, columna, TipoInstruccion.ASIGNACION);
  }

  public ejecutar(entorno: Entorno) {
    // Ejecuta RHS (puede ser escalar, VectorLiteral o arreglo JS)
    const r: any = this.valor?.ejecutar?.(entorno);
    const val = r?.valor ?? r;

    // Obtiene el símbolo existente si está declarado
    const sim: any =
      (entorno as any).getVariable?.(this.id) ??
      (entorno as any).getSimbolo?.(this.id) ??
      null;

    // ===== 1) Literal de vector (nuestro VectorLiteral: {valor, dim|dims, filas, columnas, subtipo}) =====
    if (r && typeof r === "object" && Array.isArray(r.valor)) {
      const vector = r.valor;

      if (sim) {
        sim.valor = vector;
        sim.isvector = true;

        const dims =
          (typeof r.dim === "number" ? r.dim : r.dims) ??
          (Array.isArray(vector[0]) ? 2 : 1);
        sim.dims = dims;

        sim.filas =
          typeof r.filas === "number" ? r.filas : vector.length;

        sim.columnas =
          typeof r.columnas === "number"
            ? r.columnas
            : Array.isArray(vector[0]) ? (vector[0]?.length ?? 0) : 0;

        // asegura tipo base y tipo contenedor si tu enum tiene VECTOR
        if (sim.base == null && r.subtipo != null) sim.base = r.subtipo;
        if (sim.tipo == null) sim.tipo = (Tipo as any).VECTOR ?? sim.base;
      } else {
        // si no existía, crea variable con el arreglo crudo
        (entorno as any).setVariable?.(this.id, vector);
      }
      return null;
    }

    // ===== 2) Arreglo JS “puro” (no vino de VectorLiteral) =====
    if (Array.isArray(val)) {
      const dims = Array.isArray(val[0]) ? 2 : 1;

      if (sim) {
        sim.valor = val;
        sim.isvector = true;
        sim.dims = dims;
        sim.filas = val.length;
        sim.columnas = dims === 2 ? (val[0]?.length ?? 0) : 0;
        // base/tipo si quieres inferirlos aquí podrías hacerlo, no es obligatorio
      } else {
        (entorno as any).setVariable?.(this.id, val);
      }
      return null;
    }

    // ===== 3) Escalar normal (número, string, boolean, char-code, etc.) =====
    if (sim) {
      sim.valor = val;
      // Si el símbolo antes fue vector y quieres “limpiar” flags, puedes descomentar:
      // sim.isvector = false; sim.dims = 0; sim.filas = 0; sim.columnas = 0;
      // sim.base = undefined;
    } else {
      (entorno as any).setVariable?.(this.id, val);
    }

    return null;
  }
}
