// Backend/Clases/Utilidades/VectorInit.ts
import { Expresion } from "../Abstractas/Expresion";

// Backend/Clases/Utilidades/VectorInit.ts
// Backend/Clases/Utilidades/VectorInit.ts
export class VecInit {
  constructor(
    public kind: 'size' | 'list',       // cómo se inicializa: por tamaño o por lista
    public sizes: any[] | null,         // [n] o [n,m] si kind === "size"
    public rows: any[] | any[][] | null // [a,b,c] o [[...],[...]] si kind === "list"
  ) {}
}
