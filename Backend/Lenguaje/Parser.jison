// =========================
// Analizador Léxico
// =========================
%{
    // JavaScript
    let { errores } = require ('../Clases/Utilidades/Salida')
    const { Error } = require ('../Clases/Utilidades/Error')
    const { TipoError } = require ('../Clases/Utilidades/TipoError')
    // Función para procesar secuencias de escape
    function procesarSecuenciasEscape(cadena) {
        return cadena.replace(/\\n/g, '\n')    // Salto de línea
                     .replace(/\\t/g, '\t')    // Tabulación
                     .replace(/\\"/g, '"')     // Comilla doble
                     .replace(/\\'/g, "'")     // Comilla simple
                     .replace(/\\\\/g, '\\');  // Barra invertida
    }
%}

%lex
// Expresiones Regulares
UNUSED      [\s\r\t]+
CONTENT     ([^\n\"\\]|\\.)
ID          [a-zA-Z_][a-zA-Z0-9_]*
STRING      \"({CONTENT}*)\"
CHAT        \'({CONTENT}*)\'
INTEGER     [0-9]+\b
DOUBLE      [0-9]+\.[0-9]+\b
COMMENTS    \/\/.*
COMMENTM    [/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]

%%
\n                      {}
{COMMENTS}              {}
{COMMENTM}              {}
{UNUSED}                {}

// === TOKENS ===
// === RESERVADAS ===
'ingresar'              { return 'RW_ingresar'      }
'como'                  { return 'RW_como'          }
'con'                   { return 'RW_con'           }
'valor'                 { return 'RW_valor'         }
'imprimir'              { return 'RW_imprimir'      }
'verdadero'             { return 'RW_verdadero'     }
'falso'                 { return 'RW_falso'         }
'fin'                   { return 'RW_fin'           }
'o'                     { return 'RW_o'             }
'si'                    { return 'RW_si'            }
'de lo contrario'       { return 'RW_deLoContrario' }
'para'                  { return 'RW_para'          }
'hasta'                 { return 'RW_hasta'         }
'incremento'            { return 'RW_incremento'    }
'decremento'            { return 'RW_decremento'    }
'hacer'                 { return 'RW_hacer'         }
'entonces'              { return 'RW_entonces'      }
'retornar'              { return 'RW_retornar'      }
'detener'               { return 'RW_regresar'      }
'continuar'             { return 'RW_continuar'     }
'funcion'               { return 'RW_funcion'       }
'parametros'            { return 'RW_parametros'    }
'objeto'                { return 'RW_objeto'        }
'procedimiento'         { return 'RW_procedimiento' }
'ejecutar'              { return 'RW_ejecutar'      }
'inc'                   { return 'RW_incrementar'   }
'dec'                   { return 'RW_decrementar'   }
'mientras'              { return 'RW_mientras'      }
'nl'                    { return 'RW_nl'            }
'repetir'               { return 'RW_repetir'       }
'que'                   { return 'RW_que'           }
'segun'                 { return 'RW_segun'         }
'en caso de ser'        { return 'RW_enCasoDeSer'   }
'tolower'               { return 'RW_minuscula'     }
'toupper'               { return 'RW_mayuscula'     }
'longitud'              { return 'RW_longitud'      }
'truncar'               { return 'RW_truncar'       }
'redondear'             { return 'RW_redondear'     }
'tipo'                  { return 'RW_tipo'          }
'vector'                { return 'RW_vector'        }

// === TIPOS DE DATOS ===
'entero'                { return 'RW_entero'   }
'decimal'               { return 'RW_decimal'  }
'cadena'                { return 'RW_cadena'   }
'caracter'              { return 'RW_char'     }
'booleano'              { return 'RW_booleano' }

// === EXPRESIONES ===
{ID}                    { return 'TK_id'       }
{STRING}                { yytext = yytext.substr(1,yyleng - 2); yytext = procesarSecuenciasEscape(yytext); return 'TK_string' }
{CHAT}                  { yytext = yytext.substr(1,yyleng - 2); yytext = procesarSecuenciasEscape(yytext); return 'TK_char'   }
{DOUBLE}                { return 'TK_double'   }
{INTEGER}               { return 'TK_integer'  }

// === RELACIONALES (primero dos caracteres) ===
'=='                    { return 'TK_igual'    }
'!='                    { return 'TK_dif'      }
'>='                    { return 'TK_mayorI'   }
'<='                    { return 'TK_menorI'   }
'>'                     { return 'TK_mayor'    }
'<'                     { return 'TK_menor'    }

// === LOGICOS ===
'&&'                    { return 'TK_and'      }
'||'                    { return 'TK_or'       }
'!'                     { return 'TK_not'      }

// === INC/DEC (antes que + y -) ===
'++'                    { return 'TK_inc'      }
'--'                    { return 'TK_dec'      }

// === ARITMETICOS ===
'+'                     { return 'TK_suma'     }
'-'                     { return 'TK_resta'    }
'*'                     { return 'TK_mult'     }
'/'                     { return 'TK_div'      }
'%'                     { return 'TK_mod'      }
'^'                     { return 'TK_pot'      }

// === ASIGNACION (después de ==) ===
'='                     { return 'TK_asign'    }

// === AGRUPACION / SEPARADORES ===
'{'                     { return 'TK_llaA'     }
'}'                     { return 'TK_llaC'     }
'('                     { return 'TK_parA'     }
')'                     { return 'TK_parC'     }
'['                     { return 'TK_corA'     }
']'                     { return 'TK_corC'     }
','                     { return 'TK_coma'     }
';'                     { return 'TK_pyc'      }
'?'                     { return 'TK_q'        }
':'                     { return 'TK_colon'    }

// Otros
.                       { errores.push(new Error(yylloc.first_line, yylloc.first_column + 1, TipoError.LEXICO, `Caracter no reconocido «${yytext}»`)); }
<<EOF>>                 { return 'EOF' }
/lex


// =========================
/* Analizador Sintáctico */
// =========================
%{
    // Tipos
    const { Tipo } = require ('../Clases/Utilidades/Tipo')

    // Instrucciones
    const { DeclaracionID } = require ('../Clases/Instrucciones/DeclaracionID')
    const { Asignacion }    = require ('../Clases/Instrucciones/Asignacion')
    const { Imprimir }      = require ('../Clases/Instrucciones/Imprimir')
    const { Si }            = require ('../Clases/Instrucciones/Si')
    const { Para }          = require ('../Clases/Instrucciones/Para')
    const { Continuar }     = require ('../Clases/Instrucciones/Continuar')
    const { Funcion }       = require ('../Clases/Instrucciones/Funcion')
    const { Metodo }        = require ('../Clases/Instrucciones/Metodo')
    const { LlamadaMEtodo } = require ('../Clases/Instrucciones/LlamadaMEtodo')
    const { GuardarObjeto } = require ('../Clases/Instrucciones/GuardarObjeto')
    const { Mientras }      = require ('../Clases/Instrucciones/Mientras')
    const { Repetir }       = require ('../Clases/Instrucciones/Repetir')
    const { Switch }        = require ('../Clases/Instrucciones/Switch')
    const { Case }          = require ('../Clases/Instrucciones/Case')

    // Vectores
    const { DeclaracionVector } = require ('../Clases/Instrucciones/DeclaracionVector')
    const { AsignacionVector }  = require ('../Clases/Instrucciones/AsignacionVector')

    // Expresiones
    const { Primitivo }     = require ('../Clases/Expresiones/Primitivo')
    const { AccesoID }      = require ('../Clases/Expresiones/AccesoID')
    const { IncDec }        = require ('../Clases/Expresiones/IncDec')
    const { Aritmetico }    = require ('../Clases/Expresiones/Aritmetico')
    const { Relacional }    = require ('../Clases/Expresiones/Relacional')
    const { Logico }        = require ('../Clases/Expresiones/Logico')
    const { Retornar }      = require ('../Clases/Expresiones/Retornar')
    const { Parametro }     = require ('../Clases/Expresiones/Parametro')
    const { LlamadaFUncion }= require ('../Clases/Expresiones/LlamadaFUncion')
    const { AccesoObjeto }  = require ('../Clases/Expresiones/AccesoObjeto')
    const { Atributo }      = require ('../Clases/Expresiones/Atributo')
    const { Casteo }        = require ('../Clases/Expresiones/Casteo')
    const { Minuscula }     = require ('../Clases/Expresiones/Minuscula')
    const { Mayuscula }     = require ('../Clases/Expresiones/Mayuscula')
    const { Longitud }      = require ('../Clases/Expresiones/Longitud')
    const { Truncar }       = require ('../Clases/Expresiones/Truncar')
    const { Redondear }     = require ('../Clases/Expresiones/Redondear')
    const { TipoD }         = require ('../Clases/Expresiones/TipoD')
    const { Ternario }      = require ('../Clases/Expresiones/Ternario')

    // Vector: acceso y literal
    const { AccesoVector }  = require ('../Clases/Expresiones/AccesoVector')
    const { VecInit }       = require ('../Clases/Utilidades/VectorInit')
    const { VectorLiteral } = require ('../Clases/Expresiones/VectorLiteral')
%}

/* Precedencia de Operadores */
%left   TK_or
%left   TK_and
%right  TK_not
%left   TK_igual TK_dif
%left   TK_menor TK_menorI TK_mayor TK_mayorI
%left   TK_suma TK_resta
%left   TK_mult TK_div TK_mod
%right  TK_pot
%nonassoc RW_deLoContrario
%right  TK_negacionUnaria
%right  TK_q TK_colon
/* Precedencia adicional para resolver: [ LISTA_VALORES ] , ...  vs  [ LISTA_VALORES ] */
%left   TK_corC     /* menor precedencia */
%left   TK_coma     /* mayor que TK_corC => favorece shift con coma */


%start INICIO
%%

INICIO 
      : INSTRUCCIONES EOF  { return $1 } 
      | EOF                { return [] } 
      ;

INSTRUCCIONES
      : INSTRUCCIONES INSTRUCCION { 
            if (Array.isArray($2)) { $1.push(...$2); } else { $1.push($2); }
            $$ = $1; 
        }
      | INSTRUCCION               { $$ = Array.isArray($1) ? $1 : [$1]; }
      ;

INSTRUCCION
      : DECLARACION_VECTOR  { $$ = $1 }
      | DECLARACION         { $$ = $1 }
      | OBJETOS             { $$ = $1 } 
      | ASIGNACION_VECTOR   { $$ = $1 }
      | ASIGNACION          { $$ = $1 }
      | FUNCIONES           { $$ = $1 }
      | METODOS             { $$ = $1 }
      | LLAMAR_METODOS      { $$ = $1 }
      | LLAMAR_FUNCIONES    { $$ = $1 }
      | IMPRIMIR            { $$ = $1 }
      | CONDICIONAL_SI      { $$ = $1 }
      | CICLO_PARA          { $$ = $1 }
      | RETORNO             { $$ = $1 }
      | INCREMENTO_INST     { $$ = $1 }
      | MIENTRAS            { $$ = $1 }
      | REPETIR             { $$ = $1 }
      | SEGUN               { $$ = $1 }
      | CONTINUAR           { $$ = $1 }
      | error               { errores.push(new Error(this._$.first_line, this._$.first_column + 1, TipoError.SINTACTICO, `No se esperaba «${yytext}»`)); $$ = null; }
      ;

/* ===== Declaraciones: simples y múltiples ===== */
DECLARACION
      : TIPO VARLIST INIT_OPT TK_pyc
        {
          const ids = $2;
          const exprs = $3 ? $3.exprs : null;
          const out = [];
          if (!exprs) {
            for (const id of ids) out.push(new DeclaracionID(@1.first_line, @1.first_column, id, $1, null));
          } else {
            const n = Math.min(ids.length, exprs.length);
            for (let i = 0; i < n; i++) out.push(new DeclaracionID(@1.first_line, @1.first_column, ids[i], $1, exprs[i]));
            for (let i = n; i < ids.length; i++) out.push(new DeclaracionID(@1.first_line, @1.first_column, ids[i], $1, null));
          }
          $$ = out;
        }
      ;

/* ---------- DECLARACIÓN DE VECTORES ---------- */
DECLARACION_VECTOR
  /* A) TIPO ID [] = vector ... */
  : TIPO TK_id DIMLIST TK_asign RW_vector TIPO_OPT VECTOR_INIT TK_pyc
      {
        var _tipo = $6 ?? $1;
        var _init = new VecInit('size', $7.sizes, null);
        $$ = new DeclaracionVector(@2.first_line, @2.first_column, $2, _tipo, $3, _init);
      }
  | TIPO TK_id DIMLIST TK_asign VECTOR_LIST TK_pyc
      {
        var _init = new VecInit('list', null, $5.rows);
        $$ = new DeclaracionVector(@2.first_line, @2.first_column, $2, $1, $3, _init);
      }

  /* B) TIPO [] ID = vector ...  (estilo entero[] id = ...) */
  | TIPO DIMLIST TK_id TK_asign RW_vector TIPO_OPT VECTOR_INIT TK_pyc
      {
        var _tipo = $6 ?? $1;
        var _init = new VecInit('size', $7.sizes, null);
        $$ = new DeclaracionVector(@3.first_line, @3.first_column, $3, _tipo, $2, _init);
      }
  | TIPO DIMLIST TK_id TK_asign VECTOR_LIST TK_pyc
      {
        var _init = new VecInit('list', null, $5.rows);
        $$ = new DeclaracionVector(@3.first_line, @3.first_column, $3, $1, $2, _init);
      }
  ;

/* ---- Literal de vector como EXPRESIÓN ---- */
/* 1D: [a,b,c]  | 2D: [[a,b],[c,d]] (al menos dos filas) */
VECTOR_LITERAL
  : TK_corA LISTA_VALORES TK_corC
      { $$ = new VectorLiteral(@1.first_line, @1.first_column, 1, $2); }
  | TK_corA LISTA_FILAS2D TK_corC
      { $$ = new VectorLiteral(@1.first_line, @1.first_column, 2, $2); }
  ;

/* [] o [][] */
DIMLIST
  : TK_corA TK_corC                         { $$ = 1; }
  | TK_corA TK_corC TK_corA TK_corC         { $$ = 2; }
  ;

/* tipo opcional tras la palabra 'vector' */
TIPO_OPT
  : /* vacío */               { $$ = null; }
  | TIPO                      { $$ = $1; }
  ;

/* vector [expr] o [expr][expr] */
VECTOR_INIT
  : TK_corA EXPRESION TK_corC
      { $$ = { sizes: [$2] }; }
  | TK_corA EXPRESION TK_corC TK_corA EXPRESION TK_corC
      { $$ = { sizes: [$2, $5] }; }
  ;

/* [a,b,c] o [[a,b],[c,d]] para declaraciones */
VECTOR_LIST
  : TK_corA LISTA_VALORES TK_corC
      { $$ = { rows: [ $2 ] }; }
  | TK_corA LISTA_FILAS2D TK_corC
      { $$ = { rows: $2 }; }
  ;

/* lista plana (1D) */
LISTA_VALORES
  : EXPRESION
      { $$ = [$1]; }
  | LISTA_VALORES TK_coma EXPRESION
      { $1.push($3); $$ = $1; }
  ;

/* lista de filas (2D) – requiere al menos dos filas para desambiguar con 1D */
LISTA_FILAS2D
  : TK_corA LISTA_VALORES TK_corC TK_coma TK_corA LISTA_VALORES TK_corC
      { $$ = [ $2, $6 ]; }
  | LISTA_FILAS2D TK_coma TK_corA LISTA_VALORES TK_corC
      { $1.push($4); $$ = $1; }
  ;

/* lista de ids: id ( , id )* */
VARLIST
      : TK_id                      { $$ = [$1]; }
      | VARLIST TK_coma TK_id      { $1.push($3); $$ = $1; }
      ;

/* opcional:  con valor <exprlist>  |  = <exprlist>  |  vacío */
INIT_OPT
      :                             { $$ = null; }
      | RW_con RW_valor EXPRLIST    { $$ = { exprs: $3 }; }
      | TK_asign EXPRLIST           { $$ = { exprs: $2 }; }
      ;

/* lista de expresiones: expr ( , expr )* */
EXPRLIST
      : EXPRESION                   { $$ = [$1]; }
      | EXPRLIST TK_coma EXPRESION  { $1.push($3); $$ = $1; }
      ;

/* imprimir e imprimir nl (sin paréntesis) */
IMPRIMIR
      : RW_imprimir EXPRESION TK_pyc
          { $$ = new Imprimir(@1.first_line, @1.first_column, $2, undefined) }
      | RW_imprimir RW_nl EXPRESION TK_pyc
          { $$ = new Imprimir(@1.first_line, @1.first_column, $3, 'nl') }
      ;

/* ----------  ASIGNACIONES  ---------- */
ASIGNACION
      : TK_id TK_asign EXPRESION TK_pyc { $$ = new Asignacion(@1.first_line, @1.first_column, $1, $3) }
      ;

/* Asignación a vector: v[i] = expr ; | v[i][j] = expr ; */
ASIGNACION_VECTOR
      : TK_id INDICES TK_asign EXPRESION TK_pyc
          { $$ = new AsignacionVector(@1.first_line, @1.first_column, new AccesoVector(@1.first_line, @1.first_column, $1, $2), $4); }
      ;

INCREMENTO_EXPR
      : TK_id TK_inc                          { $$ = new IncDec(@1.first_line, @1.first_column, $1, 'inc', 'exp') }
      | TK_id TK_dec                          { $$ = new IncDec(@1.first_line, @1.first_column, $1, 'dec', 'exp') }
      | RW_incrementar TK_parA TK_id TK_parC  { $$ = new IncDec(@1.first_line, @1.first_column, $3, 'inc', 'exp') }
      | RW_decrementar TK_parA TK_id TK_parC  { $$ = new IncDec(@1.first_line, @1.first_column, $3, 'dec', 'exp') }
      ;

INCREMENTO_INST
      : TK_id TK_inc TK_pyc                          { $$ = new IncDec(@1.first_line, @1.first_column, $1, 'inc','ins') }
      | TK_id TK_dec TK_pyc                          { $$ = new IncDec(@1.first_line, @1.first_column, $1, 'dec','ins') }
      | RW_incrementar TK_parA TK_id TK_parC         { $$ = new IncDec(@1.first_line, @1.first_column, $3, 'inc','ins') }
      | RW_decrementar TK_parA TK_id TK_parC         { $$ = new IncDec(@1.first_line, @1.first_column, $3, 'dec','ins') }
      ;

// === OBJETOS ===
OBJETOS 
      : RW_objeto TK_id TK_parA ATRIBUTORS_OBJETO TK_parC { $$ = new GuardarObjeto(@1.first_line, @1.first_column, $2, $4) }
      ;

ATRIBUTORS_OBJETO
      : ATRIBUTORS_OBJETO ATRIBUTO_OBJETO { $1.push($2); $$ = $1; }
      | ATRIBUTO_OBJETO                   { $$ = [$1]; }
      ;

ATRIBUTO_OBJETO
      : TK_id TIPO { $$ = new Atributo($1, $2, undefined) }
      ;

// === OBTENER OBJETO ===
OBTENER_OBJETO
      : RW_objeto TK_id TK_parA TK_parC { $$ = new AccesoObjeto(@1.first_line, @1.first_column, $2) }
      ;

// === CONDICIONALES (dangling else resuelto por precedencia) ===
CONDICIONAL_SI
      : RW_si TK_parA EXPRESION TK_parC BLOQUE %prec RW_deLoContrario
        { $$ = new Si(@1.first_line, @1.first_column, $3, $5, null, null, null); }
      | RW_si TK_parA EXPRESION TK_parC BLOQUE RW_deLoContrario BLOQUE
        { $$ = new Si(@1.first_line, @1.first_column, $3, $5, null, null, $7); }
      | RW_si TK_parA EXPRESION TK_parC BLOQUE RW_o RW_si TK_parA EXPRESION TK_parC BLOQUE RW_deLoContrario BLOQUE
        { $$ = new Si(@1.first_line, @1.first_column, $3, $5, $9, $11, $13); }
      ;

// === BLOQUE auxiliar para { INSTRUCCIONES }
BLOQUE
      : TK_llaA INSTRUCCIONES TK_llaC { $$ = $2; }
      ;

// === CICLOS ===
CICLO_PARA
      : RW_para TK_parA FOR_INIT TK_pyc FOR_COND TK_pyc FOR_UPD TK_parC BLOQUE
        {
          const id = $3.id || $5.id || $7.id;
          const paso = $7.dir || $5.dir; // 'incremento' | 'decremento'
          $$ = new Para(@1.first_line, @1.first_column, id, $3.initExpr, $5.expr, paso, $9);
        }
      ;

FOR_INIT
      : TIPO TK_id TK_asign EXPRESION { $$ = { id: $2, initExpr: $4 }; }
      | TK_id TK_asign EXPRESION      { $$ = { id: $1, initExpr: $3 }; }
      ;

FOR_COND
      : TK_id TK_menor  EXPRESION { $$ = { id: $1, op: '<',  expr: $3, dir: 'incremento' }; }
      | TK_id TK_menorI EXPRESION { $$ = { id: $1, op: '<=', expr: $3, dir: 'incremento' }; }
      | TK_id TK_mayor  EXPRESION { $$ = { id: $1, op: '>',  expr: $3, dir: 'decremento' }; }
      | TK_id TK_mayorI EXPRESION { $$ = { id: $1, op: '>=', expr: $3, dir: 'decremento' }; }
      ;

FOR_UPD
      : TK_id TK_inc                         { $$ = { id: $1, dir: 'incremento' }; }
      | TK_id TK_dec                         { $$ = { id: $1, dir: 'decremento' }; }
      | RW_incrementar TK_parA TK_id TK_parC { $$ = { id: $3, dir: 'incremento' }; }
      | RW_decrementar TK_parA TK_id TK_parC { $$ = { id: $3, dir: 'decremento' }; }
      ;

// === FUNCIONES/MÉTODOS ===
FUNCIONES :
            RW_funcion TIPO TK_id TK_parA PARAMETROS TK_parC TK_llaA INSTRUCCIONES TK_llaC {$$ = new Funcion(@1.first_line, @1.first_column, $3, $2, $5, $8)} |
            RW_funcion TIPO TK_id TK_parA TK_parC TK_llaA INSTRUCCIONES TK_llaC           {$$ = new Funcion(@1.first_line, @1.first_column, $3, $2, [], $7)} ;

METODOS :
            RW_procedimiento TK_id TK_parA PARAMETROS TK_parC TK_llaA INSTRUCCIONES TK_llaC {$$ = new Metodo(@1.first_line, @1.first_column, $2, undefined, $4, $7)} |
            RW_procedimiento TK_id TK_parA TK_parC TK_llaA INSTRUCCIONES TK_llaC            {$$ = new Metodo(@1.first_line, @1.first_column, $2, undefined, [], $6)} ;

PARAMETROS :
            PARAMETROS TK_coma PARAMETRO {$$.push($3)} |
            PARAMETRO                    {$$ = [$1]  } ;

PARAMETRO
    : TIPO TK_id  { $$ = new Parametro(@2.first_line, @2.first_column, $2, $1); }
    | TK_id TIPO  { $$ = new Parametro(@1.first_line, @1.first_column, $1, $2); }
    ;

// === LLAMAR FUNCION/METODO ===
LLAMAR_FUNCIONES :
            TK_id TK_parA ARGUMENTOS TK_parC {$$ = new LlamadaFUncion(@1.first_line, @1.first_column, $1, $3)} |
            TK_id TK_parA TK_parC            {$$ = new LlamadaFUncion(@1.first_line, @1.first_column, $1, [])} ;

LLAMAR_METODOS :
            RW_ejecutar TK_id TK_parA ARGUMENTOS TK_parC {$$ = new LlamadaMEtodo(@1.first_line, @1.first_column, $2, $4)} |
            RW_ejecutar TK_id TK_parA TK_parC            {$$ = new LlamadaMEtodo(@1.first_line, @1.first_column, $2, [])} ;

ARGUMENTOS :
            ARGUMENTOS TK_coma EXPRESION {$$.push($3)} |
            EXPRESION                    {$$ = [$1]  } ;

// === OTROS CONTROL DE FLUJO ===
MIENTRAS
      : RW_mientras TK_parA EXPRESION TK_parC TK_llaA INSTRUCCIONES TK_llaC
        { $$ = new Mientras(@1.first_line, @1.first_column, $3, $6) }
      ;

REPETIR
      : RW_hacer TK_llaA INSTRUCCIONES TK_llaC RW_hasta RW_que TK_parA EXPRESION TK_parC
        { $$ = new Repetir(@1.first_line, @1.first_column, $3, $8) }
      ;

// === SEGUN (switch) ===
SEGUN
      : RW_segun EXPRESION RW_hacer CASOS RW_fin RW_segun
        { $$ = new Switch(@1.first_line, @1.first_column, $2, $4.cases, $4.defaultCase) }
      ;

CASOS
      : CASOS CASO { 
            if ($2.isDefault) { $$ = { cases: $1.cases, defaultCase: $2.instrucciones }; }
            else { $$ = { cases: [...$1.cases, $2.case], defaultCase: $1.defaultCase }; }
        }
      | CASO {
            if ($1.isDefault) { $$ = { cases: [], defaultCase: $1.instrucciones }; }
            else { $$ = { cases: [$1.case], defaultCase: [] }; }
        }
      ;

CASO
      : RW_enCasoDeSer EXPRESION RW_entonces INSTRUCCIONES { 
            $$ = { case: new Case(@1.first_line, @1.first_column, $2, $4), isDefault: false }; 
        }
      | RW_deLoContrario RW_entonces INSTRUCCIONES { 
            $$ = { instrucciones: $3, isDefault: true }; 
        }
      ;

// === CASTEOS ===
CASTEOS
      : TK_parA TIPO TK_parC PRIMITIVOS { $$ = new Casteo(@1.first_line, @1.first_column, $2, $4) }
      ;

// === NATIVAS ===
NATIVAS 
      : RW_minuscula TK_parA EXPRESION TK_parC { $$ = new Minuscula(@1.first_line, @1.first_column, $3) }
      | RW_mayuscula TK_parA EXPRESION TK_parC { $$ = new Mayuscula(@1.first_line, @1.first_column, $3) }
      | RW_longitud  TK_parA EXPRESION TK_parC { $$ = new Longitud(@1.first_line,  @1.first_column, $3) }
      | RW_truncar   TK_parA EXPRESION TK_parC { $$ = new Truncar(@1.first_line,   @1.first_column, $3) }
      | RW_redondear TK_parA EXPRESION TK_parC { $$ = new Redondear(@1.first_line, @1.first_column, $3) }
      ;


/* =========================
   EXPRESIONES
   ========================= */

EXPRESION
  : EXPR_TERN
  ;

/* Operador ternario ?:  (right-assoc) */
EXPR_TERN
  : EXPR_OR
  | EXPR_OR TK_q EXPR_TERN TK_colon EXPR_TERN
      { $$ = new Ternario(@2.first_line, @2.first_column, $1, $3, $5); }
  ;

/* OR */
EXPR_OR
  : EXPR_AND
  | EXPR_OR TK_or EXPR_AND           { $$ = new Logico(@2.first_line, @2.first_column, $1, $2, $3); }
  ;

/* AND */
EXPR_AND
  : EXPR_NOT
  | EXPR_AND TK_and EXPR_NOT         { $$ = new Logico(@2.first_line, @2.first_column, $1, $2, $3); }
  ;

/* NOT unario */
EXPR_NOT
  : EXPR_COMP
  | TK_not EXPR_NOT                  { $$ = new Logico(@1.first_line, @1.first_column, undefined, $1, $2); }
  ;

/* Comparaciones */
EXPR_COMP
  : EXPR_SUM
  | EXPR_SUM TK_igual  EXPR_SUM      { $$ = new Relacional(@2.first_line, @2.first_column, $1, $2, $3); }
  | EXPR_SUM TK_dif    EXPR_SUM      { $$ = new Relacional(@2.first_line, @2.first_column, $1, $2, $3); }
  | EXPR_SUM TK_mayor  EXPR_SUM      { $$ = new Relacional(@2.first_line, @2.first_column, $1, $2, $3); }
  | EXPR_SUM TK_mayorI EXPR_SUM      { $$ = new Relacional(@2.first_line, @2.first_column, $1, $2, $3); }
  | EXPR_SUM TK_menor  EXPR_SUM      { $$ = new Relacional(@2.first_line, @2.first_column, $1, $2, $3); }
  | EXPR_SUM TK_menorI EXPR_SUM      { $$ = new Relacional(@2.first_line, @2.first_column, $1, $2, $3); }
  ;

/* + y - */
EXPR_SUM
  : EXPR_MUL
  | EXPR_SUM TK_suma  EXPR_MUL       { $$ = new Aritmetico(@2.first_line, @2.first_column, $1, $2, $3); }
  | EXPR_SUM TK_resta EXPR_MUL       { $$ = new Aritmetico(@2.first_line, @2.first_column, $1, $2, $3); }
  ;

/* *, /, % */
EXPR_MUL
  : EXPR_POW
  | EXPR_MUL TK_mult EXPR_POW        { $$ = new Aritmetico(@2.first_line, @2.first_column, $1, $2, $3); }
  | EXPR_MUL TK_div  EXPR_POW        { $$ = new Aritmetico(@2.first_line, @2.first_column, $1, $2, $3); }
  | EXPR_MUL TK_mod  EXPR_POW        { $$ = new Aritmetico(@2.first_line, @2.first_column, $1, $2, $3); }
  ;

/* potencia (der-asoc) */
EXPR_POW
  : EXPR_UNARY
  | EXPR_UNARY TK_pot EXPR_POW       { $$ = new Aritmetico(@2.first_line, @2.first_column, $1, $2, $3); }
  ;

/* unarios y ++/-- en expresiones */
EXPR_UNARY
  : EXPR_PRIMARY
  | TK_resta EXPR_UNARY %prec TK_negacionUnaria { $$ = new Aritmetico(@1.first_line, @1.first_column, undefined, $1, $2); }
  | TK_id TK_inc                            { $$ = new IncDec(@1.first_line, @1.first_column, $1, 'inc', 'exp'); }
  | TK_id TK_dec                            { $$ = new IncDec(@1.first_line, @1.first_column, $1, 'dec', 'exp'); }
  | RW_incrementar TK_parA TK_id TK_parC    { $$ = new IncDec(@1.first_line, @1.first_column, $3, 'inc', 'exp'); }
  | RW_decrementar TK_parA TK_id TK_parC    { $$ = new IncDec(@1.first_line, @1.first_column, $3, 'dec', 'exp'); }
  ;

/* índices de vector: [expr] | [expr][expr] */
INDICES
  : TK_corA EXPRESION TK_corC
      { $$ = [$2]; }
  | TK_corA EXPRESION TK_corC TK_corA EXPRESION TK_corC
      { $$ = [$2, $5]; }
  ;

/* primarias y demás */
EXPR_PRIMARY
  : CASTEOS
  | PRIMITIVOS
  | LLAMAR_FUNCIONES
  | OBTENER_OBJETO
  | NATIVAS
  | VECTOR_LITERAL
  | TK_id INDICES                     { $$ = new AccesoVector(@1.first_line, @1.first_column, $1, $2); }
  | RW_tipo TK_parA EXPRESION TK_parC { $$ = new TipoD(@1.first_line, @1.first_column, $3); }
  | TK_id                             { $$ = new AccesoID(@1.first_line, @1.first_column, $1); }
  | RW_verdadero                      { $$ = new Primitivo(@1.first_line, @1.first_column, $1, Tipo.BOOLEANO); }
  | RW_falso                          { $$ = new Primitivo(@1.first_line, @1.first_column, $1, Tipo.BOOLEANO); }
  | TK_parA EXPRESION TK_parC         { $$ = $2; }
  ;

PRIMITIVOS 
      : TK_string  { $$ = new Primitivo(@1.first_line, @1.first_column, $1, Tipo.CADENA  ) }
      | TK_char    { $$ = new Primitivo(@1.first_line, @1.first_column, $1, Tipo.CARACTER) }
      | TK_double  { $$ = new Primitivo(@1.first_line, @1.first_column, $1, Tipo.DECIMAL ) }
      | TK_integer { $$ = new Primitivo(@1.first_line, @1.first_column, $1, Tipo.ENTERO  ) }
      ;

ARITMETICOS
      : EXPRESION TK_suma  EXPRESION { $$ = new Aritmetico(@1.first_line, @1.first_column, $1, $2, $3) }
      | EXPRESION TK_resta EXPRESION { $$ = new Aritmetico(@1.first_line, @1.first_column, $1, $2, $3) }
      | EXPRESION TK_mult  EXPRESION { $$ = new Aritmetico(@1.first_line, @1.first_column, $1, $2, $3) }
      | EXPRESION TK_div   EXPRESION { $$ = new Aritmetico(@1.first_line, @1.first_column, $1, $2, $3) }
      | EXPRESION TK_mod   EXPRESION { $$ = new Aritmetico(@1.first_line, @1.first_column, $1, $2, $3) }
      | EXPRESION TK_pot   EXPRESION { $$ = new Aritmetico(@1.first_line, @1.first_column, $1, $2, $3) }
      | TK_resta EXPRESION %prec TK_negacionUnaria { $$ = new Aritmetico(@1.first_line, @1.first_column, undefined, $1, $2) }
      ;

RELACIONALES 
      : EXPRESION TK_igual  EXPRESION { $$ = new Relacional(@1.first_line, @1.first_column, $1, $2, $3) }
      | EXPRESION TK_dif    EXPRESION { $$ = new Relacional(@1.first_line, @1.first_column, $1, $2, $3) }
      | EXPRESION TK_mayor  EXPRESION { $$ = new Relacional(@1.first_line, @1.first_column, $1, $2, $3) }
      | EXPRESION TK_menor  EXPRESION { $$ = new Relacional(@1.first_line, @1.first_column, $1, $2, $3) }
      | EXPRESION TK_mayorI EXPRESION { $$ = new Relacional(@1.first_line, @1.first_column, $1, $2, $3) }
      | EXPRESION TK_menorI EXPRESION { $$ = new Relacional(@1.first_line, @1.first_column, $1, $2, $3) }
      ;

LOGICOS
      : EXPRESION TK_and EXPRESION { $$ = new Logico(@1.first_line, @1.first_column, $1, $2, $3) }
      | EXPRESION TK_or  EXPRESION { $$ = new Logico(@1.first_line, @1.first_column, $1, $2, $3) }
      | TK_not EXPRESION           { $$ = new Logico(@1.first_line, @1.first_column, undefined, $1, $2) }
      ;

TIPO      
      : RW_char     { $$ = Tipo.CARACTER }
      | RW_cadena   { $$ = Tipo.CADENA   }
      | RW_entero   { $$ = Tipo.ENTERO   }
      | RW_booleano { $$ = Tipo.BOOLEANO }
      | RW_decimal  { $$ = Tipo.DECIMAL  }
      ;
