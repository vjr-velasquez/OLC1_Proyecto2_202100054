// Backend/Clases/Expresiones/Primitivo.ts
import { Expresion } from "../Abstractas/Expresion";
import { Entorno } from "../Entorno/Entorno";
import { Tipo, TipoRetorno } from "../Utilidades/Tipo";
import { TipoExpresion } from "../Utilidades/TipoExpresion";

export class Primitivo extends Expresion {
  constructor(
    linea: number,
    columna: number,
    public valor: any,
    public tipo: Tipo
  ) {
    super(linea, columna, TipoExpresion.PRIMITIVO);
  }

  public ejecutar(_: Entorno): TipoRetorno {
    switch (this.tipo) {
      case Tipo.ENTERO:
        return { valor: parseInt(this.valor), tipo: this.tipo };

      case Tipo.DECIMAL:
        return { valor: parseFloat(this.valor), tipo: this.tipo };

      case Tipo.BOOLEANO:
        return { valor: this.valor.toString() === "verdadero", tipo: this.tipo };

      case Tipo.CARACTER: {
        // ✅ devolver el CARÁCTER, no el charCode
        const s = this.valor?.toString() ?? "";
        // Asegura longitud 1 (si viniera algo como "abc", toma el primero)
        const ch = s.length > 0 ? s[0] : "\u0000";
        return { valor: ch, tipo: this.tipo };
      }

      default:
        // CADENA u otros
        return { valor: this.valor, tipo: this.tipo };
    }
  }
}
