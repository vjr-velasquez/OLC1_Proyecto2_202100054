import { Tipo } from "../Utilidades/Tipo";

export class Simbolo {
    constructor(public valor: any, public id: string, public tipo: Tipo) {
        this.id = id;
    }
   // --- metadatos opcionales para vectores ---
  public isvector?: boolean;   // true si es vector 1D o 2D
  public base?: Tipo;          // tipo base de los elementos
  public dims?: number;        // 1 | 2
}