import React from 'react';
import { ViewState } from '../types';
import { LayoutDashboard, FileCode, Edit3, GitMerge, Puzzle, LogOut } from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

// Custom CHIP Logo (Green/Orange/Black pie with arrow)
const ChipLogo = () => (
  <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
    <circle cx="50" cy="50" r="48" fill="white" stroke="#e2e8f0" strokeWidth="2" />
    <path d="M50 50 L50 10 A40 40 0 0 1 90 50 Z" fill="#8BC34A" /> {/* Top Right - Light Green */}
    <path d="M50 50 L90 50 A40 40 0 0 1 50 90 Z" fill="#2E7D32" /> {/* Bottom Right - CHIP Green */}
    <path d="M50 50 L50 90 A40 40 0 0 1 10 50 Z" fill="#FF9800" /> {/* Bottom Left - Orange */}
    <path d="M50 50 L10 50 A40 40 0 0 1 50 10 Z" fill="#1a1a1a" /> {/* Top Left - Black */}
    {/* Upward Trend Arrow */}
    <path d="M35 65 L65 35 M65 35 L45 35 M65 35 L65 55" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const menuItems = [
    { id: ViewState.DASHBOARD, label: 'Inicio', icon: LayoutDashboard },
    { id: ViewState.COMPARISON, label: 'Comparativa UPL', icon: GitMerge },
    { id: ViewState.VISUAL_BUILDER, label: 'Constructor', icon: Puzzle },
    { id: ViewState.EDITOR, label: 'Editor Avanzado', icon: Edit3 },
    { id: ViewState.PYTHON_ROADMAP, label: 'Migración Python', icon: FileCode },
  ];

  return (
    <div className="w-64 bg-[#2E7D32] text-white h-screen flex flex-col fixed left-0 top-0 shadow-xl z-50 font-sans">
      {/* Header CHIP Style */}
      <div className="p-0 border-b border-[#1B5E20]">
        <div className="bg-[#FF9800] h-1.5 w-full"></div> {/* Gov Orange Line */}
        <div className="p-6">
            <div className="flex items-center gap-3 mb-2">
                <ChipLogo />
                <div>
                    <h1 className="text-3xl font-black tracking-tighter italic leading-none">CHIP</h1>
                </div>
            </div>
            <p className="text-[9px] text-white uppercase tracking-wider leading-tight font-medium opacity-90 pl-1">
                Sistema Consolidador de Hacienda e Información Pública
            </p>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        <p className="px-4 text-[10px] font-bold text-green-100 uppercase mb-2 tracking-widest">Menú Principal</p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm transition-all duration-200 group font-medium ${
                isActive 
                  ? 'bg-white text-[#2E7D32] font-bold shadow-md translate-x-1' 
                  : 'text-white hover:bg-[#1B5E20]'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-[#FF9800]' : 'text-green-100 group-hover:text-white'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 bg-[#1B5E20] border-t border-[#144718]">
        <div className="flex items-center gap-3 text-xs text-white mb-4">
             <div className="w-8 h-8 rounded bg-white flex items-center justify-center font-bold text-[#2E7D32]">
                AD
             </div>
             <div>
                 <p className="font-bold">Administrador</p>
                 <p className="opacity-70 text-[10px]">Contaduría General de la Nación</p>
             </div>
        </div>
        <button className="w-full flex items-center justify-center gap-2 text-xs text-white hover:text-[#FF9800] py-2 border border-white/20 rounded hover:bg-white transition-colors uppercase font-bold tracking-wide">
            <LogOut size={12} /> Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default Sidebar;