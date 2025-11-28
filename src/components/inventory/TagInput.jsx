import React from 'react';
import { Plus, Tag, X } from 'lucide-react';

const TagInput = ({ tags, currentTag, setCurrentTag, onAddTag, onRemoveTag, onKeyDown }) => {
    return (
        <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Especificaciones / Etiquetas</label>
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                <div className="flex gap-2 mb-3">
                    <input
                        type="text"
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        onKeyDown={onKeyDown}
                        placeholder="Escribe algo (ej. Potencia: 100W) y presiona Enter"
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                    <button
                        type="button"
                        onClick={onAddTag}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors active:scale-95"
                    >
                        <Plus size={18} />
                    </button>
                </div>

                <div className="flex flex-wrap gap-2">
                    {tags.length === 0 && (
                        <span className="text-slate-600 text-xs italic">No hay etiquetas agregadas.</span>
                    )}
                    {tags.map((tag, index) => (
                        <div key={index} className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-sm">
                            <Tag size={12} />
                            <span>{tag}</span>
                            <button
                                type="button"
                                onClick={() => onRemoveTag(index)}
                                className="hover:text-white transition-colors"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TagInput;
