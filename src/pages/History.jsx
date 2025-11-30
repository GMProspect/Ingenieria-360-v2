import React, { useState, useEffect } from 'react';
import { History as HistoryIcon, Trash2, Search, Info, LineChart, Edit2, X, Save, ArrowLeft, FolderOpen, Calendar } from 'lucide-react';
import TrendChart from '../components/TrendChart';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/Auth';
import BackButton from '../components/BackButton';
import { useSearchParams } from 'react-router-dom';

const History = () => {
    const { user } = useAuth();
    const [searchParams] = useSearchParams();

    // Initial state
    const initialTool = searchParams.get('tool') || '';
    const initialTag = searchParams.get('tag') || '';

    // If tag is present in URL, start in details mode
    const [viewMode, setViewMode] = useState(initialTag ? 'details' : 'inventory');
    const [selectedTag, setSelectedTag] = useState(initialTag);
    const [selectedTool, setSelectedTool] = useState(initialTool);

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
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

    // --- Derived Data ---

    // 1. Unique Tools for Filter
    const uniqueTools = [...new Set(history.map(item => item.tool_name))].filter(Boolean).sort();

    // 2. Group by Object (Tag) for Inventory View
    const inventory = React.useMemo(() => {
        const groups = {};
        history.forEach(item => {
            // Filter by Tool if selected
            if (selectedTool && item.tool_name !== selectedTool) return;

            // Filter by Search Term
            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                if (!item.label?.toLowerCase().includes(term) &&
                    !item.description?.toLowerCase().includes(term)) {
                    return;
                }
            }

            if (!groups[item.label]) {
                groups[item.label] = {
                    label: item.label,
                    tool_name: item.tool_name,
                    count: 0,
                    lastDate: item.created_at,
                    lastResult: item.data?.result,
                    items: []
                };
            }
            groups[item.label].count++;
            groups[item.label].items.push(item);
        });
        return Object.values(groups).sort((a, b) => new Date(b.lastDate) - new Date(a.lastDate));
    }, [history, selectedTool, searchTerm]);

    // 3. Details Data (Specific Object)
    const objectDetails = React.useMemo(() => {
        if (!selectedTag) return [];
        return history.filter(item => item.label === selectedTag)
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }, [history, selectedTag]);


    // --- Actions ---

    const handleDeleteItem = async (id) => {
        if (!confirm('¿Eliminar este registro individual?')) return;
        try {
            const { error } = await supabase.from('history').delete().eq('id', id);
            if (error) throw error;
            setHistory(history.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error deleting:', error);
            alert('Error al eliminar');
        }
    };

    const handleDeleteObject = async () => {
        if (!confirm(`¿ATENCIÓN: Estás a punto de eliminar TODO el historial de "${selectedTag}"? Esta acción no se puede deshacer.`)) return;
        try {
            // Delete all items with this label
            const { error } = await supabase.from('history').delete().eq('label', selectedTag).eq('user_id', user.id);
            if (error) throw error;

            // Update local state
            setHistory(history.filter(item => item.label !== selectedTag));
            setViewMode('inventory');
            setSelectedTag('');
        } catch (error) {
            console.error('Error deleting object:', error);
            alert('Error al eliminar objeto');
        }
    };

    const handleUpdate = async () => {
        if (!editingItem) return;
        try {
            const { error } = await supabase
                .from('history')
                .update({ label: editLabel, description: editDescription })
                .eq('id', editingItem.id);

            if (error) throw error;

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

    const openEditModal = (item) => {
        setEditingItem(item);
        setEditLabel(item.label);
        setEditDescription(item.description || '');
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
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

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
                        <HistoryIcon size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Historial de Activos</h1>
                        <p className="text-slate-400">Gestión de equipos y mediciones</p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 backdrop-blur-sm shadow-xl min-h-[500px]">

                {/* --- INVENTORY VIEW --- */}
                {viewMode === 'inventory' && (
                    <div className="animate-fade-in">
                        {/* Filters */}
                        <div className="flex flex-col md:flex-row gap-4 mb-8">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                                <input
                                    type="text"
                                    placeholder="Buscar equipo..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white focus:border-purple-500 outline-none transition-colors"
                                />
                            </div>
                            <div className="w-full md:w-64">
                                <select
                                    value={selectedTool}
                                    onChange={(e) => setSelectedTool(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none"
                                >
                                    <option value="">Todas las Herramientas</option>
                                    {uniqueTools.map(tool => (
                                        <option key={tool} value={tool}>{tool}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {loading ? (
                            <div className="text-center py-12 text-slate-500">Cargando inventario...</div>
                        ) : inventory.length === 0 ? (
                            <div className="text-center py-12 text-slate-500 border-2 border-dashed border-slate-800 rounded-xl">
                                <FolderOpen size={48} className="mx-auto mb-4 opacity-20" />
                                <p>No se encontraron equipos registrados.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {inventory.map((obj) => (
                                    <div
                                        key={obj.label}
                                        onClick={() => {
                                            setSelectedTag(obj.label);
                                            setViewMode('details');
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        className="bg-slate-800/40 border border-slate-700 hover:border-purple-500/50 rounded-xl p-5 cursor-pointer transition-all hover:bg-slate-800 group"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors truncate pr-2">
                                                {obj.label}
                                            </h3>
                                            <span className="bg-slate-900 text-slate-400 text-xs px-2 py-1 rounded-lg border border-slate-700">
                                                {obj.count} reg.
                                            </span>
                                        </div>

                                        <div className="text-sm text-slate-400 mb-4 flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${obj.lastResult === 'danger' ? 'bg-red-500' :
                                                    obj.lastResult === 'warning' ? 'bg-yellow-500' :
                                                        obj.lastResult === 'success' ? 'bg-green-500' : 'bg-slate-500'
                                                }`} />
                                            Último: {new Date(obj.lastDate).toLocaleDateString()}
                                        </div>

                                        <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-700/50 pt-3">
                                            <span>{obj.tool_name}</span>
                                            <span className="flex items-center gap-1 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                Ver Detalles <ArrowLeft size={12} className="rotate-180" />
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* --- DETAILS VIEW --- */}
                {viewMode === 'details' && (
                    <div className="animate-fade-in">
                        <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-800">
                            <button
                                onClick={() => setViewMode('inventory')}
                                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                            >
                                <ArrowLeft size={20} />
                                <span className="font-bold">Volver al Inventario</span>
                            </button>

                            <button
                                onClick={handleDeleteObject}
                                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all border border-red-500/20"
                            >
                                <Trash2 size={18} />
                                Eliminar Objeto
                            </button>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-white mb-1">{selectedTag}</h2>
                            <p className="text-slate-400 text-sm flex items-center gap-2">
                                <Calendar size={14} />
                                Historial completo de mediciones
                            </p>
                        </div>

                        {/* Trend Chart */}
                        <div className="mb-8">
                            <TrendChart data={objectDetails} toolType={objectDetails[0]?.tool_name} />
                        </div>

                        {/* History List */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-slate-400 border-b border-slate-800">
                                        <th className="p-4 font-medium">Fecha</th>
                                        <th className="p-4 font-medium">Datos</th>
                                        <th className="p-4 font-medium text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {objectDetails.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-800/30 transition-colors group">
                                            <td className="p-4 text-slate-300 whitespace-nowrap text-sm">
                                                {formatDate(item.created_at)}
                                                {item.description && (
                                                    <div className="text-xs text-slate-500 mt-1 italic max-w-xs truncate">
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
                                                        onClick={() => openEditModal(item)}
                                                        className="p-2 text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
                                                        title="Editar Nota"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteItem(item.id)}
                                                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
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
