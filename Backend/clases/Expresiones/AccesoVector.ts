// Backend/Clases/Expresiones/AccesoVector.ts
import { Entorno } from "../Entorno/Entorno";
import { Error as Err } from "../Utilidades/Error";
import { TipoError } from "../Utilidades/TipoError";
import { errores } from "../Utilidades/Salida";
import { Tipo } from "../Utilidades/Tipo";

// === Función auxiliar para obtener símbolo desde el entorno ===
function obtenerSimbolo(ent: any, id: string): any {
  return ent?.getVariable?.(id)
      ?? ent?.getSimbolo?.(id)
      ?? ent?.get?.(id)
      ?? ent?.getVariableSimbolo?.(id)
      ?? ent?.obtener?.(id)
      ?? ent?.buscar?.(id)
      ?? null;
}

// === Deducción de tipo base ===
function inferirTipoBase(val: any): Tipo {
  if (typeof val === "number" && Number.isInteger(val)) return Tipo.ENTERO;
  if (typeof val === "number") return Tipo.DECIMAL;
  if (typeof val === "string" && val.length === 1) return Tipo.CARACTER;
  if (typeof val === "string") return Tipo.CADENA;
  if (typeof val === "boolean") return Tipo.BOOLEANO;
  return Tipo.CADENA;
}

export class AccesoVector {
  constructor(
    private linea: number,
    private columna: number,
    private id: string,
    private indices: any[]
  ) {}

  public getId() { return this.id; }
  public getIndices() { return this.indices; }

  public ejecutar(ent: Entorno) {
    // 1) símbolo
    const sim: any = obtenerSimbolo(ent as any, this.id);
    if (!sim) {
      errores.push(new Err(this.linea, this.columna, TipoError.SEMANTICO,
        `No existe el vector «${this.id}».`));
      return null;
    }

    // 2) valor real (posible wrapper)
    const wrapper = sim.valor ?? sim.value ?? sim;
    const vector: any = (wrapper && typeof wrapper === "object" && "valor" in wrapper)
      ? (wrapper as any).valor
      : wrapper;

    if (!Array.isArray(vector)) {
      errores.push(new Err(this.linea, this.columna, TipoError.SEMANTICO,
        `«${this.id}» no es un vector.`));
      return null;
    }

    // 3) índices
    if (!Array.isArray(this.indices) || this.indices.length < 1 || this.indices.length > 2) {
      errores.push(new Err(this.linea, this.columna, TipoError.SEMANTICO,
        `Cantidad de índices inválida para «${this.id}».`));
      return null;
    }

    const idx = this.indices.map(e => {
      const r = e?.ejecutar?.(ent);
      return Number(r?.valor ?? r);
    });

    // -------- 1D --------
    if (idx.length === 1) {
      const i = Math.trunc(idx[0]);
      if (Number.isNaN(i)) {
        errores.push(new Err(this.linea, this.columna, TipoError.SEMANTICO,
          `El índice [0] de «${this.id}» debe ser entero.`));
        return null;
      }
      if (i < 0 || i >= vector.length) {
        errores.push(new Err(this.linea, this.columna, TipoError.SEMANTICO,
          `Índice fuera de rango en «${this.id}» [${i}], tamaño=${vector.length}.`));
        return null;
      }
      const val1 = vector[i];
      return { valor: val1, tipo: (sim.base ?? inferirTipoBase(val1)) };
    }

    // -------- 2D --------
    const i = Math.trunc(idx[0]);
    const j = Math.trunc(idx[1]);
    if (Number.isNaN(i) || Number.isNaN(j)) {
      errores.push(new Err(this.linea, this.columna, TipoError.SEMANTICO,
        `Los índices de «${this.id}» deben ser enteros.`));
      return null;
    }
    if (i < 0 || i >= vector.length) {
      errores.push(new Err(this.linea, this.columna, TipoError.SEMANTICO,
        `Índice fuera de rango en «${this.id}» [${i}], filas=${vector.length}.`));
      return null;
    }

    const row = vector[i];
    const isRowArray  = Array.isArray(row);
    const isRowString = typeof row === "string";

    if (!isRowArray && !isRowString) {
      errores.push(new Err(this.linea, this.columna, TipoError.SEMANTICO,
        `La fila ${i} de «${this.id}» no es una lista ni una cadena.`));
      return null;
    }

    const cols = row.length; // string.length y array.length funcionan igual
    if (j < 0 || j >= cols) {
      errores.push(new Err(this.linea, this.columna, TipoError.SEMANTICO,
        `Índice fuera de rango en «${this.id}» [${i}][${j}], columnas=${cols}.`));
      return null;
    }

    // Acceso uniforme (string y array son indexables)
    const val2 = row[j];
    return { valor: val2, tipo: (sim.base ?? inferirTipoBase(val2)) };
  }
}
