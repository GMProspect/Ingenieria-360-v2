```javascript
import React, { useState, useEffect } from 'react';
import { History as HistoryIcon, Trash2, Search, Info, LineChart, Edit2, X, Save } from 'lucide-react';
import TrendChart from '../components/TrendChart';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/Auth';
import BackButton from '../components/BackButton';
import { useSearchParams } from 'react-router-dom';

const History = () => {
    const { user } = useAuth();
    const [searchParams] = useSearchParams();

    // Initial state from URL params or defaults
    const initialTool = searchParams.get('tool') || 'Megóhmetro';
    const initialTag = searchParams.get('tag') || '';
    const initialView = initialTag ? 'trend' : 'list';

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState(initialView); // 'list' or 'trend'
    const [selectedTag, setSelectedTag] = useState(initialTag);
    const [selectedTool, setSelectedTool] = useState(initialTool);
    const [timeRange, setTimeRange] = useState('all'); // 'all', 'year', '6months', 'month', 'week'
    const [searchTerm, setSearchTerm] = useState('');

    // Edit Modal State
    const [editingItem, setEditingItem] = useState(null);
    const [editLabel, setEditLabel] = useState('');
    const [editDescription, setEditDescription] = useState('');

    useEffect(() => {
        const fetchHistory = async () => {
            if (!user) return;
            try {
                const { data, error } = await supabase
                    .from('history')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setHistory(data || []);
            } catch (error) {
                console.error('Error fetching history:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [user]);

    const handleDelete = async (id) => {
        if (!confirm('¿Estás seguro de eliminar este registro?')) return;
        try {
            const { error } = await supabase
                .from('history')
                .delete()
                .eq('id', id);
            if (error) throw error;
            setHistory(history.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error deleting:', error);
            alert('Error al eliminar');
        }
    };

    const openEditModal = (item) => {
        setEditingItem(item);
        setEditLabel(item.label);
        setEditDescription(item.description || '');
    };

    const handleUpdate = async () => {
        if (!editingItem) return;
        try {
            const { error } = await supabase
                .from('history')
                .update({ label: editLabel, description: editDescription })
                .eq('id', editingItem.id);

            if (error) throw error;

            // Update local state
            setHistory(history.map(item => 
                item.id === editingItem.id 
                    ? { ...item, label: editLabel, description: editDescription }
                    : item
            ));
            setEditingItem(null);
        } catch (error) {
            console.error('Error updating:', error);
            alert('Error al actualizar');
        }
    };

    const handleViewTrend = (item) => {
        setSelectedTool(item.tool_name);
        setSelectedTag(item.label);
        setViewMode('trend');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Extract unique tags for dropdown
    const uniqueTags = [...new Set(history.map(item => item.label))].filter(Boolean).sort();
    const uniqueTools = [...new Set(history.map(item => item.tool_name))].filter(Boolean).sort();

    // Filter data for Trend View
    const trendData = history.filter(item => {
        // Basic filters
        if (item.tool_name !== selectedTool || item.label !== selectedTag) return false;

        // Time Range Filter
        if (timeRange === 'all') return true;

        const date = new Date(item.created_at);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (timeRange === 'year') return diffDays <= 365;
        if (timeRange === '6months') return diffDays <= 180;
        if (timeRange === 'month') return diffDays <= 30;
        if (timeRange === 'week') return diffDays <= 7;

        return true;
    }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Keep newest first for table, chart reverses it

    // Filter for List View
    const filteredHistory = history.filter(item => {
        const searchLower = searchTerm.toLowerCase();
        return (
            item.label?.toLowerCase().includes(searchLower) ||
            item.tool_name?.toLowerCase().includes(searchLower) ||
            item.description?.toLowerCase().includes(searchLower)
        );
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatData = (data) => {
        return Object.entries(data).map(([key, value]) => {
            if (key === 'result' || key === 'voltageRating') return null;
            return (
                <div key={key} className="text-xs">
                    <span className="text-slate-500 capitalize">{key}: </span>
                    <span className="text-slate-300 font-mono">{value}</span>
                </div>
            );
        });
    };

    return (
        <div className="max-w-6xl mx-auto p-6 relative">
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
                        className={`px - 4 py - 2 rounded - lg text - sm font - bold transition - all ${ viewMode === 'list' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300' } `}
                    >
                        Lista
                    </button>
                    <button
                        onClick={() => setViewMode('trend')}
                        className={`px - 4 py - 2 rounded - lg text - sm font - bold transition - all ${ viewMode === 'trend' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'text-slate-500 hover:text-slate-300' } `}
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
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleViewTrend(item)}
                                                            className="p-2 text-slate-500 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors active:scale-95"
                                                            title="Ver Tendencia"
                                                        >
                                                            <LineChart size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => openEditModal(item)}
                                                            className="p-2 text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors active:scale-95"
                                                            title="Editar Etiqueta"
                                                        >
                                                            <Edit2 size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(item.id)}
                                                            className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors active:scale-95"
                                                            title="Eliminar registro"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                            <div>
                                <label className="block text-slate-400 mb-2 text-sm font-medium">Rango de Tiempo</label>
                                <select
                                    value={timeRange}
                                    onChange={(e) => setTimeRange(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none"
                                >
                                    <option value="all">Todo el Historial</option>
                                    <option value="year">Último Año</option>
                                    <option value="6months">Últimos 6 Meses</option>
                                    <option value="month">Último Mes</option>
                                    <option value="week">Última Semana</option>
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

            {/* Edit Modal */}
            {editingItem && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in-up">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Edit2 size={20} className="text-cyan-400" />
                                Editar Registro
                            </h3>
                            <button onClick={() => setEditingItem(null)} className="text-slate-500 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Tag / Equipo</label>
                                <input
                                    type="text"
                                    value={editLabel}
                                    onChange={(e) => setEditLabel(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-cyan-500"
                                />
                                <p className="text-[10px] text-slate-500 mt-1">
                                    * Corregir el Tag agrupará este registro correctamente en las tendencias.
                                </p>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Descripción</label>
                                <textarea
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-cyan-500 h-24 resize-none"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={() => setEditingItem(null)}
                                className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleUpdate}
                                className="flex-1 py-3 rounded-xl bg-cyan-600 text-white font-bold hover:bg-cyan-500 transition-colors flex items-center justify-center gap-2"
                            >
                                <Save size={18} />
                                Guardar Cambios
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default History;
```
