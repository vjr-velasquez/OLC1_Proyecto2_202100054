import { Expresion } from "../Abstractas/Expresion";
import { Entorno } from "../Entorno/Entorno";
import { Tipo, TipoRetorno } from "../Utilidades/Tipo";
import { TipoExpresion } from "../Utilidades/TipoExpresion";

export class Ternario extends Expresion {
  constructor(
    linea: number,
    columna: number,
    private condicion: Expresion,
    private exprTrue: Expresion,
    private exprFalse: Expresion,
  ) {
    super(linea, columna, TipoExpresion.TERNARIO);
  }

  public ejecutar(entorno: Entorno): TipoRetorno {
    const cond = this.condicion.ejecutar(entorno);

    // (opcional) valida que la condición sea booleana
    // si tu motor ya hace coerción, puedes quitar esto
    if (cond.tipo !== Tipo.BOOLEANO) {
      // aquí podrías registrar un error semántico si así lo manejas
      // y devolver algo neutro
      return { valor: false, tipo: Tipo.BOOLEANO };
    }

    const rama = cond.valor ? this.exprTrue : this.exprFalse;
    const res = rama.ejecutar(entorno); // { valor, tipo }

    // (opcional) puedes forzar que ambas ramas tengan el mismo tipo:
    // const resT = this.exprTrue.ejecutar(entorno);
    // const resF = this.exprFalse.ejecutar(entorno);
    // if (resT.tipo !== resF.tipo) { /* reporta error semántico */ }

    return res;
  }
}