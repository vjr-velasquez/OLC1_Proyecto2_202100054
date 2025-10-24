import { Expresion } from "../Abstractas/Expresion";
import { Instruccion } from "../Abstractas/Instruccion";
import { Entorno } from "../Entorno/Entorno";
import { TipoRetorno } from "../Utilidades/Tipo";
import { TipoInstruccion } from "../Utilidades/TipoInstruccion";
import { Parametro } from "../Expresiones/Parametro";
import { Bloque } from "../Instrucciones/Bloque";

export class LlamadaMEtodo extends Instruccion {
  constructor(linea: number, columna: number, public id: string, public argumentos: Expresion[]) {
    super(linea, columna, TipoInstruccion.LLAMADA_METODO);
  }

  public ejecutar(entorno: Entorno): TipoRetorno | any {
    const metodo = entorno.getMetodo(this.id);
    if (!metodo) {
      // Método no encontrado (puedes registrar error semántico si tienes sistema de errores)
      return null;
    }

    const entornoMetodo = new Entorno(entorno, "Metodo " + this.id);

    // Demasiados argumentos → error
    if (this.argumentos.length > metodo.parametros.length) {
      return null;
    }

    // Liga argumentos con parámetros (usando default si falta)
    for (let i = 0; i < metodo.parametros.length; i++) {
      const p: Parametro = metodo.parametros[i];

      let valor: TipoRetorno | null = null;

      if (i < this.argumentos.length) {
        // argumento proporcionado
        valor = this.argumentos[i].ejecutar(entorno);
      } else if (p.defaultExpr) {
        // sin argumento → usar valor por defecto del parámetro
        valor = p.defaultExpr.ejecutar(entorno);
      } else {
        // faltó argumento y no hay default
        return null;
      }

      // Chequeo de tipo
      if (valor.tipo !== p.tipo) {
        return null;
      }

      entornoMetodo.guardarVariable(p.id, valor.valor, p.tipo, this.linea, this.columna);
    }

    // Ejecutar cuerpo
    const ejecucion = new Bloque(this.linea, this.columna, metodo.instrucciones).ejecutar(entornoMetodo);
    if (ejecucion) return ejecucion;
    return null;
  }
}
