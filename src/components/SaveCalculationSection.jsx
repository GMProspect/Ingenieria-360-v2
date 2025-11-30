import React, { useState, useEffect, useRef } from 'react';
import { Save, RotateCcw, ChevronDown } from 'lucide-react';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/Auth';

const SaveCalculationSection = ({
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
                    // Combine name and tag for search
                    const tags = data.map(item => item.tag).filter(Boolean);
                    setSuggestions([...new Set(tags)]); // Unique tags
                }
            } catch (err) {
                console.error('Error fetching tags:', err);
            }
        };
        fetchTags();
    }, [user]);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredSuggestions = suggestions.filter(tag =>
        tag.toLowerCase().includes(label.toLowerCase())
    );

    // --- ACTIVE SESSION VIEW ---
    if (isSessionActive) {
        return (
            <div className="mt-8 bg-slate-900/80 rounded-xl border border-purple-500/30 p-6 animate-fade-in relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 p-20 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

                <div className="flex items-center justify-between mb-6 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                            <RotateCcw size={20} className="animate-pulse-slow" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-lg">{label}</h3>
                            <p className="text-slate-400 text-xs">Sesión Activa • {description || 'Sin descripción'}</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                    <button
                        onClick={onClear}
                        className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all font-bold flex items-center justify-center gap-2 border border-slate-700"
                    >
                        <RotateCcw size={18} />
                        Nuevo / Limpiar
                    </button>
                    <button
                        onClick={onSave}
                        disabled={saving}
                        className="flex-[2] py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save size={18} />
                        {saving ? 'Guardando...' : 'Guardar Medición'}
                    </button>
                </div>
            </div>
        );
    }

    // --- STANDARD VIEW ---
    return (
        <div className="mt-12 bg-slate-950 rounded-xl border border-slate-800 p-6">
            <div className="flex items-center gap-2 mb-4 text-slate-400 border-b border-slate-800 pb-2">
                <Save size={18} />
                <h3 className="font-bold uppercase tracking-wider text-xs">Guardar en Historial</h3>
            </div>

            <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative" ref={wrapperRef}>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Tag / Equipo (Para Tendencias)</label>
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
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-cyan-500 transition-colors"
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
                            <div className="absolute z-50 w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                                {filteredSuggestions.map((tag, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setLabel(tag);
                                            setShowSuggestions(false);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors border-b border-slate-800/50 last:border-0"
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        )}
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

                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={onClear}
                        className="w-full sm:flex-1 py-3 rounded-xl bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white transition-all font-bold flex items-center justify-center gap-2 border border-slate-800"
                    >
                        <RotateCcw size={20} />
                        Limpiar
                    </button>
                    <button
                        onClick={onSave}
                        disabled={saving}
                        className="w-full sm:flex-[2] py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
