import React, { useState, useEffect, useRef } from 'react';
import { Save, X, ChevronDown, RotateCcw } from 'lucide-react';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/Auth';

const SaveModal = ({
    isOpen,
    onClose,
    label,
    setLabel,
    description,
    setDescription,
    onSave,
    onClear,
    saving,
    saveButtonText = 'Guardar Cálculo',
    isSessionActive = false
}) => {
    const { user } = useAuth();
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef(null);

    // Fetch inventory tags for autocomplete
    useEffect(() => {
        const fetchTags = async () => {
            if (!user) return;
            try {
                const { data, error } = await supabase
                    .from('inventory')
                    .select('name, tag')
                    .eq('user_id', user.id);

                if (data) {
                    const tags = data.map(item => item.tag).filter(Boolean);
                    setSuggestions([...new Set(tags)]);
                }
            } catch (err) {
                console.error('Error fetching tags:', err);
            }
        };
        if (isOpen) fetchTags();
    }, [user, isOpen]);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const filteredSuggestions = suggestions.filter(tag =>
        tag.toLowerCase().includes(label.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl relative overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/50">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Save size={20} className="text-cyan-400" />
                        Guardar Cálculo
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {isSessionActive && (
                        <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center gap-3 mb-4">
                            <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                                <RotateCcw size={20} />
                            </div>
                            <div>
                                <p className="text-purple-200 font-bold text-sm">Sesión Activa</p>
                                <p className="text-purple-300/70 text-xs">Editando: {label}</p>
                            </div>
                        </div>
                    )}

                    <div className="relative" ref={wrapperRef}>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">Tag / Equipo</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={label}
                                onChange={(e) => {
                                    setLabel(e.target.value);
                                    setShowSuggestions(true);
                                }}
                                onFocus={() => setShowSuggestions(true)}
                                placeholder="Ej. BOMBA-01"
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500 transition-colors"
                                autoComplete="off"
                            />
                            {suggestions.length > 0 && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                                    <ChevronDown size={16} />
                                </div>
                            )}
                        </div>

                        {/* Autocomplete Dropdown */}
                        {showSuggestions && filteredSuggestions.length > 0 && (
                            <div className="absolute z-50 w-full mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                                {filteredSuggestions.map((tag, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setLabel(tag);
                                            setShowSuggestions(false);
                                        }}
                                        className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors border-b border-slate-800/50 last:border-0"
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">Descripción</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Ubicación, detalles adicionales..."
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500 h-[80px] resize-none transition-colors"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-800 bg-slate-950/30 flex gap-3">
                    <button
                        onClick={onClear}
                        className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all font-bold flex items-center justify-center gap-2 border border-slate-700"
                    >
                        <RotateCcw size={18} />
                        Limpiar
                    </button>
                    <button
                        onClick={() => {
                            onSave();
                            // Optional: Close modal after save if successful? 
                            // Usually handled by parent or we can check saving state
                        }}
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

export default SaveModal;
