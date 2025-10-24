# SimpliCode - Compilador e Intérprete 🚀

Aplicación web para compilar e interpretar código SimpliCode, un lenguaje de programación sencillo desarrollado con fines educativos.

## Características 💡

- Editor de código integrado
- Consola para visualizar la salida del programa
- Tabla de símbolos para ver variables y funciones
- Visualizador de errores léxicos, sintácticos y semánticos
- Generador y visualizador de AST (Árbol de Sintaxis Abstracta)

## Tecnologías Utilizadas 🛠️

### Frontend
- React.js
- Vite
- Axios para peticiones HTTP
- viz.js para visualización de grafos

### Backend 
- Node.js
- TypeScript
- Express
- Jison para el análisis léxico y sintáctico

## Estructura del Proyecto 📁

```
├── Frontend/             # Aplicación web React
│   ├── src/             
│   │   ├── components/  # Componentes React 
│   │   └── assets/     # Recursos estáticos
│   └── public/         # Archivos públicos
└── Backend/            # Servidor y compilador
    ├── Clases/        # Implementación del intérprete
    ├── Controlador/   # Lógica de control
    └── Lenguaje/      # Gramática y parser
```

## Instalación y Uso 🔧

1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/simplecode.git
```

2. Instalar dependencias del frontend:
```bash
cd Frontend
npm install
```

3. Instalar dependencias del backend:
```bash
cd Backend
npm install
```

4. Ejecutar el frontend:
```bash
cd Frontend
npm run dev
```

5. Ejecutar el backend:
```bash
cd Backend
npx nodemon App.ts
```


## Autor ✒️
Victor Hugo Velasquez - 202100054
