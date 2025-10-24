import { Instruccion } from "../Abstractas/Instruccion";
import { Entorno } from "../Entorno/Entorno";
import { TipoInstruccion } from "../Utilidades/TipoInstruccion";
import { Tipo } from "../Utilidades/Tipo";
import { VecInit } from "../Utilidades/VectorInit";

function defaultValueFor(t: Tipo): any {
  switch (t) {
    case Tipo.ENTERO:   return 0;
    case Tipo.DECIMAL:  return 0.0;
    case Tipo.BOOLEANO: return false;
    case Tipo.CARACTER: return "\u0000";
    case Tipo.CADENA:   return "";
    default:            return null;
  }
}

export class DeclaracionVector extends Instruccion {
  constructor(
    linea: number,
    columna: number,
    private id: string,
    private base: Tipo,        // tipo base de los elementos (caracter, entero, etc.)
    private dims: 1 | 2,       // [] o [][]
    private init: VecInit      // size o list
  ) {
    super(linea, columna, TipoInstruccion.DECLARAR_VECTOR);
  }

  public ejecutar(ent: Entorno) {
    // Construye el valor (JS array) y metadatos
    let valor: any;
    let filas = 0, columnas = 0;

    if (this.init.kind === "size") {
      // === Declaración por tamaño ===
      const sizes = this.init.sizes ?? [];
      if (this.dims === 1) {
        const m = Number(sizes[0]?.ejecutar?.(ent)?.valor ?? sizes[0]);
        filas = Math.max(0, m | 0);
        valor = Array.from({ length: filas }, () => defaultValueFor(this.base));
        columnas = 0;
      } else {
        const m = Number(sizes[0]?.ejecutar?.(ent)?.valor ?? sizes[0]);
        const n = Number(sizes[1]?.ejecutar?.(ent)?.valor ?? sizes[1]);
        filas = Math.max(0, m | 0);
        columnas = Math.max(0, n | 0);
        const def = defaultValueFor(this.base);
        valor = Array.from({ length: filas }, () =>
          Array.from({ length: columnas }, () => def)
        );
      }
    } else {
      // === Declaración por lista (viene del parser) ===
      // rows puede ser 1D (una sola fila) o 2D (múltiples filas)
      const rows = this.init.rows as any[];
      if (this.dims === 1) {
        // Esperamos una lista plana
        valor = rows[0] ?? []; // el parser guardó como { rows:[ lista ] }
        filas = Array.isArray(valor) ? valor.length : 0;
        columnas = 0;
      } else {
        // 2D: una matriz de filas
        valor = rows; // el parser ya construyó [[...],[...],...]
        filas = Array.isArray(valor) ? valor.length : 0;
        columnas = filas > 0 && Array.isArray(valor[0]) ? valor[0].length : 0;
      }
    }

    // Guarda en el entorno
    (ent as any).guardarVariable?.(
      this.id,
      valor,
      (Tipo as any).VECTOR ?? this.base,
      this.linea,
      this.columna
    );

    // Anota metadatos en el símbolo
    const sim: any = (ent as any).getVariable?.(this.id);
    if (sim) {
      sim.isvector = true;
      sim.dims = this.dims;
      sim.filas = filas;
      sim.columnas = columnas;
      // tipo base para AccesoVector
      sim.base = this.base;
    }

    return null;
  }
}
