import { Console } from "console";
import { salidasConsola } from "../Utilidades/Salida";
import { Tipo } from "../Utilidades/Tipo";
import { Simbolo } from "./Simbolo";
import { Funcion } from "../Instrucciones/Funcion";
import { Metodo } from "../Instrucciones/Metodo";
import { tablaSimbolos } from "./Tabla";
import { SimboloTabla } from "./SimboloTabla";
import { Objeto } from "./Objeto";
import { Atributo } from "../Expresiones/Atributo";

export class Entorno {
  public ids: Map<string, Simbolo> = new Map<string, Simbolo>();
  public funciones: Map<string, Funcion> = new Map<string, Funcion>();
  public metodos: Map<string, Metodo> = new Map<string, Metodo>();
  public objetos: Map<string, Objeto> = new Map<string, Objeto>();

  constructor(private anterior: Entorno | null, public nombre: string) {}

  // === Guardar Variable ===
  public guardarVariable(id: string, valor: any, tipo: Tipo, linea: number, columna: number) {
    let entorno: Entorno = this;
    if (!entorno.ids.has(id)) {
      entorno.ids.set(id, new Simbolo(valor, id, tipo));
      tablaSimbolos.push(new SimboloTabla(linea, columna, true, true, valor, tipo, id, entorno.nombre));
    }
    // Si ya existe, no hace nada (control de error en semántico externo)
  }

  // === Obtener Variable ===
  public getVariable(id: string): Simbolo | null {
    let entorno: Entorno | null = this;
    while (entorno != null) {
      if (entorno.ids.has(id)) {
        return entorno.ids.get(id)!;
      }
      entorno = entorno.anterior;
    }
    return null; // Variable no existe
  }

  // === Actualizar Variable (solo valor) ===
  public setVariable(id: string, valor: any) {
    let entorno: Entorno | null = this;
    while (entorno != null) {
      if (entorno.ids.has(id)) {
        const simbolo: Simbolo = entorno.ids.get(id)!;
        simbolo.valor = valor;
        entorno.actualizarFilaTablaSimbolos(id, valor, simbolo.tipo);
        return;
      }
      entorno = entorno.anterior;
    }
  }

  // === GUARDAR OBJETO ===
  public guardarObjeto(id: string, atributos: Atributo[]) {
    let entorno: Entorno = this;
    if (!entorno.objetos.has(id)) {
      this.objetos.set(id, new Objeto(id));
      this.guardarAtributo(id, atributos);
    }
  }

  public guardarAtributo(id: string, atributo: Atributo[]) {
    let entorno: Entorno = this;
    if (entorno.objetos.has(id)) {
      let objeto: Objeto = entorno.objetos.get(id)!;
      for (let i = 0; i < atributo.length; i++) {
        objeto.atributos.set(atributo[i].id, atributo[i]);
      }
    }
  }

  // === OBTENER OBJETO ===
  public getObjeto(id: string): Objeto | null {
    let entorno: Entorno | null = this;
    while (entorno != null) {
      if (entorno.objetos.has(id)) {
        console.log("Objeto encontrado: " + id);
        console.log(entorno.objetos.get(id));
        return entorno.objetos.get(id)!;
      }
      entorno = entorno.anterior;
    }
    return null;
  }

  // === GUARDAR FUNCION ===
  public guardarFuncion(id: string, funcion: Funcion) {
    let entorno: Entorno = this;
    if (!entorno.funciones.has(id)) {
      entorno.funciones.set(id, funcion);
      tablaSimbolos.push(
        new SimboloTabla(funcion.linea, funcion.columna, false, false, null, funcion.tipo, id, entorno.nombre)
      );
    }
  }

  // === OBTENER FUNCION ===
  public getFuncion(id: string): Funcion | null {
    let entorno: Entorno | null = this;
    while (entorno != null) {
      if (entorno.funciones.has(id)) {
        return entorno.funciones.get(id)!;
      }
      entorno = entorno.anterior;
    }
    return null;
  }

  // === GUARDAR METODO ===
  public guardarMetodo(id: string, metodo: Metodo) {
    let entorno: Entorno = this;
    if (!entorno.metodos.has(id)) {
      entorno.metodos.set(id, metodo);
      tablaSimbolos.push(
        new SimboloTabla(metodo.linea, metodo.columna, false, false, null, metodo.tipo, id, entorno.nombre)
      );
    }
  }

  // === OBTENER METODO ===
  public getMetodo(id: string): Metodo | null {
    let entorno: Entorno | null = this;
    while (entorno != null) {
      if (entorno.metodos.has(id)) {
        return entorno.metodos.get(id)!;
      }
      entorno = entorno.anterior;
    }
    return null;
  }

  // === IMPRIMIR ===
  public setPrint(print: any) {
    if (print === null || print === undefined) print = "";
    if (typeof print === "object" && print && "valor" in print) {
      print = (print as any).valor;
    }
    if (typeof print !== "string") {
      try {
        print = JSON.stringify(print);
      } catch {
        print = String(print);
      }
    }
    salidasConsola.push(print);
  }

  // ============================================================
  // === MÉTODOS NUEVOS: sincronización con la tabla de símbolos ===
  // ============================================================

  // 🔹 Actualiza la fila de la tabla de símbolos (a prueba de nombres distintos)
  private actualizarFilaTablaSimbolos(id: string, valor: any, tipo?: Tipo) {
    const arr = tablaSimbolos as unknown as any[];

    for (let i = arr.length - 1; i >= 0; i--) {
      const row: any = arr[i];
      const rowId =
        row?.id ?? row?.ID ?? row?.nombre ?? row?.name ?? row?.identificador;
      const rowEntorno =
        row?.entorno ?? row?.ambito ?? row?.scope ?? row?.contexto ?? row?.ambiente;

      const mismoId = rowId === id;
      const mismoEntorno = rowEntorno ? rowEntorno === this.nombre : true;

      if (mismoId && mismoEntorno) {
        try {
          // Reemplazar la entrada completa (evita problemas con readonly)
          arr[i] = new SimboloTabla(
            row.linea ?? row.fila ?? 0,
            row.columna ?? row.col ?? 0,
            row.esVariable ?? row.variable ?? true,
            row.esMutable ?? row.mutable ?? true,
            valor,
            tipo ?? row.tipo,
            rowId,
            rowEntorno ?? this.nombre
          );
        } catch {
          // Si no se puede instanciar, copiar plano
          arr[i] = {
            ...row,
            valor,
            tipo: tipo ?? row.tipo,
            id: rowId,
            entorno: rowEntorno ?? this.nombre,
          };
        }
        break;
      }
    }
  }

  // 🔹 Actualiza símbolo + tabla de símbolos (usado por Asignacion.ts, etc.)
  public actualizarVariable(id: string, valor: any, tipo?: Tipo) {
    let entorno: Entorno | null = this;
    while (entorno != null) {
      if (entorno.ids.has(id)) {
        const sim: Simbolo = entorno.ids.get(id)!;
        sim.valor = valor;
        if (tipo !== undefined && tipo !== null) sim.tipo = tipo;
        entorno.actualizarFilaTablaSimbolos(id, valor, tipo);
        return;
      }
      entorno = entorno.anterior;
    }
  }
}
