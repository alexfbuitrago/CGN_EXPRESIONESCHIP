import React, { useState } from 'react';
import { RULES_DATA } from '../constants';
import { CheckCircle2, XCircle, Info, ChevronDown, Cpu, Terminal, Zap, ShieldCheck } from 'lucide-react';

const ComparisonView: React.FC = () => {
  const [selectedRuleId, setSelectedRuleId] = useState(RULES_DATA[0].id);
  const activeRule = RULES_DATA.find(r => r.id === selectedRuleId) || RULES_DATA[0];

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in bg-slate-50 min-h-full pb-20">
      <div className="mb-8 border-b border-slate-200 pb-6">
        <h2 className="text-3xl font-black text-[#2E7D32] mb-2 uppercase tracking-tight">Evolución Sintáctica UPL</h2>
        <p className="text-slate-600 max-w-3xl">
            Análisis comparativo técnico entre el estándar actual (Legacy) y la propuesta de modernización v2.0. 
            Seleccione una categoría para visualizar las mejoras en expresividad, control y rendimiento.
        </p>
      </div>

      <div className="mb-6 bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-4 border-l-4 border-l-[#2E7D32]">
        <div className="bg-[#2E7D32] p-2 rounded">
            <Info className="text-white" size={24} />
        </div>
        <div className="flex-1">
            <label className="block text-xs font-bold text-[#2E7D32] uppercase tracking-wider mb-1">Seleccionar Regla de Validación</label>
            <div className="relative">
                <select 
                    value={selectedRuleId}
                    onChange={(e) => setSelectedRuleId(e.target.value)}
                    className="w-full appearance-none bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded focus:ring-[#2E7D32] focus:border-[#2E7D32] block p-2.5 font-bold cursor-pointer"
                >
                    {RULES_DATA.map(rule => (
                        <option key={rule.id} value={rule.id}>
                            {rule.id}. {rule.name}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#2E7D32]">
                    <ChevronDown size={16} />
                </div>
            </div>
        </div>
      </div>

      <div className="bg-white rounded shadow-md border border-slate-200 overflow-hidden mb-8">
        <div className="p-6 border-b border-slate-100 bg-[#f8f9fa] flex justify-between items-start">
            <div>
                <h3 className="text-xl font-bold text-[#2E7D32]">{activeRule.name}</h3>
                <p className="text-sm text-slate-600 mt-1">{activeRule.description}</p>
            </div>
            <span className="bg-[#2E7D32] text-white text-xs font-bold px-3 py-1 rounded-full">
                ID: {activeRule.id}
            </span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          {/* UPL 1.0 Panel */}
          <div className="p-0 flex flex-col h-full bg-slate-50/30">
            <div className="px-6 py-3 border-b border-slate-200 flex justify-between items-center bg-orange-50">
              <span className="text-xs font-bold text-[#E65100] uppercase tracking-wider">UPL 1.0 (Actual)</span>
              <span className="text-[10px] text-[#E65100] bg-orange-100 px-2 py-0.5 rounded font-bold border border-orange-200">Deprecado</span>
            </div>
            <div className="p-6 font-mono text-sm overflow-auto flex-1 bg-white min-h-[200px] border-l-4 border-[#E65100]">
              <pre className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                {activeRule.upl1Code}
              </pre>
            </div>
            <div className="px-6 py-4 bg-orange-50 border-t border-slate-200">
              <h4 className="text-xs font-bold text-[#E65100] mb-2 flex items-center gap-1">
                <XCircle size={14} /> Limitaciones Detectadas
              </h4>
              <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                <li>Sintaxis no estándar (curva de aprendizaje alta)</li>
                <li>Dificultad en mantenimiento y depuración</li>
              </ul>
            </div>
          </div>

          {/* UPL 2.0 Panel */}
          <div className="p-0 flex flex-col h-full bg-green-50/10">
            <div className="px-6 py-3 border-b border-slate-200 flex justify-between items-center bg-green-50">
              <span className="text-xs font-bold text-[#2E7D32] uppercase tracking-wider">UPL 2.0 (Propuesta)</span>
              <span className="text-[10px] text-[#2E7D32] bg-green-100 px-2 py-0.5 rounded font-bold border border-green-200">Estándar</span>
            </div>
            <div className="p-6 font-mono text-sm overflow-auto flex-1 bg-white min-h-[200px] relative border-l-4 border-[#2E7D32]">
              <pre className="text-slate-800 leading-relaxed whitespace-pre-wrap font-bold">
                {activeRule.upl2Code}
              </pre>
            </div>
            <div className="px-6 py-4 bg-green-50 border-t border-slate-200">
              <h4 className="text-xs font-bold text-[#2E7D32] mb-2 flex items-center gap-1">
                <CheckCircle2 size={14} /> Mejora Sintáctica
              </h4>
              <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                <li>Tipado fuerte y estructura legible</li>
                <li>Transpilación directa a lenguajes modernos</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Advantages Section */}
      <div className="bg-white rounded shadow-md border border-slate-200 mb-8 overflow-hidden">
          <div className="bg-[#2E7D32] px-6 py-4 flex items-center gap-2">
              <Cpu className="text-white" size={20} />
              <h3 className="text-white font-bold uppercase text-sm tracking-widest">Análisis de Ventajas Técnicas (Motor Python)</h3>
          </div>
          <div className="p-6 bg-slate-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {activeRule.technicalBenefits?.map((benefit, index) => {
                    const icon = index === 0 ? <Zap size={18} /> : index === 1 ? <Cpu size={18} /> : <ShieldCheck size={18} />;
                    const color = index === 0 ? 'text-amber-600' : index === 1 ? 'text-blue-600' : 'text-green-600';
                    
                    const [title, desc] = benefit.split(':');

                    return (
                        <div key={index} className={`p-4 rounded border border-slate-200 bg-white shadow-sm flex flex-col gap-2`}>
                            <div className={`flex items-center gap-2 text-xs font-black uppercase tracking-wide ${color}`}>
                                {icon}
                                {title}
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                {desc ? desc.trim() : benefit}
                            </p>
                        </div>
                    )
                })}
              </div>
          </div>
      </div>

      {/* Full Width Python Code Section */}
      <div className="rounded-lg shadow-lg overflow-hidden border-t-4 border-[#FF9800]">
        <div className="bg-[#1e293b] px-6 py-3 flex items-center justify-between">
          <h4 className="font-bold text-white text-sm flex items-center gap-2 font-mono">
            <Terminal className="text-[#FF9800]" size={16} />
            Sintaxis Python Generada
          </h4>
          <span className="text-[10px] text-slate-400 font-mono">Python 3.10+</span>
        </div>
        <div className="bg-[#0f172a] p-6 overflow-x-auto">
             <pre className="font-mono text-sm text-green-400 leading-relaxed">
                <code dangerouslySetInnerHTML={{ 
                    __html: activeRule.pythonCode
                        .replace(/import/g, '<span class="text-purple-400">import</span>')
                        .replace(/from/g, '<span class="text-purple-400">from</span>')
                        .replace(/def /g, '<span class="text-blue-400">def </span>')
                        .replace(/class /g, '<span class="text-blue-400">class </span>')
                        .replace(/return/g, '<span class="text-purple-400">return</span>')
                        .replace(/if /g, '<span class="text-purple-400">if </span>')
                        .replace(/else/g, '<span class="text-purple-400">else</span>')
                        .replace(/#/g, '<span class="text-slate-500">#</span>')
                 }} />
             </pre>
        </div>
        <div className="bg-[#1e293b] px-6 py-2 border-t border-slate-700">
             <p className="text-xs text-slate-400 flex items-center gap-2">
                 <Info size={12} />
                 El código mostrado incluye contexto y librerías estándar (Pandas/NumPy) para demostrar la implementación real.
             </p>
        </div>
      </div>
    </div>
  );
};

export default ComparisonView;