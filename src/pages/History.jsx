import React, { useState, useEffect } from 'react';
import { History as HistoryIcon, Trash2, Search, Info } from 'lucide-react';
import TrendChart from '../components/TrendChart';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/Auth';
import BackButton from '../components/BackButton';

const History = () => {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'trend'
    const [selectedTag, setSelectedTag] = useState('');
    const [selectedTool, setSelectedTool] = useState('Megóhmetro');

    // Extract unique tags for dropdown
    const uniqueTags = [...new Set(history.map(item => item.label))].filter(Boolean).sort();
    const uniqueTools = [...new Set(history.map(item => item.tool_name))].filter(Boolean).sort();

    // Filter data for Trend View
    const trendData = history.filter(item =>
        item.tool_name === selectedTool &&
        item.label === selectedTag
    ).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Keep newest first for table, chart reverses it

    return (
        <div className="max-w-6xl mx-auto p-6">
            <BackButton />
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
                        <HistoryIcon size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Historial de Cálculos</h1>
                        <p className="text-slate-400">Registro de todas las operaciones guardadas</p>
                    </div>
                </div>

                {/* View Toggle */}
                <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'list' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Lista
                    </button>
                    <button
                        onClick={() => setViewMode('trend')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'trend' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Tendencias 📈
                    </button>
                </div>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 backdrop-blur-sm shadow-xl">

                {viewMode === 'list' ? (
                    <>
                        {/* Search Bar */}
                        <div className="mb-6 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                            <input
                                type="text"
                                placeholder="Buscar por etiqueta, herramienta o descripción..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white focus:border-purple-500 outline-none transition-colors"
                            />
                        </div>

                        {loading ? (
                            <div className="text-center py-12 text-slate-500">Cargando historial...</div>
                        ) : filteredHistory.length === 0 ? (
                            <div className="text-center py-12 text-slate-500">No hay registros guardados.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="text-slate-400 border-b border-slate-800">
                                            <th className="p-4 font-medium">Fecha</th>
                                            <th className="p-4 font-medium">Herramienta</th>
                                            <th className="p-4 font-medium">Tag / Equipo</th>
                                            <th className="p-4 font-medium">Datos</th>
                                            <th className="p-4 font-medium text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {filteredHistory.map((item) => (
                                            <tr key={item.id} className="hover:bg-slate-800/30 transition-colors group">
                                                <td className="p-4 text-slate-300 whitespace-nowrap text-sm">
                                                    {formatDate(item.created_at)}
                                                </td>
                                                <td className="p-4 text-white font-bold">
                                                    {item.tool_name}
                                                </td>
                                                <td className="p-4">
                                                    <div className="text-purple-400 font-mono font-bold">{item.label}</div>
                                                    {item.description && (
                                                        <div className="text-xs text-slate-400 mt-1 italic max-w-xs truncate">
                                                            {item.description}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="p-4">
                                                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                                        {formatData(item.data)}
                                                    </div>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors active:scale-95"
                                                        title="Eliminar registro"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="space-y-6 animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-slate-400 mb-2 text-sm font-medium">Herramienta</label>
                                <select
                                    value={selectedTool}
                                    onChange={(e) => setSelectedTool(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none"
                                >
                                    {uniqueTools.map(tool => (
                                        <option key={tool} value={tool}>{tool}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-slate-400 mb-2 text-sm font-medium">Seleccionar Equipo (Tag)</label>
                                <select
                                    value={selectedTag}
                                    onChange={(e) => setSelectedTag(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none"
                                >
                                    <option value="">-- Seleccionar Tag --</option>
                                    {uniqueTags.map(tag => (
                                        <option key={tag} value={tag}>{tag}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {selectedTag ? (
                            <>
                                <TrendChart data={trendData} toolType={selectedTool} />
                                <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl">
                                    <h4 className="text-blue-400 font-bold mb-2 text-sm flex items-center">
                                        <Info size={16} className="mr-2" />
                                        Análisis de Tendencia
                                    </h4>
                                    <p className="text-slate-300 text-sm">
                                        Se muestran <strong>{trendData.length}</strong> mediciones para el equipo <strong>{selectedTag}</strong>.
                                        {trendData.length < 3 && " Se recomiendan al menos 3 puntos para un análisis confiable."}
                                    </p>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-12 text-slate-500 border-2 border-dashed border-slate-800 rounded-xl">
                                <Search size={48} className="mx-auto mb-4 opacity-20" />
                                <p>Selecciona un Tag para ver su gráfica de tendencia.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default History;
