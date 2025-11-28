import React from 'react';
import { Save, RotateCcw } from 'lucide-react';

const SaveCalculationSection = ({
    label,
    setLabel,
    description,
    setDescription,
    onSave,
    onClear,
    saving,
    saveButtonText = 'Guardar Cálculo'
}) => {
    return (
        <div className="mt-12 bg-slate-950 rounded-xl border border-slate-800 p-6">
            <div className="flex items-center gap-2 mb-4 text-slate-400 border-b border-slate-800 pb-2">
                <Save size={18} />
                <h3 className="font-bold uppercase tracking-wider text-xs">Guardar en Historial</h3>
            </div>

            <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Etiqueta</label>
                        <input
                            type="text"
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            placeholder="Ej. Identificador del equipo"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-cyan-500 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Descripción</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Ubicación, detalles adicionales..."
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-cyan-500 h-[50px] resize-none pt-3 transition-colors"
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={onClear}
                        className="flex-1 py-3 rounded-xl bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white transition-all font-bold flex items-center justify-center gap-2 border border-slate-800"
                    >
                        <RotateCcw size={20} />
                        Limpiar
                    </button>
                    <button
                        onClick={onSave}
                        disabled={saving}
                        className="flex-[2] py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save size={20} />
                        {saving ? 'Guardando...' : saveButtonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SaveCalculationSection;
