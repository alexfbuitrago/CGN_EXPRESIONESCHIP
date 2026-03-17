import React, { useState, useEffect } from 'react';
import { CONTEXT_VARS } from '../constants';
import { Play, Save, Code2, Database, TerminalSquare, FileText, ArrowRightLeft, LayoutTemplate, ChevronDown, ChevronRight, Folder } from 'lucide-react';

// Categorized Templates based on CHIP Business Logic (Source: CSV)
const BUSINESS_LOGIC_TEMPLATES = [
  {
    category: "K70 - Convergencia (Reglas Contables)",
    rules: [
      {
        name: 'PROC1905 - Cálculo Saldo Final',
        desc: 'Validación aritmética: Inicial + Débitos - Créditos = Final',
        code: `// PROC1905: CÁLCULO SALDO FINAL
// Categoría: K70 - Convergencia
// Descripción: Calcula el saldo final sumando el saldo inicial más movimientos.

num saldo_calculado = saldo_inicial + mov_debito - mov_credito;

// Validación aritmética de la cuenta
if (saldo_final != saldo_calculado) {
    GENERAR_DEFICIENCIA(
        "PROC1905",
        "Error Aritmético: El saldo final reportado (" + saldo_final + ") no coincide con el cálculo (" + saldo_calculado + ")",
        SEVERIDAD_BLOQUEANTE // Mensaje NO PERMISIBLE
    );
}`
      },
      {
        name: 'PROC1960 - Partida Doble',
        desc: 'La suma de débitos debe ser igual a la suma de créditos',
        code: `// PROC1960: SUMA DE DEBITOS IGUAL A SUMA DE CREDITOS
// Categoría: K70 - Convergencia

num total_debito = 0;
num total_credito = 0;

foreach (mov in formulario.movimientos) {
    total_debito = total_debito + mov.valor_debito;
    total_credito = total_credito + mov.valor_credito;
}

if (total_debito != total_credito) {
    num diferencia = abs(total_debito - total_credito);
    GENERAR_DEFICIENCIA(
        "PROC1960",
        "Partida Doble Incorrecta. Diferencia: " + diferencia,
        SEVERIDAD_BLOQUEANTE // Mensaje NO PERMISIBLE
    );
}`
      },
      {
        name: 'PROC1913 - Restricción Patrimonio Recíprocas',
        desc: 'Cuentas de patrimonio (Clase 3) no deben reportarse en recíprocas',
        code: `// PROC1913: CUENTAS PATRIMONIO
// Categoría: K70 - Convergencia

foreach (op in formulario_reciprocas.detalles) {
    // Extraer el primer dígito de la cuenta contable
    string clase_cuenta = SUB_CADENA(op.cuenta_contable, 0, 1);
    
    // Clase 3 corresponde a Patrimonio
    if (clase_cuenta == "3") {
        GENERAR_DEFICIENCIA(
            "PROC1913", 
            "La cuenta de patrimonio " + op.cuenta_contable + " no debe ser usada en operaciones recíprocas.",
            SEVERIDAD_CRITICA
        );
    }
}`
      },
      {
        name: 'PROC1918 - Restricción Uso Cuentas',
        desc: 'Uso exclusivo de cuentas 1.4.10 y 2.4.20 para entidad específica',
        code: `// PROC1918: RESTRICCION USO EXCLUSIVO CUENTA 1.4.10 Y 2.4.20
// Categoría: K70 - Convergencia

string codigo_entidad = CONTEXTO.ENTIDAD.CODIGO;
string ENTIDAD_AUTORIZADA = "41300000"; 

foreach (cuenta in formulario.saldos) {
    if (cuenta.codigo == "1.4.10" || cuenta.codigo == "2.4.20") {
        if (codigo_entidad != ENTIDAD_AUTORIZADA) {
             GENERAR_DEFICIENCIA(
                "PROC1918",
                "La cuenta " + cuenta.codigo + " es de uso exclusivo para la entidad " + ENTIDAD_AUTORIZADA,
                SEVERIDAD_ALTA
            );
        }
    }
}`
      },
      {
        name: 'PROC1924 - Control Clase 9 (Cero)',
        desc: 'Valida que la clase 9 (Cuentas de Orden) sea igual a cero',
        code: `// PROC1924: CONTROLA CLASE 9 IGUAL A CERO
// Categoría: K70 - Convergencia

foreach (cuenta in formulario.saldos) {
    // Verifica si la cuenta empieza por '9'
    if (STARTS_WITH(cuenta.codigo, "9")) {
        if (cuenta.saldo_final != 0) {
             GENERAR_DEFICIENCIA(
                "PROC1924",
                "Las cuentas de orden acreedoras (Clase 9) deben reportarse en cero. Valor reportado: " + cuenta.saldo_final,
                SEVERIDAD_MEDIA
            );
        }
    }
}`
      },
      {
        name: 'PROC2316 - Consistencia Histórica',
        desc: 'Saldo Inicial debe ser igual al Saldo Final del periodo anterior',
        code: `// PROC2316: SALDO INICIAL VS SALDO FINAL ANTERIOR
// Categoría: K70 - Convergencia

foreach (cuenta in formulario.saldos) {
    // Consulta dinámica al histórico (Característica UPL 2.0)
    var saldo_anterior = QUERY_DATA(
        'CGN2015_001', 
        PERIODO: ANTERIOR,
        FILTRO: "CODIGO = '" + cuenta.codigo + "'"
    ).saldo_final;

    // Manejo de nulos (si es cuenta nueva, asumimos 0)
    if (saldo_anterior == NULL) {
        saldo_anterior = 0;
    }

    if (cuenta.saldo_inicial != saldo_anterior) {
        GENERAR_DEFICIENCIA(
            "PROC2316",
            "Inconsistencia Histórica: Cuenta " + cuenta.codigo + ". Inicial reportado (" + cuenta.saldo_inicial + ") != Final anterior (" + saldo_anterior + ")",
            SEVERIDAD_BLOQUEANTE // Mensaje NO PERMISIBLE
        );
    }
}`
      },
      {
        name: 'PROC2809 - Variaciones Significativas',
        desc: 'Detectar variaciones > 30.000M y > 2% participación',
        code: `// PROC2809: VARIACIONES TRIMESTRALES SIGNIFICATIVAS
// Categoría: K70 - Convergencia

num UMBRAL_MONTO = 30000000000; // 30 mil millones
num UMBRAL_PORCENTAJE = 0.02;   // 2%

foreach (var in formulario.variaciones) {
    num flujo_absoluto = abs(var.saldo_actual - var.saldo_anterior);
    
    // Función personalizada para obtener el total de la clase
    num variacion_total_clase = GET_TOTAL_VARIACION(SUB_CADENA(var.codigo, 0, 1));
    
    bool supera_monto = flujo_absoluto > UMBRAL_MONTO;
    bool supera_porc = (flujo_absoluto / variacion_total_clase) > UMBRAL_PORCENTAJE;

    if (supera_monto && supera_porc) {
        // Obligatoriedad de justificación
        if (IS_EMPTY(var.justificacion)) {
             GENERAR_DEFICIENCIA(
                "PROC2809",
                "Variación Significativa sin justificar en cuenta " + var.codigo + ". Variación: " + flujo_absoluto,
                SEVERIDAD_ADVERTENCIA // Mensaje PERMISIBLE (no impide envío, pero genera alerta)
            );
        }
    }
}`
      },
      {
        name: 'PROC1975 - Ecuación Patrimonial',
        desc: 'Activo = Pasivo + Patrimonio (Patrimonios Autónomos)',
        code: `// PROC1975: ECUACION CONTABLE PATRIMONIOS AUTONOMOS
// Categoría: K70 - Convergencia

num activo = 0;
num pasivo = 0;
num patrimonio = 0;

foreach (cta in formulario.saldos) {
    string clase = SUB_CADENA(cta.codigo, 0, 1);
    if (clase == "1") activo = activo + cta.saldo_final;
    if (clase == "2") pasivo = pasivo + cta.saldo_final;
    if (clase == "3") patrimonio = patrimonio + cta.saldo_final;
}

if (activo != (pasivo + patrimonio)) {
    GENERAR_DEFICIENCIA(
        "PROC1975",
        "Ecuación Patrimonial Descuadrada: Activo (" + activo + ") != Pasivo + Patrimonio (" + (pasivo+patrimonio) + ")",
        SEVERIDAD_BLOQUEANTE // Mensaje NO PERMISIBLE
    );
}`
      }
    ]
  },
  {
    category: "K90 - Evaluación Control (Reglas Negocio)",
    rules: [
      {
        name: 'PROC2176 - Control Completitud',
        desc: 'El formulario debe estar completamente diligenciado',
        code: `// PROC2176: CONTROL VACIO
// Categoría: K90 - Evaluación Control Interno

foreach (pregunta in formulario.preguntas) {
    // Verifica si la respuesta es nula o vacía
    if (IS_EMPTY(pregunta.respuesta)) {
        GENERAR_DEFICIENCIA(
            "M4040",
            "Pregunta sin responder: " + pregunta.id,
            SEVERIDAD_BLOQUEANTE
        );
    }
}`
      },
      {
        name: 'PROC2177 - Cálculo Calificación',
        desc: 'Cálculo de puntaje final (Promedio * 5) y rango',
        code: `// PROC2177: CALIFICACIÓN DE LA EVALUACIÓN
// Categoría: K90 - Evaluación Control Interno

num suma_total = 0;
num num_criterios = 32; // Total criterios evaluados

foreach (criterio in formulario.criterios) {
    suma_total = suma_total + criterio.calificacion_numerica;
}

// Fórmula estándar CHIP
num resultado_final = (suma_total / num_criterios) * 5;

// Asignación de concepto cualitativo
if (resultado_final >= 1 && resultado_final < 3) {
    formulario.encabezado.concepto = "DEFICIENTE";
} else if (resultado_final >= 3 && resultado_final <= 3.9) {
    formulario.encabezado.concepto = "ADECUADO";
} else if (resultado_final >= 4 && resultado_final <= 5) {
    formulario.encabezado.concepto = "EFICIENTE";
} else {
    GENERAR_DEFICIENCIA("PROC2177", "Cálculo fuera de rango: " + resultado_final, SEVERIDAD_ALTA);
}`
      },
      {
        name: 'PROC2180 - Lógica Existencia vs Efectividad',
        desc: 'Si no existe control (NO), no se puede evaluar efectividad',
        code: `// PROC2180: RESTRICCION PREGUNTAS EFECTIVIDAD
// Categoría: K90 - Evaluación Control Interno

foreach (criterio in formulario.criterios) {
    // Si la respuesta a Existencia es NO...
    if (criterio.existencia == "NO") {
        // ... la efectividad no puede ser SI o PARCIAL
        if (criterio.efectividad == "SI" || criterio.efectividad == "PARCIAL") {
            GENERAR_DEFICIENCIA(
                "PROC2180",
                "Inconsistencia en criterio " + criterio.id + ": No puede calificar efectividad positiva si el control NO existe.",
                SEVERIDAD_BLOQUEANTE
            );
        }
    }
}`
      }
    ]
  },
  {
      category: "Validaciones Cruzadas (Recíprocas)",
      rules: [
          {
              name: 'CRUCE_SICODIS - SGP Educación',
              desc: 'Compara saldo contable vs asignación SICODIS',
              code: `// CRUCE SICODIS (Sistema General de Participaciones)
// Validación de recursos de educación

// 1. Obtener valor girado según SICODIS
num giro_sicodis = CONSULTAR_SICODIS('EDUCACION');

// 2. Obtener saldo contable de la cuenta asociada (SGP Educación)
num saldo_contable = SUMA(formulario.saldos_sgp_educacion);

// 3. Validar consistencia
if (saldo_contable != giro_sicodis) {
    GENERAR_DEFICIENCIA(
        "CRUCE_SGP_01", 
        "El saldo contable (" + saldo_contable + ") no coincide con el giro SICODIS (" + giro_sicodis + ")",
        SEVERIDAD_ADVERTENCIA // Mensaje PERMISIBLE (Advertencia)
    );
}`
          },
          {
              name: 'CRUCE_ADRES - Giros Salud',
              desc: 'Compara valores girados por ADRES con registro contable',
              code: `// CRUCE ADRES (Recursos de Salud)

foreach (giro in formulario.giros_salud) {
    // Obtener giro confirmado por ADRES
    num valor_adres = CONSULTAR_ADRES(giro.concepto_adres);
    
    if (giro.valor_registrado != valor_adres) {
        GENERAR_DEFICIENCIA(
            "CRUCE_ADRES_05",
            "Diferencia en giro " + giro.concepto + ". Reportado: " + giro.valor_registrado + " vs ADRES: " + valor_adres,
            SEVERIDAD_ADVERTENCIA // Mensaje PERMISIBLE
        );
    }
}`
          },
          {
              name: 'CRUCE_SGRP - Regalías',
              desc: 'Validación contra Sistema de Presupuesto y Giro de Regalías',
              code: `// CRUCE SGRP (Sistema General de Regalías)
// Validar ejecución de proyectos BPIN

foreach (proyecto in formulario.proyectos_inversion) {
    num giro_sgrp = CONSULTAR_SGRP(proyecto.codigo_bpin);
    
    if (proyecto.ejecucion_acumulada > giro_sgrp) {
        GENERAR_DEFICIENCIA(
            "CRUCE_SGRP_02",
            "La ejecución reportada supera el giro de regalías registrado en SGRP para el BPIN " + proyecto.codigo_bpin,
            SEVERIDAD_BLOQUEANTE // Mensaje NO PERMISIBLE
        );
    }
}`
          },
          {
              name: 'CRUCE_AGRARIO - Banco Agrario',
              desc: 'Conciliación de saldos con Banco Agrario',
              code: `// CRUCE BANCO AGRARIO
// Validar saldos en bancos

foreach (cuenta in formulario.cuentas_bancarias) {
    // Validar solo cuentas del Banco Agrario
    if (cuenta.banco == "BANCO_AGRARIO") {
        num saldo_extracto = CONSULTAR_BANCO_AGRARIO(cuenta.numero_cuenta);
        
        if (cuenta.saldo_libros != saldo_extracto) {
             GENERAR_DEFICIENCIA(
                "CRUCE_BANCO_01",
                "El saldo en libros no coincide con el reportado por Banco Agrario para la cuenta " + cuenta.numero_cuenta,
                SEVERIDAD_ADVERTENCIA // Mensaje PERMISIBLE
            );
        }
    }
}`
          }
      ]
  }
];

// Technical Reference Templates based on 18 points (Unchanged structure)
const TECHNICAL_REF_TEMPLATES = [
  {
    category: "1. Asignación y Declaración",
    rules: [
      { name: "Asignación Simple", desc: "Uso de = en lugar de :=", code: `// Asignación simple
num total = 0;
string nombre = "Activo";` },
      { name: "Declaración Tipada", desc: "Tipos explícitos (num, string)", code: `num saldo;
bool es_valido = true;
date fecha_corte;` }
    ]
  },
  {
    category: "2. Constantes y Nulos",
    rules: [
      { name: "Manejo de Nulos", desc: "Uso de NULL estándar", code: `if (variable == NULL) {
    variable = 0;
}` }
    ]
  },
  {
    category: "3. Iteración y Bucles",
    rules: [
      { name: "Bucle Foreach", desc: "Iterar sobre colecciones", code: `foreach (item in lista_cuentas) {
    total = total + item.saldo;
}` },
      { name: "Bucle While", desc: "Iteración condicional", code: `num contador = 0;
while (contador < 10) {
    contador = contador + 1;
}` }
    ]
  },
  {
    category: "4. Estructuras de Control",
    rules: [
      { name: "Switch / Case", desc: "Condicional múltiple", code: `switch (tipo_entidad) {
    case "A": procesar_a(); break;
    case "B": procesar_b(); break;
    default: error("Tipo desconocido");
}` },
      { name: "If / Else If", desc: "Condicional anidado", code: `if (valor > 100) {
    // Alto
} else if (valor > 50) {
    // Medio
} else {
    // Bajo
}` }
    ]
  },
  {
    category: "5. Acceso a Datos",
    rules: [
      { name: "Acceso a Propiedades", desc: "Notación de punto", code: `num saldo = formulario.cuenta.saldo_final;` },
      { name: "Filtro de Detalles", desc: "Acceso con filtro", code: `var detalles_filtrados = formulario.detalles.filter(d => d.valor > 0);` }
    ]
  },
  {
    category: "6. Contexto y Validaciones",
    rules: [
      { name: "Uso de Contexto", desc: "Metadatos de entidad", code: `if (CONTEXTO.ENTIDAD.CODIGO == "41300000") {
    // Lógica específica
}` },
      { name: "Registro Deficiencia", desc: "Reportar error", code: `GENERAR_DEFICIENCIA(
    "E001", 
    "El valor no cruza", 
    SEVERIDAD_BLOQUEANTE
);` },
      { name: "Excepciones", desc: "Try / Catch", code: `INTENTAR {
    ratio = a / b;
} CAPTURAR {
    log("Error de cálculo");
}` }
    ]
  },
  {
    category: "7. Funciones Avanzadas",
    rules: [
      { name: "Fechas", desc: "Diferencia y adición", code: `num dias = DIFERENCIA_DIAS(fecha_ini, fecha_fin);` },
      { name: "Cadenas", desc: "Subcadena y formato", code: `string codigo = SUB_CADENA(cuenta, 0, 4);
string mayus = MAYUSCULAS(texto);` },
      { name: "Históricos", desc: "Query Data", code: `var saldo_anterior = QUERY_DATA(
    'SALDOS', 
    PERIODO: ANTERIOR
);` },
      { name: "Listas", desc: "Validar pertenencia", code: `if (IS_MEMBER_OF(entidad, 'LISTA_EXCLUIDAS')) {
    return;
}` }
    ]
  }
];

const CodeEditor: React.FC = () => {
  const [code, setCode] = useState(BUSINESS_LOGIC_TEMPLATES[0].rules[0].code);
  const [pythonCode, setPythonCode] = useState('');
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  
  // Accordion states
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
      "K70 - Convergencia (Reglas Contables)": true,
      "K90 - Evaluación Control (Reglas Negocio)": true,
      "Validaciones Cruzadas (Recíprocas)": true
  });
  
  // Accordion state for context variables
  const [expandedContext, setExpandedContext] = useState<Record<string, boolean>>({
      "Contexto Global (Sistema)": true,
      "K70 - Convergencia (Formularios)": false
  });

  const [activeTab, setActiveTab] = useState<'business' | 'tech'>('business');

  // Regex-based Transpiler for Prototype
  useEffect(() => {
    let py = code;
    
    // Comments
    py = py.replace(/\/\//g, '#');
    
    // Variables definition
    py = py.replace(/num\s+(\w+)\s*=/g, '$1: float =');
    py = py.replace(/string\s+(\w+)\s*=/g, '$1: str =');
    py = py.replace(/bool\s+(\w+)\s*=/g, '$1: bool =');
    py = py.replace(/date\s+(\w+)\s*=/g, '$1: date =');
    py = py.replace(/var\s+(\w+)\s*=/g, '$1 =');
    
    // Semicolons removal
    py = py.replace(/;/g, '');
    
    // Logic Operators
    py = py.replace(/&&/g, 'and');
    py = py.replace(/\|\|/g, 'or');
    py = py.replace(/!/g, 'not ');
    py = py.replace(/NULL/g, 'None');
    
    // Structure: else if -> elif
    py = py.replace(/}\s*else\s+if\s*\((.*?)\)\s*\{/g, 'elif $1:');
    py = py.replace(/else\s+if\s*\((.*?)\)\s*\{/g, 'elif $1:'); 

    // Structure: if/else/foreach/while/switch
    py = py.replace(/foreach\s*\((.*?)\s+in\s+(.*?)\)\s*\{/g, 'for $1 in $2:');
    py = py.replace(/while\s*\((.*?)\)\s*\{/g, 'while $1:');
    py = py.replace(/if\s*\((.*?)\)\s*\{/g, 'if $1:');
    py = py.replace(/}\s*else\s*\{/g, 'else:');
    py = py.replace(/else\s*\{/g, 'else:');
    py = py.replace(/switch\s*\((.*?)\)\s*\{/g, 'match $1:');
    py = py.replace(/case\s+(.*?):/g, 'case $1:');
    py = py.replace(/default:/g, 'case _:');
    py = py.replace(/break;/g, '');

    // Try Catch
    py = py.replace(/INTENTAR\s*\{/g, 'try:');
    py = py.replace(/}\s*CAPTURAR\s*\{/g, 'except Exception:');
    
    // Cleanup braces
    py = py.replace(/\}\s*$/gm, ''); 
    py = py.replace(/\}/g, ''); 
    
    // Functions mapping (Enhanced)
    py = py.replace(/QUERY_DATA/g, 'query_data');
    py = py.replace(/GENERAR_DEFICIENCIA/g, 'context.report_issue');
    py = py.replace(/IS_EMPTY/g, 'is_empty');
    py = py.replace(/IS_MEMBER_OF/g, 'is_member_of');
    py = py.replace(/DIFERENCIA_DIAS/g, 'date_diff');
    py = py.replace(/SUB_CADENA\((.*?),\s*(.*?),\s*(.*?)\)/g, '$1[$2:$2+$3]'); // substring mapping
    py = py.replace(/STARTS_WITH\((.*?),\s*(.*?)\)/g, '$1.startswith($2)');
    py = py.replace(/abs\(/g, 'abs(');
    py = py.replace(/MAYUSCULAS/g, 'to_upper');
    py = py.replace(/SEVERIDAD_(\w+)/g, 'Severity.$1');
    py = py.replace(/CONTEXTO\./g, 'context.');
    py = py.replace(/GET_TOTAL_VARIACION/g, 'get_total_variation');
    py = py.replace(/SUMA\((.*?)\)/g, 'sum($1)');
    py = py.replace(/CONSULTAR_SICODIS\((.*?)\)/g, 'external_services.sicodis.get_sgp_value($1)');
    py = py.replace(/CONSULTAR_SGRP\((.*?)\)/g, 'external_services.sgrp.get_project_value($1)');
    py = py.replace(/CONSULTAR_ADRES\((.*?)\)/g, 'external_services.adres.get_transfer($1)');
    py = py.replace(/CONSULTAR_BANCO_AGRARIO\((.*?)\)/g, 'external_services.agrario.get_balance($1)');
    
    // Indentation Helper (Naive)
    const lines = py.split('\n');
    let indent = 0;
    const indentedLines = lines.map(line => {
      let trimmed = line.trim();
      if (!trimmed) return '';
      
      // Decrease indent for else/elif/except
      if (trimmed.startsWith('else:') || trimmed.startsWith('elif') || trimmed.startsWith('except') || trimmed.startsWith('case')) {
          indent = Math.max(0, indent - 1);
      }
      
      const str = '    '.repeat(indent) + trimmed;
      
      // Increase indent after colon
      if (trimmed.endsWith(':')) {
        indent++;
      }
      
      return str;
    });

    setPythonCode(indentedLines.join('\n'));
  }, [code]);

  const handleRun = () => {
    setIsRunning(true);
    setOutput(['Compilando regla...', 'Transpilando a Python 3.10...', 'Ejecutando validación en sandbox...']);
    
    setTimeout(() => {
      setOutput(prev => [
        ...prev, 
        '✓ Motor UPL 2.0: OK',
        '✓ Motor Python: OK',
        '> Analizando registros...',
        '[INFO] Validación completada sin errores.',
        'Tiempo de ejecución: 0.04s'
      ]);
      setIsRunning(false);
    }, 1500);
  };

  const loadTemplate = (templateCode: string) => {
    setCode(templateCode);
    setOutput([]);
  };

  const insertVariable = (name: string) => {
    setCode(prev => prev + `\n${name}`);
  };

  const toggleCategory = (cat: string) => {
      setExpandedCategories(prev => ({...prev, [cat]: !prev[cat]}));
  };

  const toggleContext = (cat: string) => {
      setExpandedContext(prev => ({...prev, [cat]: !prev[cat]}));
  };

  const activeTemplates = activeTab === 'business' ? BUSINESS_LOGIC_TEMPLATES : TECHNICAL_REF_TEMPLATES;

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-slate-100">
        {/* IDE Header */}
      <div className="bg-white border-b border-[#2E7D32] px-6 py-3 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-[#2E7D32] flex items-center gap-2">
                <Code2 className="text-[#FF9800]" size={24} />
                Editor Avanzado de Reglas
            </h2>
            <div className="flex bg-slate-100 rounded-lg p-1 border border-slate-200">
                <button className="px-3 py-1 text-xs font-bold text-white bg-[#2E7D32] rounded shadow-sm">UPL 2.0</button>
                <button className="px-3 py-1 text-xs font-medium text-slate-500 hover:text-slate-700 flex items-center gap-1">
                    <ArrowRightLeft size={10} /> Python
                </button>
            </div>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={handleRun}
                disabled={isRunning}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isRunning ? 'bg-slate-300 text-slate-500' : 'bg-[#2E7D32] text-white hover:bg-green-900 shadow-sm'
                }`}
            >
                <Play size={16} fill={isRunning ? "none" : "currentColor"} />
                {isRunning ? 'Procesando...' : 'Ejecutar'}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-[#2E7D32] rounded-lg text-sm font-medium hover:bg-slate-50">
                <Save size={16} />
                Guardar
            </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Assets */}
        <div className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-hidden">
            {/* Tabs for Sidebar */}
            <div className="flex border-b border-slate-200">
                <button 
                    onClick={() => setActiveTab('business')}
                    className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-colors ${activeTab === 'business' ? 'border-[#FF9800] text-[#2E7D32] bg-slate-50' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    Reglas Negocio
                </button>
                <button 
                    onClick={() => setActiveTab('tech')}
                    className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-colors ${activeTab === 'tech' ? 'border-[#FF9800] text-[#2E7D32] bg-slate-50' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    Ref. Técnica
                </button>
            </div>

            <div className="p-3 border-b border-slate-100 bg-slate-50">
                <h3 className="text-xs font-black text-[#2E7D32] uppercase tracking-wider mb-1 flex items-center gap-2">
                    <LayoutTemplate size={14} /> 
                    {activeTab === 'business' ? 'Plantillas K70/K90' : 'Snippets UPL'}
                </h3>
            </div>
            
            <div className="overflow-y-auto flex-1 border-b border-slate-200 custom-scrollbar">
                 {activeTemplates.map((cat, i) => (
                    <div key={i} className="border-b border-slate-100">
                        <button 
                            onClick={() => toggleCategory(cat.category)}
                            className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wide"
                        >
                            {expandedCategories[cat.category] ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
                            <span className="truncate">{cat.category}</span>
                        </button>
                        
                        {expandedCategories[cat.category] && (
                            <div>
                                {cat.rules.map((rule, j) => (
                                    <button 
                                        key={j}
                                        onClick={() => loadTemplate(rule.code)}
                                        className="w-full text-left px-8 py-2 hover:bg-green-50 transition-colors group relative border-l-4 border-transparent hover:border-[#FF9800]"
                                    >
                                        <div className="text-sm font-semibold text-slate-700 group-hover:text-[#2E7D32] truncate">
                                            {rule.name}
                                        </div>
                                        <div className="text-[10px] text-slate-400 mt-0.5 truncate">{rule.desc}</div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                 ))}
            </div>

            <div className="h-1/3 flex flex-col border-t border-slate-200 bg-white">
                <div className="p-3 border-b border-slate-100 bg-slate-50">
                    <h3 className="text-xs font-black text-[#2E7D32] uppercase tracking-wider mb-1 flex items-center gap-2">
                        <Database size={14} /> Variables Contexto
                    </h3>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {CONTEXT_VARS.map((group, idx) => (
                        <div key={idx} className="border-b border-slate-100">
                            <button
                                onClick={() => toggleContext(group.category)}
                                className="w-full text-left px-4 py-2 bg-white hover:bg-slate-50 flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wide"
                            >
                                <Folder size={12} className="text-[#FF9800]"/>
                                {expandedContext[group.category] ? <ChevronDown size={12}/> : <ChevronRight size={12}/>}
                                <span className="truncate">{group.category}</span>
                            </button>
                            
                            {expandedContext[group.category] && (
                                <div className="bg-slate-50 pb-2">
                                    {group.items.map((item, i) => (
                                        <button 
                                            key={i}
                                            onClick={() => insertVariable(item.name)}
                                            className="w-full text-left pl-8 pr-3 py-1.5 hover:bg-green-50 group transition-colors flex justify-between items-center"
                                        >
                                            <div className="text-xs font-mono text-slate-600 font-medium group-hover:text-[#2E7D32] truncate">
                                                {item.name}
                                            </div>
                                            <span className="text-[9px] text-slate-400 border border-slate-200 rounded px-1 group-hover:bg-white">{item.type}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Main Editor Area (Split) */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-800">
            {/* Split View */}
            <div className="flex-1 flex min-h-0">
                {/* UPL 2.0 Editor */}
                <div className="w-1/2 flex flex-col border-r border-slate-600">
                     <div className="bg-white px-4 py-2 flex items-center justify-between border-b border-slate-200 border-l-4 border-l-[#2E7D32]">
                         <span className="text-xs text-[#2E7D32] font-bold font-mono flex items-center gap-2">
                            <FileText size={12} className="text-[#2E7D32]" /> regla_negocio.upl
                         </span>
                         <span className="text-[10px] text-slate-400 uppercase font-bold">Editando</span>
                     </div>
                     <textarea
                        spellCheck={false}
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="flex-1 bg-white text-slate-800 p-6 resize-none focus:outline-none leading-relaxed font-mono text-sm custom-scrollbar border-r border-slate-200"
                    />
                </div>
                
                {/* Python Preview */}
                <div className="w-1/2 flex flex-col bg-slate-50">
                    <div className="bg-white px-4 py-2 flex items-center justify-between border-b border-slate-200 border-l-4 border-l-[#FF9800]">
                         <span className="text-xs text-[#E65100] font-bold font-mono flex items-center gap-2">
                            <Code2 size={12} className="text-[#E65100]" /> generada_auto.py
                         </span>
                         <span className="text-[10px] text-white bg-[#E65100] px-2 py-0.5 rounded font-bold">Vista Previa</span>
                     </div>
                     <pre className="flex-1 p-6 font-mono text-sm text-slate-600 leading-relaxed overflow-auto custom-scrollbar bg-slate-50">
                         {pythonCode}
                     </pre>
                </div>
            </div>

            {/* Output Console */}
            <div className="h-40 bg-slate-900 border-t border-slate-700 flex flex-col shrink-0">
                <div className="px-4 py-2 bg-slate-800 flex justify-between items-center border-t border-slate-700">
                    <span className="text-xs text-slate-300 font-bold flex items-center gap-2 uppercase tracking-wide">
                        <TerminalSquare size={14} />
                        Consola de Salida
                    </span>
                    <button 
                        onClick={() => setOutput([])}
                        className="text-[10px] text-slate-400 hover:text-white uppercase font-bold"
                    >
                        Limpiar
                    </button>
                </div>
                <div className="flex-1 p-4 font-mono text-xs overflow-y-auto custom-scrollbar">
                    {output.length === 0 ? (
                        <span className="text-slate-500 italic">...</span>
                    ) : (
                        output.map((line, i) => (
                            <div key={i} className={`mb-1 ${
                                line.includes('Error') || line.includes('Inconsistencia') ? 'text-red-400 font-bold' : 
                                line.includes('WARNING') ? 'text-yellow-400' : 
                                line.includes('✓') ? 'text-green-400 font-bold' : 'text-slate-300'
                            }`}>
                                {line}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;