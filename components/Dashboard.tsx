import React, { useState } from 'react';
import {  FileSpreadsheet, AlertTriangle, Zap, CheckCircle, Info, ArrowRight } from 'lucide-react';

interface StatDetail {
  id: string;
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  border: string;
  title: string;
  description: string;
  details: string[];
}

const STATS: StatDetail[] = [
  {
    id: 'efficiency',
    label: 'Eficiencia',
    value: '+40%',
    icon: Zap,
    color: 'text-[#2E7D32]',
    bg: 'bg-green-50',
    border: 'border-[#2E7D32]',
    title: 'Optimización del Motor de Ejecución',
    description: 'El aumento del 40% en la velocidad de procesamiento se logra al eliminar la interpretación en tiempo de ejecución del motor UPL legado.',
    details: [
        'Compilación JIT (Just-In-Time) a bytecode de Python.',
        'Procesamiento asíncrono y paralelo mediante librerías estándar (Asyncio/Celery).',
        'Eliminación de cuellos de botella en la lectura de datos mediante acceso optimizado a memoria.'
    ]
  },
  {
    id: 'errors',
    label: 'Falsos Positivos',
    value: '-60%',
    icon: AlertTriangle,
    color: 'text-[#E65100]',
    bg: 'bg-orange-50',
    border: 'border-[#E65100]',
    title: 'Robustez y Tipado Fuerte',
    description: 'La reducción del 60% en errores operativos y falsos positivos se debe a la introducción de reglas semánticas estrictas.',
    details: [
        'Tipado estático que previene errores de conversión de datos (String vs Number).',
        'Manejo estructurado de excepciones (Try-Catch) que evita colapsos por datos sucios.',
        'Gestión nativa de valores nulos (NULL) eliminando la ambigüedad del @UD (Undefined).'
    ]
  },
  {
    id: 'traceability',
    label: 'Trazabilidad',
    value: '100%',
    icon: CheckCircle,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-600',
    title: 'Auditoría Completa de Validaciones',
    description: 'Se garantiza el 100% de trazabilidad mediante la inyección automática de metadatos en cada ejecución de regla.',
    details: [
        'Log estructurado JSON que incluye: Usuario, Timestamp, Regla, Datos de Entrada y Resultado.',
        'Capacidad de "Replay" para reproducir validaciones históricas con los mismos datos.',
        'Vinculación directa entre el error reportado y la línea de código exacta.'
    ]
  },
  {
    id: 'python',
    label: 'Estándar',
    value: 'Python',
    icon: FileSpreadsheet,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-600',
    title: 'Adopción de Estándares de Industria',
    description: 'La migración a un ecosistema abierto permite utilizar herramientas de mercado para el mantenimiento.',
    details: [
        'Acceso a miles de librerías open-source (Pandas, NumPy, Pydantic).',
        'Facilidad para contratar talento con conocimientos preexistentes.',
        'Integración nativa con herramientas de CI/CD y análisis de calidad de código (SonarQube).'
    ]
  }
];

const Dashboard: React.FC = () => {
  const [activeStat, setActiveStat] = useState<string>('efficiency');

  const selectedStat = STATS.find(s => s.id === activeStat) || STATS[0];

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in font-sans">
      <header className="mb-10">
        <div className="inline-block bg-green-100 text-[#2E7D32] px-3 py-1 rounded-full text-xs font-bold mb-4 uppercase tracking-wide border border-green-200">
            Modernización Tecnológica
        </div>
        <h1 className="text-3xl font-black text-[#2E7D32] mb-4 uppercase tracking-tight leading-tight">
          Propuesta de actualización y mejora de los módulos de validación y evaluación del sistema CHIP
        </h1>
        <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">
          Propuesta tecnológica para la modernización del módulo de validaciones del sistema CHIP. 
          El objetivo es mejorar la calidad de la información contable pública mediante una sintaxis más expresiva (UPL 2.0) y una arquitectura escalable.
        </p>
      </header>

      {/* Interactive Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {STATS.map((stat) => {
            const Icon = stat.icon;
            const isActive = activeStat === stat.id;
            
            return (
                <button
                    key={stat.id}
                    onClick={() => setActiveStat(stat.id)}
                    className={`p-6 rounded-lg border-l-4 text-left transition-all duration-300 relative overflow-hidden group ${
                        isActive 
                        ? `${stat.border} bg-white shadow-lg ring-1 ring-slate-200 scale-105 z-10` 
                        : `${stat.border} bg-white shadow-sm hover:shadow-md hover:bg-slate-50 opacity-90`
                    }`}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className={`${stat.bg} p-2 rounded transition-colors group-hover:bg-opacity-80`}>
                            <Icon className={stat.color} size={24} />
                        </div>
                        <span className={`text-sm font-bold ${stat.color} ${stat.bg} px-3 py-1 rounded-full`}>
                            {stat.value}
                        </span>
                    </div>
                    <h3 className="text-xl font-black text-slate-800 mb-1">{stat.label}</h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Clic para ver detalles</p>
                    
                    {isActive && (
                        <div className={`absolute bottom-0 left-0 w-full h-1 ${stat.bg.replace('bg-', 'bg-')}`}></div>
                    )}
                </button>
            );
        })}
      </div>

      {/* Dynamic Detail Section */}
      <div className="mb-12 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden animate-fade-in flex flex-col md:flex-row">
        <div className={`w-2 bg-gradient-to-b ${selectedStat.bg.replace('bg-', 'from-')}-400 to-white`}></div>
        <div className="p-8 flex-1">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className={`text-2xl font-black mb-2 flex items-center gap-3 ${selectedStat.color}`}>
                        {React.createElement(selectedStat.icon, { size: 28 })}
                        {selectedStat.title}
                    </h3>
                    <p className="text-slate-600 text-lg leading-relaxed">
                        {selectedStat.description}
                    </p>
                </div>
            </div>
            
            <div className="mt-6 bg-slate-50 rounded-lg p-6 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Info size={14} /> Factores Clave de Éxito
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {selectedStat.details.map((detail, index) => (
                        <li key={index} className="flex flex-col gap-2">
                            <div className={`w-8 h-1 rounded-full ${selectedStat.bg.replace('bg-', 'bg-')}-400`}></div>
                            <p className="text-sm font-medium text-slate-700 leading-snug">
                                {detail}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
      </div>

      {/* Comparison Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded border border-slate-200 p-6 shadow-sm">
          <h3 className="text-xl font-bold text-[#E65100] mb-4 uppercase flex items-center gap-2">
            <AlertTriangle size={20} /> Problemas Actuales (UPL 1.0)
          </h3>
          <ul className="space-y-4">
            {[
              "Sintaxis críptica y verbosa (uso excesivo de @ y _)",
              "Imposibilidad de anidar bucles de iteración complejos",
              "Manejo de errores imperativo sin excepciones estructuradas",
              "Difícil mantenimiento de listas de valores dentro del código"
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 p-3 rounded hover:bg-orange-50 transition-colors">
                <div className="min-w-[20px] pt-1">
                  <div className="w-2 h-2 rounded-full bg-[#E65100]"></div>
                </div>
                <p className="text-slate-700 text-sm font-medium">{item}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-[#2E7D32] rounded p-6 shadow-lg text-white border-t-4 border-[#FF9800]">
          <h3 className="text-xl font-bold mb-4 uppercase flex items-center gap-2">
            <CheckCircle size={20} className="text-green-300" /> Solución Propuesta (UPL 2.0)
          </h3>
          <ul className="space-y-4">
            {[
              "Sintaxis limpia y fuertemente tipada",
              "Soporte nativo para estructuras anidadas y TRY-CATCH",
              "Objeto de Contexto Unificado para acceso a metadatos",
              "Funciones avanzadas de consulta (QUERY_DATA, IS_MEMBER_OF)",
              "Plan de migración gradual y transparente a Python"
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 p-3 rounded hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
                <div className="min-w-[20px] pt-1">
                  <ArrowRight size={14} className="text-[#FF9800]" />
                </div>
                <p className="text-green-50 text-sm font-medium">{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;