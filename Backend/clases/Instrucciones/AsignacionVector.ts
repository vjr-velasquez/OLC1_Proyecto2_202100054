// Backend/Clases/Instrucciones/AsignacionVector.ts
import { Instruccion } from "../Abstractas/Instruccion";
import { Entorno } from "../Entorno/Entorno";
import { AccesoVector } from "../Expresiones/AccesoVector";
import { TipoInstruccion } from "../Utilidades/TipoInstruccion";
import { Error as Err } from "../Utilidades/Error";
import { TipoError } from "../Utilidades/TipoError";
import { errores } from "../Utilidades/Salida";

function obtenerSimbolo(ent: any, id: string): any {
  return ent?.getVariable?.(id)
      ?? ent?.getSimbolo?.(id)
      ?? ent?.get?.(id)
      ?? ent?.getVariableSimbolo?.(id)
      ?? ent?.obtener?.(id)
      ?? ent?.buscar?.(id)
      ?? null;
}

export class AsignacionVector extends Instruccion {
  constructor(
    linea: number,
    columna: number,
    private acceso: AccesoVector,
    private expr: any, // Expresion
  ) {
    super(linea, columna, TipoInstruccion.ASIGNACION);
  }

  public ejecutar(ent: Entorno) {
    // 1) Resolver el símbolo del vector
    const id = this.acceso.getId();
    const sim = obtenerSimbolo(ent as any, id);

    if (!sim) {
      errores.push(new Err(this.linea, this.columna, TipoError.SEMANTICO,
        `No existe el vector «${id}».`));
      return null;
    }

    // El valor real puede venir envuelto { valor, dim, filas, columnas }
    const wrapper = (sim as any).valor ?? (sim as any).value ?? sim;
    const vector  = (wrapper as any).valor ?? wrapper;

    // 2) Evaluar la expresión a asignar
    const rVal = this.expr?.ejecutar?.(ent);
    const val  = rVal?.valor ?? rVal;

    // 3) Evaluar índices
    const idxExprs = this.acceso.getIndices();
    if (!Array.isArray(idxExprs) || idxExprs.length < 1 || idxExprs.length > 2) {
      errores.push(new Err(this.linea, this.columna, TipoError.SEMANTICO,
        `Cantidad de índices inválida para «${id}».`));
      return null;
    }

    const idxVals = idxExprs.map(e => {
      const r = e?.ejecutar?.(ent);
      return Number(r?.valor ?? r);
    });

    // Validaciones básicas
    if (!Array.isArray(vector)) {
      errores.push(new Err(this.linea, this.columna, TipoError.SEMANTICO,
        `«${id}» no es un vector.`));
      return null;
    }

    // 1D
    if (idxVals.length === 1) {
      const i = Math.trunc(idxVals[0]);
      if (Number.isNaN(i)) {
        errores.push(new Err(this.linea, this.columna, TipoError.SEMANTICO,
          `El índice [0] de «${id}» debe ser entero.`));
        return null;
      }
      if (i < 0 || i >= vector.length) {
        errores.push(new Err(this.linea, this.columna, TipoError.SEMANTICO,
          `Índice fuera de rango en «${id}» [${i}], tamaño=${vector.length}.`));
        return null;
      }
      vector[i] = val;

    // 2D
    } else {
      const i = Math.trunc(idxVals[0]);
      const j = Math.trunc(idxVals[1]);

      if (Number.isNaN(i) || Number.isNaN(j)) {
        errores.push(new Err(this.linea, this.columna, TipoError.SEMANTICO,
          `Los índices de «${id}» deben ser enteros.`));
        return null;
      }
      if (i < 0 || i >= vector.length) {
        errores.push(new Err(this.linea, this.columna, TipoError.SEMANTICO,
          `Índice fuera de rango en «${id}» [${i}], filas=${vector.length}.`));
        return null;
      }
      const row = vector[i];
      if (!Array.isArray(row)) {
        errores.push(new Err(this.linea, this.columna, TipoError.SEMANTICO,
          `La fila ${i} de «${id}» no es una lista.`));
        return null;
      }
      const cols = row.length;
      if (j < 0 || j >= cols) {
        errores.push(new Err(this.linea, this.columna, TipoError.SEMANTICO,
          `Índice fuera de rango en «${id}» [${i}][${j}], columnas=${cols}.`));
        return null;
      }
      row[j] = val;
    }

    // Si tu símbolo espera que se escriba en sim.valor, ya lo hicimos porque
    // `vector` es precisamente sim.valor o wrapper.valor.
    return null;
  }
  
}
