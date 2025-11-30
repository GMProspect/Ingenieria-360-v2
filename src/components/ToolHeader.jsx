import React from 'react';
import { RotateCcw, Save } from 'lucide-react';

const ToolHeader = ({ title, subtitle, icon: Icon, iconColorClass = "text-cyan-400", iconBgClass = "bg-cyan-500/20", onReset }) => {
    return (
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${iconBgClass} ${iconColorClass}`}>
                    <Icon size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white">{title}</h1>
                    <p className="text-slate-400">{subtitle}</p>
                </div>
            </div>

            {onSave && (
                <button
                    onClick={onSave}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-400 rounded-lg transition-all border border-slate-700 hover:border-cyan-500/50 mr-2"
                >
                    <Save size={18} />
                    <span className="font-bold text-sm hidden sm:inline">Guardar</span>
                </button>
            )}
            {onReset && (
                <button
                    onClick={onReset}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-all border border-slate-700 hover:border-red-500/50"
                >
                    <RotateCcw size={18} />
                    <span className="font-bold text-sm hidden sm:inline">Reiniciar</span>
                </button>
            )}
        </div>
    );
};

export default ToolHeader;
