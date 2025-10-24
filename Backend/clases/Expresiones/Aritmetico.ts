import { Expresion } from "../Abstractas/Expresion";
import { Entorno } from "../Entorno/Entorno";
import { Tipo, TipoRetorno } from "../Utilidades/Tipo";
import { TipoExpresion } from "../Utilidades/TipoExpresion";
import { suma, resta, multiplicacion, division, potencia, modulo } from "../Utilidades/OperacionDominante";

export class Aritmetico extends Expresion {
  private tipo: Tipo = Tipo.NULL;

  constructor(
    linea: number,
    columna: number,
    public exp1: Expresion | undefined,   // puede ser undefined para -unario
    public signo: string,
    public exp2: Expresion
  ) {
    super(linea, columna, TipoExpresion.ARMITEMETICO);
  }

  public ejecutar(entorno: Entorno): TipoRetorno {
    switch (this.signo) {
      case '+': return this.suma(entorno);
      case '-': return (this.exp1 !== undefined) ? this.resta(entorno) : this.negacionUnaria(entorno);
      case '*': return this.multiplicacion(entorno);
      case '/': return this.division(entorno);
      case '^': return this.potencia(entorno);
      case '%': return this.modulo(entorno);
      default:  throw new Error(`Operador aritmético no reconocido: ${this.signo}`);
    }
  }

  // -------------------- helpers seguros --------------------
  /** Evalúa izquierda y derecha de forma segura. */
  private evalLR(entorno: Entorno): { l: TipoRetorno | null; r: TipoRetorno | null } {
    const l = this.exp1 ? this.exp1.ejecutar(entorno) : null;
    const r = this.exp2 ? this.exp2.ejecutar(entorno) : null;
    return { l, r };
  }
  /** Convierte código de char a string, deja lo demás igual. */
  private asText(v: any, t: Tipo): string { return (t === Tipo.CARACTER) ? String.fromCharCode(v) : String(v); }

  // ========================== SUMA ==========================
  private suma(entorno: Entorno): TipoRetorno {
    const { l, r } = this.evalLR(entorno);

    // si alguno falló, concateno lo que haya (como string)
    if (!l || !r) {
      const lv = l?.valor ?? "";
      const rv = r?.valor ?? "";
      return { valor: String(lv) + String(rv), tipo: Tipo.CADENA };
    }

    // si alguno es cadena o caracter → concatenación
    if (l.tipo === Tipo.CADENA || r.tipo === Tipo.CADENA || l.tipo === Tipo.CARACTER || r.tipo === Tipo.CARACTER) {
      return { valor: this.asText(l.valor, l.tipo) + this.asText(r.valor, r.tipo), tipo: Tipo.CADENA };
    }

    // numérica
    this.tipo = suma[l.tipo][r.tipo];
    if (this.tipo !== Tipo.NULL && (this.tipo === Tipo.ENTERO || this.tipo === Tipo.DECIMAL)) {
      return { valor: l.valor + r.valor, tipo: this.tipo };
    }
    return { valor: 'NULL', tipo: Tipo.NULL };
  }

  // ========================== RESTA ==========================
  private resta(entorno: Entorno): TipoRetorno {
    const { l, r } = this.evalLR(entorno);
    if (!l || !r) return { valor: 'NULL', tipo: Tipo.NULL };

    this.tipo = resta[l.tipo][r.tipo];
    if (this.tipo !== Tipo.NULL && (this.tipo === Tipo.ENTERO || this.tipo === Tipo.DECIMAL)) {
      return { valor: l.valor - r.valor, tipo: this.tipo };
    }
    return { valor: 'NULL', tipo: Tipo.NULL };
  }

  // ========================== NEGACIÓN UNARIA ==========================
  private negacionUnaria(entorno: Entorno): TipoRetorno {
    const v = this.exp2.ejecutar(entorno);
    this.tipo = v.tipo;
    if (this.tipo === Tipo.ENTERO || this.tipo === Tipo.DECIMAL) {
      return { valor: -v.valor, tipo: this.tipo };
    }
    return { valor: 'NULL', tipo: Tipo.NULL };
  }

  // ========================== MULTIPLICACIÓN ==========================
  private multiplicacion(entorno: Entorno): TipoRetorno {
    const { l, r } = this.evalLR(entorno);
    if (!l || !r) return { valor: 'NULL', tipo: Tipo.NULL };

    this.tipo = multiplicacion[l.tipo][r.tipo];
    if (this.tipo !== Tipo.NULL && (this.tipo === Tipo.ENTERO || this.tipo === Tipo.DECIMAL)) {
      return { valor: l.valor * r.valor, tipo: this.tipo };
    }
    return { valor: 'NULL', tipo: Tipo.NULL };
  }

  // ========================== DIVISIÓN ==========================
  private division(entorno: Entorno): TipoRetorno {
    const { l, r } = this.evalLR(entorno);
    if (!l || !r) return { valor: 'NULL', tipo: Tipo.NULL };

    this.tipo = division[l.tipo][r.tipo];
    if (this.tipo !== Tipo.NULL && (this.tipo === Tipo.ENTERO || this.tipo === Tipo.DECIMAL) && r.valor !== 0) {
      return { valor: l.valor / r.valor, tipo: this.tipo };
    }
    return { valor: 'NULL', tipo: Tipo.NULL };
  }

  // ========================== POTENCIA ==========================
  private potencia(entorno: Entorno): TipoRetorno {
    const { l, r } = this.evalLR(entorno);
    if (!l || !r) return { valor: 'NULL', tipo: Tipo.NULL };

    this.tipo = potencia[l.tipo][r.tipo];
    if (this.tipo !== Tipo.NULL && (this.tipo === Tipo.ENTERO || this.tipo === Tipo.DECIMAL)) {
      return { valor: Math.pow(l.valor, r.valor), tipo: this.tipo };
    }
    return { valor: 'NULL', tipo: Tipo.NULL };
  }

  // ========================== MÓDULO ==========================
  private modulo(entorno: Entorno): TipoRetorno {
    const { l, r } = this.evalLR(entorno);
    if (!l || !r) return { valor: 'NULL', tipo: Tipo.NULL };

    this.tipo = modulo[l.tipo][r.tipo];
    if (this.tipo !== Tipo.NULL && (this.tipo === Tipo.ENTERO || this.tipo === Tipo.DECIMAL)) {
      return { valor: l.valor % r.valor, tipo: this.tipo };
    }
    return { valor: 'NULL', tipo: Tipo.NULL };
  }
}
