import React, { useState } from 'react';
import { GripVertical, X, Code2, Copy, Puzzle, Calculator, FunctionSquare, Repeat, ListFilter, Trash2, HelpCircle, Sigma, AlertCircle, CalendarClock, BookOpen, ChevronDown, Database, ShieldCheck, Globe, Building2, Stethoscope, Landmark, FileBarChart, Layers } from 'lucide-react';

// Block Definitions
type BlockType = 
  | 'VAR_DECL' 
  | 'ASSIGNMENT' 
  | 'MATH'
  | 'STATISTICS'
  | 'NULL_HANDLING'
  | 'IF' 
  | 'SWITCH' 
  | 'FOREACH' 
  | 'WHILE'
  | 'FUNC_DEF' 
  | 'FUNC_CALL'
  | 'ERROR' 
  | 'QUERY_DATA' 
  | 'TRY_CATCH' 
  | 'CONTEXT_CHECK'
  | 'GET_CONTEXT'
  | 'IS_MEMBER_OF'
  | 'UPL_DATE_DIFF'
  | 'UPL_ADD_MONTHS'
  | 'CHECK_SICODIS'
  | 'CHECK_SGRP'
  | 'CHECK_ADRES'
  | 'CHECK_AGRARIO'
  | 'CHECK_CUIPO'
  | 'CHECK_GENERIC';

interface BlockData {
  id: string;
  type: BlockType;
  params: Record<string, string>;
  children?: BlockData[];
}

interface BlockDef {
  type: BlockType;
  label: string;
  category: 'Datos' | 'Matemáticas' | 'Estadísticas' | 'Lógica de Control' | 'Utilidades UPL' | 'Integraciones Externas' | 'Validaciones';
  color: string;
  textColor?: string;
  icon?: React.ElementType;
  defaultParams: Record<string, string>;
  paramConfig?: Record<string, { type: 'text' | 'select', options?: string[] }>;
  tooltip: string;
}

interface Example {
    id: string;
    name: string;
    description: string;
    blocks: BlockData[];
}

const BLOCK_DEFS: BlockDef[] = [
  // DATOS
  { 
    type: 'VAR_DECL', 
    label: 'Declarar Variable', 
    category: 'Datos', 
    color: 'bg-emerald-700', 
    defaultParams: { name: 'saldo', type: 'num', value: '0' },
    paramConfig: { type: { type: 'select', options: ['num', 'string', 'bool', 'date'] } },
    tooltip: 'Crea una nueva variable con un tipo de dato específico (numérico, texto, etc.)'
  },
  { 
    type: 'ASSIGNMENT', 
    label: 'Asignar Valor', 
    category: 'Datos', 
    color: 'bg-emerald-600', 
    defaultParams: { target: 'saldo', value: '100' },
    tooltip: 'Actualiza el valor de una variable existente.'
  },
  { 
    type: 'GET_CONTEXT', 
    label: 'Obtener Contexto', 
    category: 'Datos', 
    color: 'bg-emerald-800', 
    icon: Database,
    defaultParams: { target: 'cod_entidad', property: 'ENTIDAD.CODIGO' },
    paramConfig: { property: { type: 'select', options: ['ENTIDAD.CODIGO', 'ENTIDAD.TIPO', 'PERIODO.ANIO', 'PERIODO.CORTE'] } },
    tooltip: 'Accede a metadatos del Objeto de Contexto Unificado (Entidad, Periodo).'
  },
  { 
    type: 'QUERY_DATA', 
    label: 'Consulta Histórica', 
    category: 'Datos', 
    color: 'bg-teal-700', 
    defaultParams: { concept: 'SALDO', period: 'ANTERIOR' },
    tooltip: 'Recupera datos de formularios de periodos anteriores para comparar tendencias.'
  },

  // MATEMÁTICAS
  { 
    type: 'MATH', 
    label: 'Operación Matemática', 
    category: 'Matemáticas', 
    color: 'bg-[#2E7D32]', 
    icon: Calculator,
    defaultParams: { target: 'resultado', expression: '0' },
    tooltip: 'Realiza cálculos aritméticos básicos y avanzados (+, -, *, /, ^, Mod).'
  },

  // ESTADÍSTICAS
  {
    type: 'STATISTICS',
    label: 'Función Estadística',
    category: 'Estadísticas',
    color: 'bg-[#1B5E20]',
    icon: Sigma,
    defaultParams: { func: 'PROMEDIO', collection: 'valores', target: 'res' },
    paramConfig: { func: { type: 'select', options: ['PROMEDIO', 'MEDIANA', 'DESVEST', 'MAX', 'MIN', 'SUMA'] } },
    tooltip: 'Funciones estadísticas sobre colecciones de datos.'
  },
  {
    type: 'NULL_HANDLING',
    label: 'Gestión de Nulos',
    category: 'Estadísticas',
    color: 'bg-slate-600',
    icon: AlertCircle,
    defaultParams: { action: 'NVL', target: 'var', fallback: '0' },
    paramConfig: { action: { type: 'select', options: ['NVL', 'ES_NULO'] } },
    tooltip: 'Gestión de valores nulos o vacíos.'
  },

  // LÓGICA DE CONTROL
  { 
    type: 'IF', 
    label: 'Condicional (SI)', 
    category: 'Lógica de Control', 
    color: 'bg-green-700', 
    defaultParams: { condition: 'total > 0' },
    tooltip: 'Ejecuta un bloque de código solo si se cumple una condición lógica.'
  },
  { 
    type: 'SWITCH', 
    label: 'Selección Múltiple (CASO)', 
    category: 'Lógica de Control', 
    color: 'bg-green-800', 
    defaultParams: { variable: 'tipo_entidad' },
    tooltip: 'Evalúa una variable contra múltiples valores posibles (ej. Tipo A, B, C).'
  },
  { 
    type: 'FOREACH', 
    label: 'Iteración (PARA CADA)', 
    category: 'Lógica de Control', 
    color: 'bg-lime-700', 
    icon: Repeat,
    defaultParams: { item: 'detalle', collection: 'formulario.detalles', filter: '' },
    tooltip: 'Recorre todos los elementos de una lista o formulario.'
  },
  { 
    type: 'WHILE', 
    label: 'Bucle (MIENTRAS)', 
    category: 'Lógica de Control', 
    color: 'bg-lime-800', 
    icon: Repeat,
    defaultParams: { condition: 'contador < 10' },
    tooltip: 'Repite un bloque mientras la condición sea verdadera.'
  },

  // UTILIDADES UPL
  {
    type: 'FUNC_DEF',
    label: 'Definir Función',
    category: 'Utilidades UPL',
    color: 'bg-amber-600',
    icon: FunctionSquare,
    defaultParams: { name: 'calcular_ratio', params: 'activo, pasivo' },
    tooltip: 'Crea una función reutilizable con parámetros de entrada.'
  },
  {
    type: 'FUNC_CALL',
    label: 'Llamar Función',
    category: 'Utilidades UPL',
    color: 'bg-amber-500',
    defaultParams: { function: 'calcular_ratio', args: '1000, 500', output_var: 'res' },
    tooltip: 'Ejecuta una función previamente definida.'
  },
  {
    type: 'UPL_DATE_DIFF',
    label: 'Diferencia de Días',
    category: 'Utilidades UPL',
    color: 'bg-[#2E7D32]', 
    icon: CalendarClock,
    defaultParams: { date1: 'fecha_ini', date2: 'fecha_fin', target: 'dias' },
    tooltip: 'Calcula la diferencia en días entre dos fechas (UPL: DIFERENCIA_DIAS).'
  },
  {
    type: 'UPL_ADD_MONTHS',
    label: 'Agregar Meses',
    category: 'Utilidades UPL',
    color: 'bg-[#2E7D32]',
    icon: CalendarClock,
    defaultParams: { date: 'fecha', months: '1', target: 'nueva_fecha' },
    tooltip: 'Suma meses a una fecha dada (UPL: AGREGAR_MESES).'
  },

  // INTEGRACIONES (CRUCES)
  {
    type: 'CHECK_SICODIS',
    label: 'SICODIS (SGP)',
    category: 'Integraciones Externas',
    color: 'bg-purple-700',
    icon: Globe,
    defaultParams: { concepto_sgp: 'EDUCACION', target: 'valor_sgp' },
    paramConfig: { concepto_sgp: { type: 'select', options: ['EDUCACION', 'SALUD', 'AGUA_POTABLE', 'PROPOSITO_GENERAL'] } },
    tooltip: 'Consulta el giro asignado en SICODIS para el Sistema General de Participaciones.'
  },
  {
    type: 'CHECK_SGRP',
    label: 'SGRP (Regalías)',
    category: 'Integraciones Externas',
    color: 'bg-purple-600',
    icon: Globe,
    defaultParams: { proyecto: 'BPIN...', target: 'valor_regalias' },
    tooltip: 'Consulta el Sistema de Presupuesto y Giro de Regalías.'
  },
  {
    type: 'CHECK_ADRES',
    label: 'ADRES (Salud)',
    category: 'Integraciones Externas',
    color: 'bg-cyan-700',
    icon: Stethoscope,
    defaultParams: { concepto: 'LMA', target: 'valor_giro' },
    tooltip: 'Consulta la matriz de giros a Entidades Territoriales (ADRES).'
  },
  {
    type: 'CHECK_AGRARIO',
    label: 'Banco Agrario',
    category: 'Integraciones Externas',
    color: 'bg-green-700',
    icon: Landmark,
    defaultParams: { cuenta: '1234...', target: 'saldo_banco' },
    tooltip: 'Valida saldos reportados por el Banco Agrario para la Entidad.'
  },
  {
    type: 'CHECK_CUIPO',
    label: 'Cruce Presupuestal (CUIPO)',
    category: 'Integraciones Externas',
    color: 'bg-orange-600',
    icon: FileBarChart,
    defaultParams: { rubro: 'Gastos de Personal', target: 'obligacion_presupuestal' },
    tooltip: 'Cruce con Categoría Única de Información del Presupuesto Ordinario (Ejecución).'
  },
  {
    type: 'CHECK_GENERIC',
    label: 'Cruce Genérico',
    category: 'Integraciones Externas',
    color: 'bg-slate-700',
    icon: Layers,
    defaultParams: { category: 'FUT', concept: 'INGRESOS', period: 'ACTUAL', target: 'valor_externo' },
    tooltip: 'Consulta genérica a otras categorías reportadas en CHIP (FUT, FUL, etc.).'
  },

  // VALIDACIÓN
  { 
    type: 'CONTEXT_CHECK', 
    label: 'Verificar Atributo Contexto', 
    category: 'Validaciones', 
    color: 'bg-[#144718]', 
    defaultParams: { field: 'CONTEXTO.ENTIDAD.TIPO', value: '"CENTRAL"' },
    tooltip: 'Verifica atributos maestros de la entidad (ej. Ámbito, Tipo).'
  },
  { 
    type: 'IS_MEMBER_OF', 
    label: 'Pertenencia a Lista', 
    category: 'Validaciones', 
    color: 'bg-[#2E7D32]', 
    icon: ShieldCheck,
    defaultParams: { value: 'entidad', list_name: 'ENTIDADES_EXCLUIDAS' },
    tooltip: 'Valida si un valor pertenece a una lista de referencia gestionada centralmente.'
  },
  { 
    type: 'ERROR', 
    label: 'Generar Mensaje Validación', 
    category: 'Validaciones', 
    color: 'bg-[#E65100]', 
    defaultParams: { code: 'E001', msg: 'Mensaje de error...', severity: 'NO_PERMISIBLE' },
    paramConfig: { severity: { type: 'select', options: ['NO_PERMISIBLE', 'PERMISIBLE'] } },
    tooltip: 'NO_PERMISIBLE: Bloquea el envío (Deficiencia Grave). PERMISIBLE: Genera Advertencia.'
  },
  { 
    type: 'TRY_CATCH', 
    label: 'Control de Excepciones', 
    category: 'Validaciones', 
    color: 'bg-orange-700', 
    defaultParams: {},
    tooltip: 'Captura errores inesperados (ej. división por cero) para evitar fallos del sistema.'
  },
];

// Defined Examples
const EXAMPLES: Example[] = [
    {
        id: 'proc1905',
        name: 'PROC1905 - Cálculo Aritmético',
        description: 'Validación K70: Saldo Inicial + Débitos - Créditos = Saldo Final',
        blocks: [
            { id: '1', type: 'VAR_DECL', params: { name: 'saldo_calculado', type: 'num', value: '0' } },
            { id: '2', type: 'ASSIGNMENT', params: { target: 'saldo_calculado', value: 'saldo_inicial' } },
            { id: '3', type: 'MATH', params: { target: 'saldo_calculado', expression: 'saldo_calculado + mov_debito' } },
            { id: '4', type: 'MATH', params: { target: 'saldo_calculado', expression: 'saldo_calculado - mov_credito' } },
            { 
                id: '5', type: 'IF', params: { condition: 'saldo_final != saldo_calculado' },
                children: [
                    { id: '6', type: 'ERROR', params: { code: 'PROC1905', msg: 'Error Aritmético: Saldo Final no coincide', severity: 'NO_PERMISIBLE' } }
                ] 
            }
        ]
    },
    {
        id: 'k70_partida_doble',
        name: 'K70 - Partida Doble',
        description: 'Validación fundamental: La suma de Débitos debe igualar la suma de Créditos.',
        blocks: [
            { id: '1', type: 'VAR_DECL', params: { name: 'total_debito', type: 'num', value: '0' } },
            { id: '2', type: 'VAR_DECL', params: { name: 'total_credito', type: 'num', value: '0' } },
            { 
                id: '3', type: 'FOREACH', params: { item: 'mov', collection: 'formulario.movimientos', filter: '' },
                children: [
                    { id: '4', type: 'MATH', params: { target: 'total_debito', expression: 'total_debito + mov.valor_debito' } },
                    { id: '5', type: 'MATH', params: { target: 'total_credito', expression: 'total_credito + mov.valor_credito' } }
                ]
            },
            {
                id: '6', type: 'IF', params: { condition: 'total_debito != total_credito' },
                children: [
                    { id: '7', type: 'ERROR', params: { code: 'PROC1960', msg: 'Partida Doble Incorrecta. Débitos != Créditos', severity: 'NO_PERMISIBLE' } }
                ]
            }
        ]
    },
    {
        id: 'k90_calificacion',
        name: 'K90 - Calificación Control Interno',
        description: 'Cálculo de puntaje final y asignación de concepto (Deficiente, Adecuado, Eficiente).',
        blocks: [
            { id: '1', type: 'VAR_DECL', params: { name: 'suma_total', type: 'num', value: '0' } },
            { 
                id: '2', type: 'FOREACH', params: { item: 'criterio', collection: 'formulario.criterios', filter: '' },
                children: [
                    { id: '3', type: 'MATH', params: { target: 'suma_total', expression: 'suma_total + criterio.calificacion' } }
                ]
            },
            { id: '4', type: 'VAR_DECL', params: { name: 'resultado', type: 'num', value: '0' } },
            { id: '5', type: 'MATH', params: { target: 'resultado', expression: '(suma_total / 32) * 5' } },
            {
                id: '6', type: 'IF', params: { condition: 'resultado < 3.0' },
                children: [
                    { id: '7', type: 'ASSIGNMENT', params: { target: 'formulario.concepto', value: '"DEFICIENTE"' } }
                ]
            },
            {
                id: '8', type: 'IF', params: { condition: 'resultado >= 3.0 && resultado <= 3.9' },
                children: [
                     { id: '9', type: 'ASSIGNMENT', params: { target: 'formulario.concepto', value: '"ADECUADO"' } }
                ]
            },
             {
                id: '10', type: 'IF', params: { condition: 'resultado >= 4.0' },
                children: [
                     { id: '11', type: 'ASSIGNMENT', params: { target: 'formulario.concepto', value: '"EFICIENTE"' } }
                ]
            }
        ]
    },
    {
        id: 'func_demo',
        name: 'Definición y Uso de Función',
        description: 'Definir una función reutilizable de riesgo y llamarla dentro de un bucle.',
        blocks: [
            {
                id: '1', type: 'FUNC_DEF', params: { name: 'calcular_riesgo', params: 'monto, tipo' },
                children: [
                    { id: '2', type: 'VAR_DECL', params: { name: 'factor', type: 'num', value: '1' } },
                    { 
                        id: '3', type: 'IF', params: { condition: 'tipo == "INVERSION"' }, 
                        children: [{ id: '4', type: 'ASSIGNMENT', params: { target: 'factor', value: '1.5' } }] 
                    },
                    { id: '5', type: 'MATH', params: { target: 'riesgo', expression: 'monto * factor' } }
                ]
            },
            { 
                id: '6', type: 'FOREACH', params: { item: 'cta', collection: 'formulario.cuentas', filter: '' },
                children: [
                     { id: '7', type: 'VAR_DECL', params: { name: 'riesgo_cta', type: 'num', value: '0' } },
                     { id: '8', type: 'FUNC_CALL', params: { function: 'calcular_riesgo', args: 'cta.saldo, cta.tipo', output_var: 'riesgo_cta' } },
                     { 
                         id: '9', type: 'IF', params: { condition: 'riesgo_cta > 1000' },
                         children: [ { id: '10', type: 'ERROR', params: { code: 'RIESGO_ALTO', msg: 'Riesgo calculado excede límite', severity: 'PERMISIBLE' } } ]
                     }
                ]
            }
        ]
    },
    {
        id: 'cruce_sicodis',
        name: 'Cruce SICODIS vs Contabilidad',
        description: 'Comparar valor contable con giro SGP registrado en SICODIS.',
        blocks: [
            { id: '1', type: 'GET_CONTEXT', params: { target: 'cod_entidad', property: 'ENTIDAD.CODIGO' } },
            { id: '2', type: 'VAR_DECL', params: { name: 'valor_sicodis', type: 'num', value: '0' } },
            { id: '3', type: 'CHECK_SICODIS', params: { concepto_sgp: 'EDUCACION', target: 'valor_sicodis' } },
            { id: '4', type: 'VAR_DECL', params: { name: 'valor_contable', type: 'num', value: '0' } },
            { id: '5', type: 'MATH', params: { target: 'valor_contable', expression: 'SUMA(formulario.saldos_educacion)' } },
            { 
                id: '6', type: 'IF', params: { condition: 'valor_contable != valor_sicodis' },
                children: [
                    { id: '7', type: 'ERROR', params: { code: 'E_SGP_01', msg: 'Valor reportado no coincide con giro SICODIS', severity: 'PERMISIBLE' } }
                ]
            }
        ]
    },
    {
        id: 'cruce_integral_sgp_sgrp',
        name: 'Cruce Integral SGP y Regalías',
        description: 'Validar ingresos totales contra SICODIS y SGRP simultáneamente.',
        blocks: [
            { id: '1', type: 'VAR_DECL', params: { name: 'total_giros_externos', type: 'num', value: '0' } },
            { id: '2', type: 'VAR_DECL', params: { name: 'giro_educacion', type: 'num', value: '0' } },
            { id: '3', type: 'CHECK_SICODIS', params: { concepto_sgp: 'EDUCACION', target: 'giro_educacion' } },
            { id: '4', type: 'VAR_DECL', params: { name: 'giro_regalias', type: 'num', value: '0' } },
            { id: '5', type: 'CHECK_SGRP', params: { proyecto: 'TOTAL_ASIGNACION', target: 'giro_regalias' } },
            { id: '6', type: 'MATH', params: { target: 'total_giros_externos', expression: 'giro_educacion + giro_regalias' } },
            { id: '7', type: 'VAR_DECL', params: { name: 'ingreso_contable', type: 'num', value: '0' } },
            { id: '8', type: 'MATH', params: { target: 'ingreso_contable', expression: 'SUMA(formulario.ingresos_transferencias)' } },
            { 
                id: '9', type: 'IF', params: { condition: 'ingreso_contable < total_giros_externos' },
                children: [
                    { id: '10', type: 'ERROR', params: { code: 'E_INTEGRIDAD_INGRESOS', msg: 'El ingreso contable reportado es menor a la suma de giros confirmados', severity: 'NO_PERMISIBLE' } }
                ]
            }
        ]
    },
    {
        id: 'cruce_cuipo',
        name: 'Consistencia Contable vs Presupuesto (CUIPO)',
        description: 'Cruce entre la ejecución presupuestal (CUIPO) y la causación contable.',
        blocks: [
            { id: '1', type: 'VAR_DECL', params: { name: 'obligacion_presupuestal', type: 'num', value: '0' } },
            { id: '2', type: 'CHECK_CUIPO', params: { rubro: 'GASTOS_PERSONAL', target: 'obligacion_presupuestal' } },
            { id: '3', type: 'VAR_DECL', params: { name: 'causacion_contable', type: 'num', value: '0' } },
            { id: '4', type: 'MATH', params: { target: 'causacion_contable', expression: 'SUMA(formulario.gastos_personal)' } },
            { 
                id: '5', type: 'IF', params: { condition: 'causacion_contable != obligacion_presupuestal' },
                children: [
                    { id: '6', type: 'ERROR', params: { code: 'E_CUIPO_01', msg: 'Inconsistencia: Gasto Contable difiere de Obligación Presupuestal', severity: 'PERMISIBLE' } }
                ]
            }
        ]
    },
    {
        id: 'cruce_adres_completo',
        name: 'Validación Giros ADRES (Salud)',
        description: 'Iterar sobre conceptos de salud y validar cada uno contra ADRES.',
        blocks: [
            { 
                id: '1', type: 'FOREACH', params: { item: 'concepto', collection: 'formulario.ingresos_salud', filter: '' },
                children: [
                    { id: '2', type: 'VAR_DECL', params: { name: 'valor_adres', type: 'num', value: '0' } },
                    { id: '3', type: 'CHECK_ADRES', params: { concepto: 'concepto.tipo', target: 'valor_adres' } },
                    { 
                        id: '4', type: 'IF', params: { condition: 'concepto.valor_recibido != valor_adres' },
                        children: [
                            { id: '5', type: 'ERROR', params: { code: 'E_ADRES_DETALLE', msg: 'Diferencia en giro ADRES', severity: 'PERMISIBLE' } }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'proc2809',
        name: 'PROC2809 - Variaciones Significativas',
        description: 'Iteración sobre variaciones, cálculo absoluto y validación de umbral.',
        blocks: [
            { id: '1', type: 'VAR_DECL', params: { name: 'UMBRAL', type: 'num', value: '30000000' } },
            { 
                id: '2', type: 'FOREACH', params: { item: 'var', collection: 'formulario.variaciones', filter: '' },
                children: [
                    { id: '3', type: 'VAR_DECL', params: { name: 'diferencia', type: 'num', value: '0' } },
                    { id: '4', type: 'MATH', params: { target: 'diferencia', expression: 'var.saldo_actual - var.saldo_anterior' } },
                    { id: '5', type: 'MATH', params: { target: 'diferencia', expression: 'abs(diferencia)' } },
                    { 
                        id: '6', type: 'IF', params: { condition: 'diferencia > UMBRAL' },
                        children: [
                            { 
                                id: '7', type: 'IF', params: { condition: 'var.justificacion == NULL' },
                                children: [
                                    { id: '8', type: 'ERROR', params: { code: 'PROC2809', msg: 'Variación significativa sin justificar', severity: 'PERMISIBLE' } }
                                ]
                            }
                        ] 
                    }
                ]
            }
        ]
    },
    {
        id: 'proc2176',
        name: 'PROC2176 - Control Completitud',
        description: 'Uso de Manejo de Nulos dentro de bucles (K90).',
        blocks: [
            { 
                id: '1', type: 'FOREACH', params: { item: 'pregunta', collection: 'formulario.preguntas', filter: '' },
                children: [
                    { id: '2', type: 'VAR_DECL', params: { name: 'es_vacia', type: 'bool', value: 'false' } },
                    { id: '3', type: 'NULL_HANDLING', params: { action: 'ES_NULO', target: 'pregunta.respuesta', fallback: '' } },
                    { 
                        id: '4', type: 'IF', params: { condition: 'pregunta.respuesta == "" || is_null' },
                        children: [
                            { id: '5', type: 'ERROR', params: { code: 'M4040', msg: 'Pregunta obligatoria sin responder', severity: 'NO_PERMISIBLE' } }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'list_val',
        name: 'Validación de Listas (Exclusiones)',
        description: 'Validar si la entidad pertenece a una lista de exclusión.',
        blocks: [
            { id: '1', type: 'GET_CONTEXT', params: { target: 'cod_entidad', property: 'ENTIDAD.CODIGO' } },
            { 
                id: '2', type: 'IS_MEMBER_OF', params: { value: 'cod_entidad', list_name: 'LISTA_EXCLUIDAS_RECIPROCAS' },
                children: [] 
            },
            {
                id: '3', type: 'IF', params: { condition: 'check == true' },
                children: [
                    { id: '4', type: 'ERROR', params: { code: 'E_EXCLUIDA', msg: 'Entidad no habilitada para este reporte', severity: 'NO_PERMISIBLE' } }
                ]
            }
        ]
    },
];

// Code Generator (Unchanged logic, just ensure styling)
const generateCode = (blocks: BlockData[], lang: 'UPL2' | 'PYTHON', indentLevel = 0): string => {
  const indent = '    '.repeat(indentLevel);
  
  return blocks.map(block => {
    switch (block.type) {
      case 'VAR_DECL':
        if (lang === 'UPL2') return `${indent}${block.params.type} ${block.params.name} = ${block.params.value};`;
        const pyType = block.params.type === 'num' ? 'float' : block.params.type === 'bool' ? 'bool' : 'str';
        return `${indent}${block.params.name}: ${pyType} = ${block.params.value}`;
      
      case 'ASSIGNMENT':
        if (lang === 'UPL2') return `${indent}${block.params.target} = ${block.params.value};`;
        return `${indent}${block.params.target} = ${block.params.value}`;

      case 'GET_CONTEXT':
        if (lang === 'UPL2') return `${indent}${block.params.target} = CONTEXTO.${block.params.property};`;
        const pyProp = block.params.property.toLowerCase().replace('entidad', 'entity').replace('periodo', 'period').replace('anio', 'year').replace('corte', 'cut_off');
        return `${indent}${block.params.target} = context.${pyProp}`;

      case 'MATH':
        let expr = block.params.expression;
        if (lang === 'PYTHON') {
            expr = expr.replace(/\^/g, '**'); 
            expr = expr.replace(/SQRT\((.*?)\)/g, 'math.sqrt($1)');
            expr = expr.replace(/MOD/g, '%');
            expr = expr.replace(/DIV/g, '//');
        } else {
             expr = expr.replace(/\^/g, 'POW'); 
             expr = expr.replace(/SQRT\((.*?)\)/g, 'RAIZ($1)');
        }
        return `${indent}${block.params.target} = ${expr};`;

      case 'STATISTICS':
        const funcMapUPL: Record<string, string> = { 'PROMEDIO': 'PROMEDIO', 'MEDIANA': 'MEDIANA', 'DESVEST': 'DESVEST', 'MAX': 'MAX', 'MIN': 'MIN', 'SUMA': 'SUMA' };
        const funcMapPy: Record<string, string> = { 'PROMEDIO': 'statistics.mean', 'MEDIANA': 'statistics.median', 'DESVEST': 'statistics.stdev', 'MAX': 'max', 'MIN': 'min', 'SUMA': 'sum' };
        
        if (lang === 'UPL2') return `${indent}${block.params.target} = ${funcMapUPL[block.params.func]}(${block.params.collection});`;
        return `${indent}${block.params.target} = ${funcMapPy[block.params.func]}(${block.params.collection})`;

      case 'NULL_HANDLING':
        if (block.params.action === 'NVL') {
            if (lang === 'UPL2') return `${indent}${block.params.target} = NVL(${block.params.target}, ${block.params.fallback});`;
            return `${indent}${block.params.target} = ${block.params.target} if ${block.params.target} is not None else ${block.params.fallback}`;
        } else { 
            if (lang === 'UPL2') return `${indent}bool is_null = ES_NULO(${block.params.target});`;
            return `${indent}is_null = ${block.params.target} is None`;
        }

      case 'IF':
        const ifBody = block.children ? generateCode(block.children, lang, indentLevel + 1) : '';
        if (lang === 'UPL2') return `${indent}if (${block.params.condition}) {\n${ifBody}\n${indent}}`;
        return `${indent}if ${block.params.condition}:\n${ifBody || `${indent}    pass`}`;

      case 'WHILE':
        const whileBody = block.children ? generateCode(block.children, lang, indentLevel + 1) : '';
        if (lang === 'UPL2') return `${indent}while (${block.params.condition}) {\n${whileBody}\n${indent}}`;
        return `${indent}while ${block.params.condition}:\n${whileBody || `${indent}    pass`}`;

      case 'SWITCH':
        if (lang === 'UPL2') return `${indent}switch (${block.params.variable}) {\n${indent}    case 1: ...; break;\n${indent}}`;
        return `${indent}match ${block.params.variable}:\n${indent}    case 1: ...`;

      case 'FOREACH':
        const loopBody = block.children ? generateCode(block.children, lang, indentLevel + 1) : '';
        if (lang === 'UPL2') {
           const filterPart = block.params.filter ? ` where (${block.params.filter})` : '';
           return `${indent}foreach (${block.params.item} in ${block.params.collection}${filterPart}) {\n${loopBody}\n${indent}}`;
        }
        if (block.params.filter) {
            return `${indent}for ${block.params.item} in [x for x in ${block.params.collection} if ${block.params.filter}]:\n${loopBody || `${indent}    pass`}`;
        }
        return `${indent}for ${block.params.item} in ${block.params.collection}:\n${loopBody || `${indent}    pass`}`;

      case 'FUNC_DEF':
        const funcDefBody = block.children ? generateCode(block.children, lang, indentLevel + 1) : '';
        if (lang === 'UPL2') return `${indent}function ${block.params.name}(${block.params.params}) {\n${funcDefBody}\n${indent}}`;
        return `${indent}def ${block.params.name}(${block.params.params}):\n${funcDefBody || `${indent}    pass`}`;

      case 'FUNC_CALL':
        const assign = block.params.output_var ? `${block.params.output_var} = ` : '';
        if (lang === 'UPL2') return `${indent}${assign}${block.params.function}(${block.params.args});`;
        return `${indent}${assign}${block.params.function}(${block.params.args})`;

      case 'UPL_DATE_DIFF':
        if (lang === 'UPL2') return `${indent}${block.params.target} = DIFERENCIA_DIAS(${block.params.date1}, ${block.params.date2});`;
        return `${indent}${block.params.target} = (${block.params.date2} - ${block.params.date1}).days`;

      case 'UPL_ADD_MONTHS':
        if (lang === 'UPL2') return `${indent}${block.params.target} = AGREGAR_MESES(${block.params.date}, ${block.params.months});`;
        return `${indent}${block.params.target} = ${block.params.date} + relativedelta(months=${block.params.months})`;

      case 'CHECK_SICODIS':
        if (lang === 'UPL2') return `${indent}${block.params.target} = CONSULTAR_SICODIS('${block.params.concepto_sgp}');`;
        return `${indent}${block.params.target} = external_services.sicodis.get_sgp_value('${block.params.concepto_sgp}')`;
      
      case 'CHECK_SGRP':
        if (lang === 'UPL2') return `${indent}${block.params.target} = CONSULTAR_SGRP('${block.params.proyecto}');`;
        return `${indent}${block.params.target} = external_services.sgrp.get_project_value('${block.params.proyecto}')`;

      case 'CHECK_ADRES':
        if (lang === 'UPL2') return `${indent}${block.params.target} = CONSULTAR_ADRES('${block.params.concepto}');`;
        return `${indent}${block.params.target} = external_services.adres.get_transfer('${block.params.concepto}')`;

      case 'CHECK_AGRARIO':
        if (lang === 'UPL2') return `${indent}${block.params.target} = CONSULTAR_BANCO_AGRARIO('${block.params.cuenta}');`;
        return `${indent}${block.params.target} = external_services.agrario.get_balance('${block.params.cuenta}')`;

      case 'CHECK_CUIPO':
        if (lang === 'UPL2') return `${indent}${block.params.target} = CONSULTAR_CUIPO('${block.params.rubro}');`;
        return `${indent}${block.params.target} = external_services.cuipo.get_budget_obligation('${block.params.rubro}')`;

      case 'CHECK_GENERIC':
        if (lang === 'UPL2') return `${indent}${block.params.target} = CONSULTAR_CATEGORIA_EXTERNA('${block.params.category}', '${block.params.concept}');`;
        return `${indent}${block.params.target} = external_services.chip.get_category_value('${block.params.category}', '${block.params.concept}')`;

      case 'ERROR':
        const sevMap = { 'NO_PERMISIBLE': 'SEVERIDAD_BLOQUEANTE', 'PERMISIBLE': 'SEVERIDAD_ADVERTENCIA' };
        const pySevMap = { 'NO_PERMISIBLE': 'Severity.BLOCKING', 'PERMISIBLE': 'Severity.WARNING' };
        
        if (lang === 'UPL2') return `${indent}GENERAR_DEFICIENCIA("${block.params.code}", "${block.params.msg}", ${sevMap[block.params.severity as keyof typeof sevMap]});`;
        return `${indent}context.report_issue(code="${block.params.code}", message="${block.params.msg}", severity=${pySevMap[block.params.severity as keyof typeof pySevMap]})`;

      case 'QUERY_DATA':
        if (lang === 'UPL2') return `${indent}var data = QUERY_DATA('${block.params.concept}', PERIODO: ${block.params.period});`;
        return `${indent}data = query_data(concept='${block.params.concept}', period='${block.params.period}')`;

      case 'IS_MEMBER_OF':
         if (lang === 'UPL2') return `${indent}bool check = IS_MEMBER_OF(${block.params.value}, '${block.params.list_name}');`;
         return `${indent}check = ${block.params.value} in ref_lists['${block.params.list_name}']`;

      case 'TRY_CATCH':
         const tryBody = block.children ? generateCode(block.children, lang, indentLevel + 1) : '';
         if (lang === 'UPL2') return `${indent}INTENTAR {\n${tryBody}\n${indent}} CAPTURAR {\n${indent}    log("Error");\n${indent}}`;
         return `${indent}try:\n${tryBody || `${indent}    pass`}\n${indent}except Exception as e:\n${indent}    logger.error(f"Error: {e}")`;

      case 'CONTEXT_CHECK':
         const ctxBody = block.children ? generateCode(block.children, lang, indentLevel + 1) : '';
         if (lang === 'UPL2') return `${indent}if (${block.params.field} == ${block.params.value}) {\n${ctxBody}\n${indent}}`;
         return `${indent}if ${block.params.field} == ${block.params.value}:\n${ctxBody || `${indent}    pass`}`;

      default: return '';
    }
  }).join('\n');
};

const VisualBuilder: React.FC = () => {
  // Ensure workspace initializes with the first example
  const [workspace, setWorkspace] = useState<BlockData[]>(EXAMPLES[0].blocks);
  const [selectedExampleId, setSelectedExampleId] = useState<string>(EXAMPLES[0].id);
  const [dragTargetId, setDragTargetId] = useState<string | null>(null);

  const handleExampleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const id = e.target.value;
      setSelectedExampleId(id);
      const example = EXAMPLES.find(ex => ex.id === id);
      if (example) {
          setWorkspace(example.blocks);
      }
  };

  const handleDragStart = (e: React.DragEvent, type: BlockType) => {
    e.dataTransfer.setData('blockType', type);
  };

  const handleDragOver = (e: React.DragEvent, blockId?: string) => {
    e.preventDefault();
    e.stopPropagation();
    const target = blockId || 'ROOT';
    if (dragTargetId !== target) {
        setDragTargetId(target);
    }
  };

  const handleDrop = (e: React.DragEvent, parentId?: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragTargetId(null);
    
    const type = e.dataTransfer.getData('blockType') as BlockType;
    if (!type) return;

    const def = BLOCK_DEFS.find(b => b.type === type);
    if (!def) return;

    const newBlock: BlockData = {
      id: Date.now().toString() + Math.random().toString().slice(2, 5),
      type,
      params: { ...def.defaultParams },
      children: ['IF', 'FOREACH', 'WHILE', 'SWITCH', 'TRY_CATCH', 'FUNC_DEF', 'CONTEXT_CHECK', 'IS_MEMBER_OF'].includes(type) ? [] : undefined
    };

    if (parentId) {
      const updateChildren = (blocks: BlockData[]): BlockData[] => {
        return blocks.map(block => {
          if (block.id === parentId && block.children) {
            return { ...block, children: [...block.children, newBlock] };
          }
          if (block.children) {
            return { ...block, children: updateChildren(block.children) };
          }
          return block;
        });
      };
      setWorkspace(prev => updateChildren(prev));
    } else {
      setWorkspace(prev => [...prev, newBlock]);
    }
  };

  const removeBlock = (id: string) => {
     const removeFromList = (blocks: BlockData[]): BlockData[] => {
        return blocks.filter(b => b.id !== id).map(b => ({
            ...b,
            children: b.children ? removeFromList(b.children) : undefined
        }));
     };
     setWorkspace(prev => removeFromList(prev));
  };

  const updateParam = (id: string, key: string, value: string) => {
      const updateList = (blocks: BlockData[]): BlockData[] => {
          return blocks.map(b => {
              if (b.id === id) {
                  return { ...b, params: { ...b.params, [key]: value } };
              }
              if (b.children) {
                  return { ...b, children: updateList(b.children) };
              }
              return b;
          });
      };
      setWorkspace(prev => updateList(prev));
  };

  const renderBlock = (block: BlockData) => {
    const def = BLOCK_DEFS.find(b => b.type === block.type);
    if (!def) return null;
    const Icon = def.icon || GripVertical;
    const isDragTarget = dragTargetId === block.id;

    return (
      <div key={block.id} className="mb-3 last:mb-0 animate-fade-in-up">
        <div className={`rounded-lg shadow-sm border border-slate-200 overflow-hidden ${def.color} bg-opacity-5 relative group`} title={def.tooltip}>
          {/* Block Header */}
          <div className={`${def.color} text-white px-3 py-2 flex items-center justify-between cursor-grab active:cursor-grabbing`}>
            <div className="flex items-center gap-2">
              <Icon size={16} className="opacity-90" />
              <span className="font-semibold text-sm tracking-wide">{def.label}</span>
              <HelpCircle size={12} className="opacity-60 hover:opacity-100 cursor-help" title={def.tooltip} />
            </div>
            <button 
                onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }} 
                className="text-white opacity-60 hover:opacity-100 p-1 hover:bg-white/20 rounded transition-all"
            >
              <Trash2 size={14} />
            </button>
          </div>
          
          {/* Block Content (Params) */}
          <div className="p-3 bg-white border-b border-slate-100">
            {/* Math Toolbar */}
            {block.type === 'MATH' && (
                <div className="flex gap-1 mb-2 pb-2 border-b border-slate-100 overflow-x-auto">
                    {[
                        { label: '+', op: '+', desc: 'Sumar' },
                        { label: '-', op: '-', desc: 'Restar' },
                        { label: '*', op: '*', desc: 'Multiplicar' },
                        { label: '/', op: '/', desc: 'Dividir' },
                        { label: '^', op: '^', desc: 'Potencia' },
                        { label: '√', op: 'SQRT()', desc: 'Raíz Cuadrada' },
                        { label: 'DIV', op: 'DIV', desc: 'Parte Entera' },
                        { label: 'MOD', op: 'MOD', desc: 'Residuo' },
                    ].map(btn => (
                        <button
                            key={btn.label}
                            title={btn.desc}
                            onClick={() => {
                                const currentExpr = block.params['expression'] || '';
                                const append = btn.op === 'SQRT()' ? 'SQRT()' : ` ${btn.op} `;
                                updateParam(block.id, 'expression', currentExpr + append);
                            }}
                            className="px-2 py-1 bg-slate-50 hover:bg-[#2E7D32] hover:text-white rounded text-xs font-bold text-[#2E7D32] border border-green-200 transition-colors"
                        >
                            {btn.label}
                        </button>
                    ))}
                </div>
            )}

            <div className="flex flex-wrap gap-x-4 gap-y-2 items-center">
                {Object.keys(block.params).map(key => {
                   const config = def.paramConfig?.[key];
                   const isMathExpr = block.type === 'MATH' && key === 'expression';

                   const inputWidth = isMathExpr 
                     ? Math.max(200, (block.params[key]?.length || 0) * 8 + 20) 
                     : undefined;

                   return (
                    <div key={key} className={`flex items-center gap-2 text-xs ${isMathExpr ? 'w-full' : ''}`}>
                        <span className="font-bold text-[#2E7D32] whitespace-nowrap">{key}:</span>
                        {config?.type === 'select' ? (
                             <select
                                value={block.params[key]}
                                onChange={(e) => updateParam(block.id, key, e.target.value)}
                                className="bg-slate-50 border border-slate-300 rounded px-2 py-1 focus:ring-1 focus:ring-[#2E7D32] focus:outline-none font-medium text-slate-700 min-w-[80px]"
                             >
                                {config.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                             </select>
                        ) : (
                            <input 
                                type="text" 
                                value={block.params[key]} 
                                onChange={(e) => updateParam(block.id, key, e.target.value)}
                                style={isMathExpr ? { width: `${inputWidth}px` } : {}}
                                className={`bg-slate-50 border border-slate-300 rounded px-2 py-1 focus:ring-1 focus:ring-[#2E7D32] focus:outline-none placeholder-slate-300 text-xs transition-all duration-200
                                    ${isMathExpr 
                                        ? 'font-mono text-green-800 bg-green-50/50 border-green-200 min-w-[200px] tracking-wide' 
                                        : 'w-auto min-w-[120px] font-mono text-slate-700'
                                    }`}
                                placeholder="..."
                            />
                        )}
                    </div>
                   );
                })}
            </div>
          </div>

          {/* Block Children (Nested) */}
          {block.children && (
             <div 
               className={`p-3 pl-6 min-h-[60px] border-t border-slate-100 flex flex-col gap-2 relative transition-colors duration-200 ${isDragTarget ? 'bg-green-100/40 ring-2 ring-inset ring-green-300' : 'bg-slate-50/50'}`}
               onDrop={(e) => handleDrop(e, block.id)}
               onDragOver={(e) => handleDragOver(e, block.id)}
             >
                <div className={`absolute left-3 top-0 bottom-0 w-0.5 ${def.color} opacity-20`}></div>
                
                {block.children.length === 0 ? (
                    <div className={`border-2 border-dashed rounded-lg h-12 flex items-center justify-center text-xs italic transition-all ${isDragTarget ? 'border-green-400 bg-green-50 text-green-600 font-bold' : 'border-slate-200 text-slate-400 bg-white/50'}`}>
                        {isDragTarget ? 'SOLTAR AQUÍ' : 'Arrastre bloques aquí'}
                    </div>
                ) : (
                    block.children.map(child => renderBlock(child))
                )}
                {block.children.length > 0 && isDragTarget && (
                     <div className="h-8 border-2 border-dashed border-green-300 bg-green-50/50 rounded flex items-center justify-center text-[10px] text-green-600 font-bold">
                        SOLTAR AL FINAL
                     </div>
                )}
             </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Toolbox */}
      <div className="w-72 bg-white border-r border-slate-200 flex flex-col z-10 shadow-lg">
        <div className="p-0 border-b border-[#2E7D32]">
          <div className="bg-[#FF9800] h-1.5 w-full"></div>
          <div className="p-4 bg-[#f8f9fa]">
            <h3 className="font-extrabold text-[#2E7D32] flex items-center gap-2 text-lg">
                <Puzzle className="text-[#FF9800]" />
                Componentes
            </h3>
            <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wide">Bloques de Construcción UPL 2.0</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar bg-slate-50">
          {['Datos', 'Matemáticas', 'Estadísticas', 'Lógica de Control', 'Utilidades UPL', 'Integraciones Externas', 'Validaciones'].map(cat => (
             <div key={cat}>
                <h4 className="text-[10px] font-black text-[#2E7D32] uppercase tracking-widest mb-3 ml-1 border-b border-slate-200 pb-1 flex justify-between">
                    {cat}
                </h4>
                <div className="space-y-2">
                    {BLOCK_DEFS.filter(b => b.category === cat).map(block => (
                        <div
                            key={block.type}
                            draggable
                            onDragStart={(e) => handleDragStart(e, block.type)}
                            title={block.tooltip}
                            className={`px-3 py-2.5 rounded text-white text-xs font-bold cursor-grab shadow-sm transition-all hover:translate-x-1 hover:shadow-md flex items-center gap-3 ${block.color}`}
                        >
                            {block.icon ? <block.icon size={14} className="opacity-90" /> : <GripVertical size={14} className="opacity-70" />}
                            {block.label}
                        </div>
                    ))}
                </div>
             </div>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 flex flex-col relative bg-slate-100">
         <div className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center shadow-sm z-10">
             <div className="flex items-center gap-3 flex-1">
                 <h2 className="font-bold text-[#2E7D32] text-lg whitespace-nowrap">Lienzo de Diseño</h2>
                 
                 <div className="relative max-w-sm w-full ml-4">
                     <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
                         <BookOpen size={14} />
                     </div>
                     <select
                        value={selectedExampleId}
                        onChange={handleExampleChange}
                        className="bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-lg focus:ring-[#2E7D32] focus:border-[#2E7D32] block w-full pl-9 p-2 font-bold cursor-pointer"
                     >
                         {EXAMPLES.map(ex => (
                             <option key={ex.id} value={ex.id}>
                                 Ejemplo: {ex.name}
                             </option>
                         ))}
                     </select>
                 </div>
             </div>
             <button 
                onClick={() => setWorkspace([])}
                className="text-xs text-[#E65100] hover:text-white font-bold px-3 py-1.5 hover:bg-[#E65100] rounded border border-[#E65100]/30 transition-colors flex items-center gap-1"
             >
                 <Trash2 size={14} /> LIMPIAR
             </button>
         </div>
         <div 
            className={`flex-1 p-8 overflow-y-auto bg-grid-pattern transition-colors duration-200 ${dragTargetId === 'ROOT' ? 'bg-green-50' : 'bg-slate-100'}`}
            style={dragTargetId === 'ROOT' ? {} : { 
                backgroundImage: 'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)', 
                backgroundSize: '20px 20px',
                backgroundColor: '#ffffff'
            }}
            onDrop={(e) => handleDrop(e)}
            onDragOver={(e) => handleDragOver(e)}
         >
             <div className={`max-w-4xl mx-auto min-h-[600px] pb-20 transition-all ${dragTargetId === 'ROOT' ? 'ring-4 ring-green-200 rounded-xl p-4 bg-white/50' : ''}`}>
                {workspace.length === 0 ? (
                    <div className={`border-2 border-dashed rounded-xl h-96 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 transition-all ${dragTargetId === 'ROOT' ? 'border-green-400 bg-green-50 scale-[1.02]' : 'border-slate-300'}`}>
                        <div className="bg-white p-4 rounded-full shadow-sm mb-4 border border-slate-100">
                            <ListFilter size={32} className="text-[#2E7D32]" />
                        </div>
                        <p className={`text-xl font-bold ${dragTargetId === 'ROOT' ? 'text-green-600' : 'text-[#2E7D32]'}`}>
                            {dragTargetId === 'ROOT' ? 'SOLTAR AQUÍ PARA COMENZAR' : 'Espacio de Trabajo Vacío'}
                        </p>
                        {!dragTargetId && <p className="text-sm mt-2 text-slate-500">Seleccione componentes del panel izquierdo</p>}
                    </div>
                ) : (
                    workspace.map(block => renderBlock(block))
                )}
                {workspace.length > 0 && dragTargetId === 'ROOT' && (
                     <div className="h-12 border-2 border-dashed border-green-300 bg-green-50/50 rounded-lg flex items-center justify-center text-sm text-green-600 font-bold mt-4 animate-pulse">
                        AÑADIR AL FINAL
                     </div>
                )}
             </div>
         </div>
      </div>

      {/* Code Generation Panel */}
      <div className="w-[450px] bg-white border-l border-slate-200 flex flex-col shadow-xl z-20">
         <div className="p-4 bg-[#2E7D32] text-white flex justify-between items-center">
             <h3 className="font-bold flex items-center gap-2">
                 <Code2 size={18} className="text-white" />
                 Vista Previa de Código
             </h3>
         </div>
         
         <div className="flex-1 overflow-hidden flex flex-col bg-slate-50">
             {/* UPL 2.0 Preview */}
             <div className="flex-1 flex flex-col border-b border-slate-200 min-h-0 relative group">
                 <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Copy size={14} className="text-slate-400 cursor-pointer hover:text-[#2E7D32]" />
                 </div>
                 <div className="px-4 py-2 bg-white border-b border-slate-200 flex justify-between items-center">
                    <span className="text-[#2E7D32] text-xs font-black tracking-wider">UPL 2.0</span>
                 </div>
                 <div className="flex-1 overflow-auto p-4 custom-scrollbar bg-white">
                     <pre className="text-sm font-mono text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {generateCode(workspace, 'UPL2') || <span className="text-slate-400 italic">// Generando...</span>}
                     </pre>
                 </div>
             </div>

             {/* Python Preview */}
             <div className="flex-1 flex flex-col min-h-0 relative group">
                 <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Copy size={14} className="text-slate-400 cursor-pointer hover:text-[#2E7D32]" />
                 </div>
                 <div className="px-4 py-2 bg-white border-b border-slate-200 flex justify-between items-center border-t border-slate-100">
                    <span className="text-[#E65100] text-xs font-black tracking-wider">PYTHON 3.10+</span>
                 </div>
                 <div className="flex-1 overflow-auto p-4 custom-scrollbar bg-slate-50">
                     <pre className="text-sm font-mono text-slate-600 leading-relaxed whitespace-pre-wrap">
                        {generateCode(workspace, 'PYTHON') || <span className="text-slate-400 italic"># Generando...</span>}
                     </pre>
                 </div>
             </div>
         </div>
      </div>
    </div>
  );
};

export default VisualBuilder;