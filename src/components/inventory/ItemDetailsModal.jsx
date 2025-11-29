import React from 'react';
import { X, Database, Calendar, Tag, Layers } from 'lucide-react';

const ItemDetailsModal = ({ isOpen, onClose, item }) => {
    if (!isOpen || !item) return null;

    // Parse specs/tags
    const tags = Array.isArray(item.specs)
        ? item.specs
        : Object.entries(item.specs || {}).map(([k, v]) => `${k}: ${v}`);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl relative overflow-hidden animate-scale-in">

                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-start bg-slate-900/50">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-cyan-500/20 rounded-xl text-cyan-400">
                            <Database size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">{item.name}</h2>
                            <p className="text-slate-400 text-sm">{item.brand} - {item.model}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-white/5 rounded-lg"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">

                    {/* Main Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5">
                            <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-wider mb-1">
                                <Layers size={14} />
                                Cantidad
                            </div>
                            <div className={`text-lg font-bold ${item.quantity > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {item.quantity} Unidades
                            </div>
                        </div>
                        <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5">
                            <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-wider mb-1">
                                <Calendar size={14} />
                                Adquisición
                            </div>
                            <div className="text-lg font-bold text-slate-200">
                                {item.acquisition_date ? new Date(item.acquisition_date + 'T00:00:00').toLocaleDateString('es-ES') : '-'}
                            </div>
                        </div>
                    </div>

                    {/* Tags / Specs */}
                    <div>
                        <div className="flex items-center gap-2 text-slate-400 text-sm font-medium mb-3">
                            <Tag size={16} />
                            Especificaciones / Etiquetas
                        </div>
                        {tags.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag, idx) => (
                                    <span
                                        key={idx}
                                        className="px-3 py-1.5 bg-slate-800 text-slate-300 text-sm rounded-lg border border-slate-700"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-500 italic text-sm">Sin especificaciones registradas.</p>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/5 bg-slate-950/30 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium text-sm"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ItemDetailsModal;
