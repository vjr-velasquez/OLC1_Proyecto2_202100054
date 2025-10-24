import { Request,  Response } from "express";
import { getSalida, limpiarSalidas, getErrores, errores as errs } from '../Clases/Utilidades/Salida';
import { Error as LangError } from '../Clases/Utilidades/Error';
import { TipoError } from '../Clases/Utilidades/TipoError';
import { Entorno } from "../Clases/Entorno/Entorno";
import { tablaSimbolos } from "../Clases/Entorno/Tabla";
import { GeneradorAST } from '../Clases/Utilidades/GeneradorAST';

export class Controlador {

    public running(req: Request, res: Response) {
        res.send('Interpreter is running!!!')
    }
    public parserFile(req: Request, res: Response) {
  const file = req.body.file;
  const parser = require('../Lenguaje/Parser');
  const fs = require('fs');

  fs.readFile(file, 'utf-8', (err: Error, data: string) => {
    if (err) {
      return res.status(400).json({ console: String(err) });
    }

    try {
      limpiarSalidas();

      // Limpiar tabla de símbolos (soporta array plano o Tabla.simbolos)
      if (Array.isArray(tablaSimbolos)) {
        tablaSimbolos.splice(0, tablaSimbolos.length);
      } else if (Array.isArray((tablaSimbolos as any).simbolos)) {
        (tablaSimbolos as any).simbolos.splice(0, (tablaSimbolos as any).simbolos.length);
      }

      const instrucciones = parser.parse(data);
      const global: Entorno = new Entorno(null, 'Global');

      // Generar AST
      const generadorAST = new GeneradorAST();
      const astDot = generadorAST.generarDOT(instrucciones);

      for (const instruccion of instrucciones) {
        try {
          instruccion.ejecutar(global);
        } catch (e: any) {
          // Registrar errores en lugar de silenciarlos
          errs.push(new LangError(
            0, 0,
            TipoError.SEMANTICO,
            String(e?.message ?? e)
          ));
        }
      }

      const out = String(getSalida());
      const simbolos =
        Array.isArray(tablaSimbolos)
          ? tablaSimbolos
          : (Array.isArray((tablaSimbolos as any).simbolos) ? (tablaSimbolos as any).simbolos : []);

      return res.json({
        console: out,
        errores: getErrores?.() ?? [],
        simbolos,
        ast: astDot
      });
    } catch (e: any) {
      // Errores de parseo u otros
      errs.push(new LangError(0, 0, TipoError.SINTACTICO, String(e)));
      return res.json({
        console: String(getSalida()),
        errores: getErrores?.() ?? [],
        simbolos: [],
        ast: ""
      });
    }
  });
}


parserText(req: Request, res: Response) {
        const code = req.body.code;
        const parser = require('../Lenguaje/Parser');

        try {
            limpiarSalidas();

            // Limpiar tabla de símbolos
            if (Array.isArray(tablaSimbolos)) {
                tablaSimbolos.splice(0, tablaSimbolos.length);
            } else if (Array.isArray((tablaSimbolos as any).simbolos)) {
                (tablaSimbolos as any).simbolos.splice(0, (tablaSimbolos as any).simbolos.length);
            }

            const instrucciones = parser.parse(code);
            const global: Entorno = new Entorno(null, 'Global');

            // Generar AST ANTES de ejecutar
            const generadorAST = new GeneradorAST();
            const astDot = generadorAST.generarDOT(instrucciones);

            for (const instruccion of instrucciones) {
                try {
                    instruccion.ejecutar(global);
                } catch (e: any) {
                    errs.push(new LangError(
                        0, 0,
                        TipoError.SEMANTICO,
                        String(e?.message ?? e)
                    ));
                }
            }

            const out = String(getSalida());
            const simbolos =
                Array.isArray(tablaSimbolos)
                    ? tablaSimbolos
                    : (Array.isArray((tablaSimbolos as any).simbolos) ? (tablaSimbolos as any).simbolos : []);

            res.json({
                console: out,
                errores: getErrores?.() ?? [],
                simbolos,
                ast: astDot  // Ahora enviamos el DOT generado
            });
        } catch (error) {
            errs.push(new LangError(0, 0, TipoError.SINTACTICO, String(error ?? 'error')));
            res.json({
                console: String(getSalida()),
                errores: getErrores?.() ?? [],
                simbolos: [],
                ast: ""  // AST vacío en caso de error
            });
        }
    }



    // public parser(req: Request, res: Response) {
    //     let code = req.body.code
    //     let parser = require('../Language/Parser')
    //     try {
    //         resetOuts()
    //         symTable.splice()
    //         let instructions = parser.parse(code)
    //         let ast: AST = new AST()
    //         const global: Env = new Env(null, 'Global')
    //         var dotAST: string =  'digraph G{\nnode[color="white" fontcolor="white"];\nedge[dir=none color="white"];\nbgcolor = "#0D1117";'
    //         dotAST += '\nnode_r[label="INSTRUCTIONS"];'
    //         var resultAST: ReturnAST
    //         for(let instruction of instructions) {
    //             try {
    //                 if(instruction.typeInst === TypeInst.INIT_FUNCTION) {
    //                     instruction.execute(global)
    //                     resultAST = instruction.ast(ast)
    //                     dotAST += '\n' + resultAST.dot
    //                     dotAST += `\nnode_r -> node_${resultAST.id};`
    //                 }
    //             }
    //             catch (error) {}
    //         }
    //         for(let instruction of instructions) {
    //             try {
    //                 if(instruction.typeInst !== TypeInst.INIT_FUNCTION) {
    //                     instruction.execute(global)
    //                     resultAST = instruction.ast(ast)
    //                     dotAST += '\n' + resultAST.dot
    //                     dotAST += `\nnode_r -> node_${resultAST.id};`
    //                 }
    //             }
    //             catch (error) {}
    //         }
    //         dotAST += '\n}'
    //         res_dotAST = dotAST
    //         res.json({
    //             console: getStringOuts()
    //         })
    //     }
    //     catch (error) {
    //         res.json({
    //             console: error
    //         })
    //     }
    // }
    // public getAST(req: Request, res: Response) {
    //     try {
    //         res.json({
    //             ast: res_dotAST
    //         })
    //     }
    //     catch (error) {
    //         res.json({
    //             ast: error
    //         })
    //     }
    // }
    public getSymbolsTable(req: Request, res: Response) {
        try {
            res.json({
                table: tablaSimbolos.simbolos
            })
        }
        catch (error) {
            res.json({
                table: error
            })
        }
    }
    public getErrores(req: Request, res: Response) {
        try {
            res.json({
                errors: getErrores()
            })
        }
        catch (error) {
            res.json({
                errors: error
            })
        }
    }
    // public getTokens(req: Request, res: Response) {
    //     try {
    //         res.json({
    //             tok: getTokens()
    //         })
    //     }
    //     catch (error) {
    //         res.json({
    //             tok: error
    //         })
    //     }
    // }
}