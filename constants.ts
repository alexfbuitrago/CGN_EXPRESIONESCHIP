import { ValidationRule, ContextVariable } from './types';

export const RULES_DATA: ValidationRule[] = [
  {
    id: '1',
    name: 'Asignación',
    description: 'Adopción del estándar de asignación (=) eliminando la sintaxis legacy (:=).',
    upl1Code: `_saldo := 1000;
_nombre := "Caja";`,
    upl2Code: `saldo = 1000;
nombre = "Caja";`,
    pythonCode: `# Asignación directa con inferencia de tipos
saldo: int = 1000
nombre: str = "Caja"

# Ventaja: Gestión de memoria optimizada
# Python gestiona referencias a objetos, no copias de valores.`,
    technicalBenefits: [
        "Facilidad de Uso: Sintaxis universal que reduce la curva de aprendizaje para nuevos desarrolladores.",
        "Eficiencia de Memoria: Python utiliza referencias a objetos, evitando duplicidad innecesaria de datos en memoria.",
        "Tipado Dinámico/Estático: Permite uso de Type Hints para validación estática (mypy) antes de ejecución."
    ]
  },
  {
    id: '2',
    name: 'Declaración',
    description: 'Tipado fuerte y eliminación de prefijos obligatorios (@, _).',
    upl1Code: `@numero _saldo;
@caracter _nombre;`,
    upl2Code: `num saldo;
string nombre;`,
    pythonCode: `from typing import Optional

# Definición explícita con Type Hints (PEP 484)
saldo: float = 0.0
nombre: str = ""
fecha_corte: Optional[date] = None`,
    technicalBenefits: [
        "Calidad de Código: El uso de Type Hints permite análisis estático para detectar errores antes del tiempo de ejecución.",
        "Interoperabilidad: Los tipos nativos de Python son compatibles directamente con librerías JSON, SQL y APIs REST.",
        "Legibilidad: Código auto-documentado que facilita la auditoría técnica."
    ]
  },
  {
    id: '3',
    name: 'Constante Nulo',
    description: 'Estandarización de valores nulos con NULL en lugar de @UD (Undefined).',
    upl1Code: `@si (_valor = @UD) { ... }`,
    upl2Code: `if (valor == NULL) { ... }`,
    pythonCode: `if valor is None:
    # Pythonic way ("Truthiness")
    pass

# O uso de operadores Walrus (Python 3.8+)
if (n := procesar()) is None:
    log_error()`,
    technicalBenefits: [
        "Seguridad: 'None' es un singleton en Python, lo que garantiza comparaciones seguras y consistentes de identidad.",
        "Eficiencia: Las comprobaciones 'is None' son operaciones de puntero extremadamente rápidas (O(1)).",
        "Prevención de Errores: Evita el comportamiento indefinido de variables no inicializadas típico de UPL 1.0."
    ]
  },
  {
    id: '4',
    name: 'Iteración',
    description: 'Bucles foreach modernos sobre colecciones en lugar de comandos @para globales.',
    upl1Code: `@para FORM1 @aplique
  ...`,
    upl2Code: `foreach (fila in formulario) {
  ...
}`,
    pythonCode: `# Iteración eficiente sobre generadores
for fila in formulario.filas:
    procesar(fila)

# List Comprehensions (Más rápido que bucles for tradicionales)
saldos = [f.saldo for f in formulario.filas if f.activo]`,
    technicalBenefits: [
        "Eficiencia de Ejecución: Las 'List Comprehensions' se ejecutan a velocidad de C dentro del intérprete.",
        "Gestión de Memoria: Uso de generadores (yield) permite procesar millones de registros sin cargar todo en RAM.",
        "Legibilidad: Reducción drástica de líneas de código (boilerplate) mejorando la mantenibilidad."
    ]
  },
  {
    id: '5',
    name: 'Condicional Múltiple',
    description: 'Implementación de estructuras SWITCH/CASE para reemplazar IFs anidados.',
    upl1Code: `@si (_tipo = 1) { ... } 
@sino { @si (_tipo = 2) { ... } }`,
    upl2Code: `switch (tipo) {
  case 1: ...; break;
  case 2: ...; break;
}`,
    pythonCode: `# Pattern Matching (Python 3.10+)
match tipo_entidad:
    case 1 | 3:
        procesar_nacional()
    case 2:
        procesar_territorial()
    case _:
        raise ValueError("Tipo desconocido")`,
    technicalBenefits: [
        "Optimización Estructural: El 'Structural Pattern Matching' es más eficiente que cadenas largas de if-elif-else.",
        "Mantenibilidad: Facilita la lectura de lógica de negocio compleja basada en estados o tipos.",
        "Robustez: El caso por defecto (case _:) asegura que no existan estados no manejados."
    ]
  },
  {
    id: '6',
    name: 'Bucles Condicionales',
    description: 'Introducción de bucles WHILE (mientras) inexistentes en UPL 1.0.',
    upl1Code: `// No soportado, requiere workarounds complejos`,
    upl2Code: `while (saldo > 0) {
  saldo = saldo - amortizacion;
}`,
    pythonCode: `while saldo > 0:
    saldo -= amortizacion
    
    # Protección contra bucles infinitos
    if timeout_exceeded():
        break`,
    technicalBenefits: [
        "Control de Flujo: Permite algoritmos de convergencia y cálculos recursivos que UPL 1.0 no soportaba.",
        "Flexibilidad: Capacidad de interrumpir (break) o continuar (continue) la ejecución basada en condiciones dinámicas.",
        "Seguridad: Fácil integración con contadores de seguridad o timeouts para evitar bloqueos del sistema."
    ]
  },
  {
    id: '7',
    name: 'Acceso a Celda',
    description: 'Notación de punto (objeto.propiedad) en lugar de prefijos jerárquicos.',
    upl1Code: `FORM1.CTA.SALDO`,
    upl2Code: `formulario.cuenta.saldo`,
    pythonCode: `# Acceso directo a atributos de objetos
saldo = formulario.cuenta.saldo

# O acceso seguro a diccionarios
saldo = data.get('cuenta', {}).get('saldo', 0)`,
    technicalBenefits: [
        "Rendimiento: El acceso a atributos en clases slots (__slots__) reduce el uso de RAM y acelera la búsqueda.",
        "IntelliSense: Los IDEs modernos pueden autocompletar estas estructuras, reduciendo errores de tipografía.",
        "Encapsulamiento: Permite ocultar lógica compleja detrás de propiedades (@property) sin cambiar la sintaxis de acceso."
    ]
  },
  {
    id: '8',
    name: 'Acceso a Detalle',
    description: 'Acceso directo a colecciones anidadas sin sintaxis de corchetes complejos.',
    upl1Code: `@detalle [ variable = valor ]`,
    upl2Code: `formulario.detalles.filter(d => d.var == val)`,
    pythonCode: `# Filtrado funcional de alto rendimiento
detalles = filter(lambda d: d.var == val, formulario.detalles)

# O uso de Pandas para filtrado vectorizado
df_filtrado = df[df['var'] == val]`,
    technicalBenefits: [
        "Paralelismo de Datos: Al usar librerías como Pandas, el filtrado se vectoriza y puede ejecutarse en paralelo (SIMD).",
        "Expresividad: Permite condiciones complejas (AND, OR, NOT) en una sola línea de código legible.",
        "Velocidad: Evita bucles explícitos en el nivel de aplicación, delegando la tarea a librerías optimizadas en C."
    ]
  },
  {
    id: '9',
    name: 'Contexto',
    description: 'Objeto unificado CONTEXTO para acceder a metadatos de la entidad y periodo.',
    upl1Code: `@entidad, @periodo_anio`,
    upl2Code: `CONTEXTO.ENTIDAD.CODIGO
CONTEXTO.PERIODO.ANIO`,
    pythonCode: `from core.context import ValidationContext

def validar(ctx: ValidationContext):
    if ctx.entity.code == '41300000':
        # Lógica específica
        pass`,
    technicalBenefits: [
        "Inyección de Dependencias: Facilita el testing unitario al poder inyectar contextos simulados (mocks).",
        "Estado Global Controlado: Elimina variables globales dispersas, centralizando el estado en un objeto inmutable.",
        "Seguridad: Permite restringir el acceso a ciertos metadatos según los permisos del usuario."
    ]
  },
  {
    id: '10',
    name: 'Registro de Deficiencia',
    description: 'Función estructurada GENERAR_DEFICIENCIA con parámetros claros.',
    upl1Code: `@despliegue "Error grave en la cuenta";`,
    upl2Code: `GENERAR_DEFICIENCIA(
  "E001", "Error grave", SEVERIDAD_ALTA
);`,
    pythonCode: `from core.errors import ValidationIssue, Severity

context.report(ValidationIssue(
    code="E001",
    message=f"Error en cuenta {cta}",
    severity=Severity.BLOCKING,
    trace_id=context.transaction_id
))`,
    technicalBenefits: [
        "Trazabilidad Completa: Cada error registrado incluye metadatos automáticos (línea, timestamp, ID transacción).",
        "Estandarización: Uso de Enums para códigos y severidades asegura consistencia en todo el sistema.",
        "Integración: Los objetos de error son serializables a JSON para consumo por APIs o dashboards de BI."
    ]
  },
  {
    id: '11',
    name: 'Manejo de Excepciones',
    description: 'Bloques TRY-CATCH para capturar errores de ejecución y evitar colapsos.',
    upl1Code: `// No soportado`,
    upl2Code: `INTENTAR {
  res = a / b;
} CAPTURAR {
  log("División por cero");
}`,
    pythonCode: `try:
    resultado = calculo_complejo()
except ZeroDivisionError:
    logger.warning("División por cero detectada, usando default")
    resultado = 0
except Exception as e:
    logger.critical(f"Error inesperado: {e}", exc_info=True)`,
    technicalBenefits: [
        "Resiliencia: Evita que un solo dato corrupto detenga todo el proceso de validación masiva.",
        "Depuración: 'exc_info=True' guarda el Stack Trace completo, facilitando la identificación de la causa raíz.",
        "Granularidad: Permite definir estrategias de recuperación específicas para diferentes tipos de error."
    ]
  },
  {
    id: '12',
    name: 'Funciones de Fecha',
    description: 'Nuevas funciones nativas para manipulación de fechas.',
    upl1Code: `@fecha`,
    upl2Code: `DIFERENCIA_DIAS(fecha1, fecha2)
AGREGAR_MESES(fecha, 1)`,
    pythonCode: `from datetime import date
from dateutil.relativedelta import relativedelta

dias = (fecha2 - fecha1).days
vencimiento = fecha_corte + relativedelta(months=1)
es_habil = calendar.is_working_day(fecha)`,
    technicalBenefits: [
        "Precisión: Uso de librerías probadas (dateutil) que manejan años bisiestos y zonas horarias correctamente.",
        "Riqueza Funcional: Acceso a aritmética de fechas compleja sin reinventar la rueda.",
        "Estandarización ISO: Manejo nativo de formatos ISO 8601 para interoperabilidad."
    ]
  },
  {
    id: '13',
    name: 'Funciones de Carácter',
    description: 'Funciones estándar para manipulación de cadenas (Subcadena, Mayúsculas).',
    upl1Code: `@aCaracter(num)`,
    upl2Code: `SUB_CADENA(txt, 0, 5)
MAYUSCULAS(txt)`,
    pythonCode: `codigo_base = cuenta[0:4]  # Slicing eficiente
texto_norm = texto.strip().upper()

# Expresiones Regulares
import re
es_valido = re.match(r'^[A-Z]{3}\d{3}$', placa)`,
    technicalBenefits: [
        "Eficiencia de Texto: Las cadenas en Python son inmutables y optimizadas en C.",
        "Potencia: Acceso a motor de Expresiones Regulares (Regex) nativo para validaciones de formato complejas.",
        "Unicode: Soporte completo para caracteres especiales y tildes (UTF-8) por defecto."
    ]
  },
  {
    id: '14',
    name: 'Funciones de Agregación',
    description: 'Funciones estadísticas y de agregación nativas (SUM, AVG, MAX).',
    upl1Code: `@suma(concepto)`,
    upl2Code: `SUM(lista_valores)
PROMEDIO(lista_valores)`,
    pythonCode: `import pandas as pd
import numpy as np

# Carga de datos en estructura eficiente (DataFrame)
df = context.get_data('CGN2015_001')

# Cálculo vectorizado (C-Speed)
# En lugar de iterar fila por fila, se opera sobre toda la columna
total_debito = df['debito'].sum()
promedio_credito = df['credito'].mean()
max_valor = df['saldo_final'].max()
desviacion = df['saldo_final'].std()`,
    technicalBenefits: [
        "Paralelismo de Datos (SIMD): Las operaciones sobre columnas usan instrucciones de CPU optimizadas, siendo 100x más rápidas que bucles.",
        "Eficiencia de Memoria: Tipos de datos numéricos compactos (int64, float64) en lugar de objetos genéricos.",
        "Escalabilidad: Capacidad de procesar millones de registros en milisegundos usando motores como Pandas o Polars."
    ]
  },
  {
    id: '15',
    name: 'Validaciones Históricas',
    description: 'Consulta simplificada de datos de periodos anteriores u otras categorías.',
    upl1Code: `FORM[-1].VALOR`,
    upl2Code: `QUERY_DATA('CATEGORIA', PERIODO: ANTERIOR)`,
    pythonCode: `# Consulta optimizada a bodega de datos
historico = context.repository.query(
    category='CGN2015_001',
    period=context.period.previous_quarter,
    columns=['saldo_final']
)

comparacion = df.join(historico, on='cuenta', rsuffix='_hist')`,
    technicalBenefits: [
        "Desacoplamiento: La lógica de recuperación de datos se separa de la lógica de validación.",
        "Caché: Posibilidad de implementar caché en memoria (Redis) para datos históricos frecuentemente consultados.",
        "Optimización SQL: Las consultas se traducen a SQL eficiente en lugar de cargar todo el historial en memoria."
    ]
  },
  {
    id: '16',
    name: 'Reglas hacia Listas',
    description: 'Validación de pertenencia contra listas gestionadas centralmente.',
    upl1Code: `@si (@entidad="A" || @entidad="B"...)`,
    upl2Code: `IS_MEMBER_OF(entidad, 'LISTA_ENTIDADES_X')`,
    pythonCode: `# Uso de estructuras Hash (Set) para búsqueda O(1)
entidades_excluidas = context.ref_data.get_set('ENTIDADES_EXCLUIDAS')

if entidad_id in entidades_excluidas:
    return ValidationResult.SKIP

# Complejidad temporal constante independientemente del tamaño de la lista`,
    technicalBenefits: [
        "Velocidad Constante (O(1)): La búsqueda en Sets o HashMaps es instantánea, sin importar si la lista tiene 10 o 1 millón de elementos.",
        "Gestión Centralizada: Las listas se cargan desde una fuente única (BD/Cache), permitiendo actualizaciones en caliente.",
        "Reducción de Código: Elimina condiciones lógicas gigantescas (if x=a or x=b...), mejorando la legibilidad."
    ]
  },
  {
    id: '17',
    name: 'Datos Extensibles',
    description: 'Acceso dinámico a atributos extendidos de la entidad.',
    upl1Code: `// No soportado`,
    upl2Code: `CONTEXTO.ENTIDAD.ATRIBUTOS['TIPO_NIIF']`,
    pythonCode: `# Acceso a metadatos flexibles (JSON/NoSQL)
tipo_niif = context.entity.metadata.get('tipo_niif', 'PLENA')

if tipo_niif == 'PYMES':
    aplicar_reglas_pymes()`,
    technicalBenefits: [
        "Flexibilidad de Esquema: Permite añadir nuevos atributos a las entidades sin modificar la estructura de la base de datos relacional.",
        "Adaptabilidad: Facilita la implementación de reglas diferenciadas por atributos emergentes sin recompilar código.",
        "Integración NoSQL: Mapeo directo a campos JSONB en bases de datos modernas."
    ]
  },
  {
    id: '18',
    name: 'Variables Opcionales',
    description: 'Soporte explícito para variables opcionales (Nullables).',
    upl1Code: `// Requiere valor por defecto`,
    upl2Code: `num? valor_opcional = NULL;`,
    pythonCode: `from typing import Optional

# Definición explícita de nulabilidad
valor_opcional: Optional[float] = None

def procesar(v: Optional[float]) -> float:
    return v if v is not None else 0.0`,
    technicalBenefits: [
        "Seguridad de Tipos: El checker estático obliga a manejar el caso 'None', eliminando NullPointerExceptions.",
        "Claridad Semántica: Diferencia explícita entre 'valor cero' y 'valor no reportado'.",
        "Integridad de Datos: Permite representar fielmente la ausencia de información en la base de datos."
    ]
  }
];

export const CONTEXT_VARS: ContextVariable[] = [
  {
    category: 'Contexto Global (Sistema)',
    items: [
      { name: 'CONTEXTO.ENTIDAD.CODIGO', type: 'String', desc: 'Código CGN de la entidad' },
      { name: 'CONTEXTO.ENTIDAD.TIPO', type: 'String', desc: 'Clasificación (Nacional/Territorial)' },
      { name: 'CONTEXTO.PERIODO.ANIO', type: 'Number', desc: 'Año de la vigencia reportada' },
      { name: 'CONTEXTO.PERIODO.CORTE', type: 'String', desc: 'Mes de corte (01-12)' },
    ]
  },
  {
    category: 'K70 - Convergencia (Formularios)',
    items: [
      { name: 'CGN2015_001.SALDOS', type: 'Collection', desc: 'Reporte de Saldos y Movimientos' },
      { name: 'CGN2015_002.RECIPROCAS', type: 'Collection', desc: 'Operaciones Recíprocas' },
      { name: 'CGN2016C01.VARIACIONES', type: 'Collection', desc: 'Variaciones Trimestrales Significativas' },
      { name: 'CGN2015_001.CUENTA.SALDO_FINAL', type: 'Number', desc: 'Saldo a fin de periodo' },
    ]
  },
  {
    category: 'K90 - Control Interno (Formularios)',
    items: [
      { name: 'CGN2016.EVALUACION', type: 'Object', desc: 'Encabezado Evaluación Control Interno' },
      { name: 'CGN2016.PREGUNTAS', type: 'Collection', desc: 'Respuestas a preguntas de control' },
      { name: 'CGN2016.CALIFICACION', type: 'Number', desc: 'Puntaje calculado (1.0 - 5.0)' },
    ]
  },
  {
    category: 'Funciones Específicas',
    items: [
      { name: 'QUERY_DATA()', type: 'Func', desc: 'Consultar históricos (K70 previo)' },
      { name: 'IS_MEMBER_OF()', type: 'Func', desc: 'Validar listas (Entidades Excluidas)' },
      { name: 'GENERAR_DEFICIENCIA()', type: 'Func', desc: 'Reportar error al validador' },
    ]
  },
  {
    category: 'Mensajes Error Estándar',
    items: [
      { name: 'M4040', type: 'Const', desc: 'Formulario incompleto / Pregunta sin respuesta' },
      { name: 'PROC1905', type: 'Const', desc: 'Error aritmético Saldo Final' },
      { name: 'PROC1960', type: 'Const', desc: 'Partida Doble (Débitos != Créditos)' },
    ]
  }
];