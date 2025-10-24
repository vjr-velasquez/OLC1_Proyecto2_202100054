// Backend/Clases/Expresiones/VectorLiteral.ts
import { Entorno } from "../Entorno/Entorno";
import { Tipo } from "../Utilidades/Tipo";
import { Error as Err } from "../Utilidades/Error";
import { TipoError } from "../Utilidades/TipoError";
import { errores } from "../Utilidades/Salida";

/**
 * La gramática crea: new VectorLiteral(linea, columna, dim, rows)
 *  - dim: 1 | 2
 *  - rows:
 *      dim=1  ->  Expresion[]
 *      dim=2  ->  Expresion[][]
 *
 * ejecutar(entorno) devuelve un objeto con:
 *  {
 *    valor: any[] | any[][],   // arreglo JS
 *    tipo: Tipo,               // Tipo.VECTOR si existe, o subtipo si no existe
 *    dim: 1|2,
 *    filas: number,
 *    columnas: number,         // 0 en 1D
 *    subtipo: Tipo             // tipo base de los elementos
 *  }
 */
export class VectorLiteral {
  constructor(
    public linea: number,
    public columna: number,
    public dim: 1 | 2,
    public rows: any   // Expresion[] | Expresion[][]
  ) {}

  private inferirTipoBase(val: any): Tipo {
    if (typeof val === "number" && Number.isInteger(val)) return Tipo.ENTERO;
    if (typeof val === "number") return Tipo.DECIMAL;
    if (typeof val === "string" && val.length === 1) return Tipo.CARACTER;
    if (typeof val === "string") return Tipo.CADENA;
    if (typeof val === "boolean") return Tipo.BOOLEANO;
    // Si tu enum Tipo tiene VECTOR y permites anidar, podrías tratar arrays aquí.
    return Tipo.CADENA; // fallback conservador
  }

  private tiposCompatibles(t1: Tipo, t2: Tipo): boolean {
    return t1 === t2;
  }

  ejecutar(entorno: Entorno) {
    try {
      const tipoColeccion: Tipo | null = (Tipo as any).VECTOR ?? null;

      if (this.dim === 1) {
        // rows: Expresion[]
        const valores = (this.rows as any[]).map((exp) => {
          const r = exp?.ejecutar?.(entorno);
          return r?.valor ?? r;
        });

        // Manejo de vector vacío
        const filas = valores.length;
        const tipoBase = filas > 0 ? this.inferirTipoBase(valores[0]) : Tipo.CADENA;

        // Homogeneidad
        for (let i = 1; i < filas; i++) {
          const t = this.inferirTipoBase(valores[i]);
          if (!this.tiposCompatibles(tipoBase, t)) {
            errores.push(
              new Err(
                this.linea,
                this.columna,
                TipoError.SEMANTICO,
                `Los elementos del vector 1D no son homogéneos: ${Tipo[tipoBase]} vs ${Tipo[t]}`
              )
            );
            break;
          }
        }

        return {
          valor: valores,                       // JS array 1D
          tipo: tipoColeccion ?? tipoBase,      // usa Tipo.VECTOR si existe
          dim: 1 as const,
          filas,
          columnas: 0,
          subtipo: tipoBase,
        };
      }

      // ===== dim === 2 =====
      const matriz = (this.rows as any[][]).map((fila) =>
        fila.map((exp) => {
          const r = exp?.ejecutar?.(entorno);
          return r?.valor ?? r;
        })
      );

      const filas = matriz.length;
      const columnas = filas > 0 ? (matriz[0]?.length ?? 0) : 0;

      // Rectangularidad
      for (let i = 1; i < filas; i++) {
        if (matriz[i].length !== columnas) {
          errores.push(
            new Err(
              this.linea,
              this.columna,
              TipoError.SEMANTICO,
              `Vector 2D irregular: fila 0 tiene ${columnas} columnas y la fila ${i} tiene ${matriz[i].length}.`
            )
          );
          break;
        }
      }

      // Tipo base (si hay al menos 1 elemento)
      const tipoBase =
        filas > 0 && columnas > 0
          ? this.inferirTipoBase(matriz[0][0])
          : Tipo.CADENA;

      // Homogeneidad 2D
      outer: for (let i = 0; i < filas; i++) {
        for (let j = 0; j < (matriz[i]?.length ?? 0); j++) {
          const t = this.inferirTipoBase(matriz[i][j]);
          if (!this.tiposCompatibles(tipoBase, t)) {
            errores.push(
              new Err(
                this.linea,
                this.columna,
                TipoError.SEMANTICO,
                `Los elementos del vector 2D no son homogéneos: ${Tipo[tipoBase]} vs ${Tipo[t]}`
              )
            );
            break outer;
          }
        }
      }

      return {
        valor: matriz,                          // JS array 2D
        tipo: tipoColeccion ?? tipoBase,        // usa Tipo.VECTOR si existe
        dim: 2 as const,
        filas,
        columnas,
        subtipo: tipoBase,
      };
    } catch (e: any) {
      errores.push(
        new Err(
          this.linea,
          this.columna,
          TipoError.SEMANTICO,
          `Error al evaluar literal de vector: ${e?.message ?? e}`
        )
      );
      // Valor por defecto seguro
      if (this.dim === 1) {
        return {
          valor: [],
          tipo: (Tipo as any).VECTOR ?? Tipo.CADENA,
          dim: 1 as const,
          filas: 0,
          columnas: 0,
          subtipo: Tipo.CADENA,
        };
      } else {
        return {
          valor: [],
          tipo: (Tipo as any).VECTOR ?? Tipo.CADENA,
          dim: 2 as const,
          filas: 0,
          columnas: 0,
          subtipo: Tipo.CADENA,
        };
      }
    }
  }
}
