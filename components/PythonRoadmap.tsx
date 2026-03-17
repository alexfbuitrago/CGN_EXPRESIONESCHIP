import React, { useState } from 'react';
import { CheckCircle, Code, Server, Layers, ExternalLink, BookOpen, ArrowRight, ShieldCheck, Zap, Database } from 'lucide-react';

interface Library {
  name: string;
  desc: string;
  url: string;
  icon: React.ElementType;
  phase: number;
}

const LIBRARIES: Library[] = [
  // Phase 1
  { name: 'Pydantic', desc: 'Validación de datos y gestión de configuraciones mediante tipado fuerte.', url: 'https://docs.pydantic.dev/', icon: ShieldCheck, phase: 1 },
  { name: 'Pytest', desc: 'Framework maduro para pruebas unitarias y funcionales.', url: 'https://docs.pytest.org/', icon: CheckCircle, phase: 1 },
  { name: 'Poetry', desc: 'Gestión de dependencias y empaquetado de Python.', url: 'https://python-poetry.org/', icon: Code, phase: 1 },
  // Phase 2
  { name: 'FastAPI', desc: 'Framework web moderno y rápido para construir APIs con Python 3.6+.', url: 'https://fastapi.tiangolo.com/', icon: Zap, phase: 2 },
  { name: 'SQLAlchemy', desc: 'Toolkit SQL y Mapeo Objeto-Relacional (ORM).', url: 'https://www.sqlalchemy.org/', icon: Database, phase: 2 },
  { name: 'Celery', desc: 'Cola de tareas asíncrona distribuida.', url: 'https://docs.celeryq.dev/', icon: Layers, phase: 2 },
  // Phase 3
  { name: 'Pandas', desc: 'Análisis y manipulación de datos potente y flexible.', url: 'https://pandas.pydata.org/', icon: Server, phase: 3 },
  { name: 'Sphinx', desc: 'Generador de documentación inteligente y hermoso.', url: 'https://www.sphinx-doc.org/', icon: BookOpen, phase: 3 },
  { name: 'Apache Kafka', desc: 'Plataforma de transmisión de eventos distribuida (Integración).', url: 'https://kafka.apache.org/', icon: Server, phase: 3 },
];

const PHASES = [
  {
    id: 1,
    title: "FASE 1: Piloto Controlado",
    subtitle: "Validación Complementaria",
    desc: "Uso de Python en módulos externos y pruebas de concepto sin afectar el núcleo operativo. Enfoque en calidad de datos y pruebas.",
    icon: Code,
    color: "bg-blue-600",
    borderColor: "border-blue-600"
  },
  {
    id: 2,
    title: "FASE 2: Arquitectura Híbrida",
    subtitle: "Procesamiento Asíncrono",
    desc: "Integración reactiva para validaciones masivas. Convivencia entre el motor UPL actual y microservicios Python.",
    icon: Layers,
    color: "bg-indigo-600",
    borderColor: "border-indigo-600"
  },
  {
    id: 3,
    title: "FASE 3: Estándar de Industria",
    subtitle: "Núcleo Python Nativo",
    desc: "Reemplazo gradual del motor UPL. Reglas de negocio empaquetadas como librerías versionadas y documentadas.",
    icon: Server,
    color: "bg-emerald-600",
    borderColor: "border-emerald-600"
  }
];

const PythonRoadmap: React.FC = () => {
  const [activePhase, setActivePhase] = useState<number>(1);

  const activePhaseData = PHASES.find(p => p.id === activePhase);
  const filteredLibs = LIBRARIES.filter(l => l.phase === activePhase);

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in pb-20 font-sans">
      <div className="text-center mb-10">
        <div className="inline-block bg-[#2E7D32] text-white px-4 py-1 rounded-full text-xs font-bold mb-3 uppercase tracking-widest border border-green-800 shadow-sm">
            Estrategia de Modernización
        </div>
        <h2 className="text-3xl font-black text-[#2E7D32] mb-4 uppercase tracking-tight">
            Hoja de Ruta: De UPL a Python
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
          Un enfoque interactivo para la transición tecnológica del sistema CHIP, asegurando continuidad operativa y adopción de estándares abiertos.
        </p>
      </div>

      {/* Interactive Phase Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 relative z-10">
        {PHASES.map((phase) => {
            const Icon = phase.icon;
            const isActive = activePhase === phase.id;
            
            return (
                <button
                    key={phase.id}
                    onClick={() => setActivePhase(phase.id)}
                    className={`relative p-6 rounded-xl border-2 transition-all duration-300 text-left group overflow-hidden ${
                        isActive 
                        ? `${phase.borderColor} bg-white shadow-xl scale-[1.02]` 
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                >
                    {isActive && (
                        <div className={`absolute top-0 left-0 w-full h-1.5 ${phase.color}`}></div>
                    )}
                    <div className="flex items-center justify-between mb-4">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center text-white shadow-md transition-colors ${isActive ? phase.color : 'bg-slate-400'}`}>
                            <Icon size={20} />
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded ${isActive ? 'bg-slate-100 text-slate-800' : 'text-slate-400'}`}>
                            Fase {phase.id}
                        </span>
                    </div>
                    <h3 className={`text-lg font-bold mb-1 ${isActive ? 'text-[#2E7D32]' : 'text-slate-600'}`}>
                        {phase.title}
                    </h3>
                    <p className="text-xs font-bold text-[#FF9800] uppercase tracking-wide mb-3">
                        {phase.subtitle}
                    </p>
                    <p className="text-sm text-slate-500 leading-relaxed">
                        {phase.desc}
                    </p>
                </button>
            );
        })}
      </div>

      {/* Dynamic Content Area */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden animate-fade-in">
        <div className="bg-[#2E7D32] p-6 border-b border-[#1B5E20] flex justify-between items-center">
            <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Database className="text-[#FF9800]" />
                    Ecosistema Tecnológico Recomendado
                </h3>
                <p className="text-green-100 text-xs mt-1">Librerías y herramientas sugeridas para la {activePhaseData?.title}</p>
            </div>
            <div className="hidden md:block">
                 <span className="text-xs font-bold text-white bg-white/10 px-3 py-1 rounded border border-white/20">
                    Fase {activePhase} Activa
                 </span>
            </div>
        </div>
        
        <div className="p-8 bg-slate-50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLibs.map((lib) => {
                    const LibIcon = lib.icon;
                    return (
                        <a 
                            key={lib.name}
                            href={lib.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm hover:shadow-md hover:border-green-300 hover:-translate-y-1 transition-all group flex flex-col h-full"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className="p-2 bg-green-50 rounded-lg text-[#2E7D32] group-hover:bg-[#2E7D32] group-hover:text-white transition-colors">
                                    <LibIcon size={20} />
                                </div>
                                <ExternalLink size={16} className="text-slate-400 group-hover:text-[#FF9800]" />
                            </div>
                            <h4 className="font-bold text-[#2E7D32] text-lg mb-2 group-hover:text-[#FF9800] transition-colors">
                                {lib.name}
                            </h4>
                            <p className="text-sm text-slate-600 mb-4 flex-1 leading-relaxed">
                                {lib.desc}
                            </p>
                            <div className="pt-3 border-t border-slate-100 mt-auto">
                                <span className="text-xs font-bold text-green-600 flex items-center gap-1 group-hover:underline">
                                    Ver Documentación <ArrowRight size={12} />
                                </span>
                            </div>
                        </a>
                    );
                })}
            </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-slate-500 italic">
            * Las librerías sugeridas son estándar de código abierto (Open Source) y cuentan con soporte empresarial activo.
        </p>
      </div>
    </div>
  );
};

export default PythonRoadmap;