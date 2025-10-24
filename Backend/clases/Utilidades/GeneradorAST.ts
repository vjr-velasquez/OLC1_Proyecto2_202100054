export class GeneradorAST {
    private contador: number = 0;
    private dot: string = '';

    public generarDOT(instrucciones: any[]): string {
        this.contador = 0;
        this.dot = 'digraph AST {\n';
        this.dot += 'node [shape=box, style=filled, fillcolor=lightblue, fontname="Arial"];\n';
        this.dot += 'edge [color=black];\n';
        this.dot += 'bgcolor=white;\n';

        if (instrucciones && instrucciones.length > 0) {
            const rootId = this.crearNodo('PROGRAMA');
            
            for (const instruccion of instrucciones) {
                if (instruccion) {
                    const instruccionId = this.procesarNodo(instruccion);
                    this.dot += `${rootId} -> ${instruccionId};\n`;
                }
            }
        }

        this.dot += '}';
        return this.dot;
    }

    private crearNodo(etiqueta: string): string {
        const id = `node${this.contador++}`;
        this.dot += `${id} [label="${etiqueta}"];\n`;
        return id;
    }

    private procesarNodo(nodo: any): string {
        if (!nodo) return this.crearNodo('NULL');

        // Determinar el tipo de nodo
        let etiqueta = '';
        
        if (nodo.constructor && nodo.constructor.name) {
            etiqueta = nodo.constructor.name;
        } else if (nodo.tipo) {
            etiqueta = nodo.tipo;
        } else {
            etiqueta = 'UNKNOWN';
        }

        // Agregar valor si existe
        if (nodo.valor !== undefined && nodo.valor !== null) {
            etiqueta += `\\n${nodo.valor}`;
        } else if (nodo.id !== undefined) {
            etiqueta += `\\n${nodo.id}`;
        } else if (nodo.operador !== undefined) {
            etiqueta += `\\n${nodo.operador}`;
        }

        const nodeId = this.crearNodo(etiqueta);

        // Procesar hijos comunes
        const propiedadesHijos = [
            'izquierda', 'derecha', 'expresion', 'expresiones',
            'condicion', 'instrucciones', 'instruccionesIf', 'instruccionesElse',
            'inicio', 'fin', 'incremento', 'parametros', 'argumentos',
            'valor', 'variable'
        ];

        for (const prop of propiedadesHijos) {
            if (nodo[prop] !== undefined && nodo[prop] !== null) {
                if (Array.isArray(nodo[prop])) {
                    // Si es un array, procesar cada elemento
                    for (const item of nodo[prop]) {
                        if (item) {
                            const hijoId = this.procesarNodo(item);
                            this.dot += `${nodeId} -> ${hijoId};\n`;
                        }
                    }
                } else {
                    // Si es un objeto único
                    const hijoId = this.procesarNodo(nodo[prop]);
                    this.dot += `${nodeId} -> ${hijoId};\n`;
                }
            }
        }

        return nodeId;
    }
}