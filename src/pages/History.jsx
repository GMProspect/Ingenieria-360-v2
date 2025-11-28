import React, { useState, useEffect } from 'react';
import { History as HistoryIcon, Trash2, Search } from 'lucide-react';
import { supabase } from '../supabase';
import BackButton from '../components/BackButton';

const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('history')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setHistory(data || []);
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este registro?')) return;
        try {
            const { error } = await supabase
                .from('history')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setHistory(history.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('Error al eliminar.');
        }
    };

    const filteredHistory = history.filter(item =>
        item.label?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tool_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('es-ES', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const formatData = (data) => {
        return Object.entries(data).map(([key, value]) => (
            <div key={key} className="text-xs text-slate-400">
                <span className="font-bold text-cyan-500">{key}:</span> {value}
            </div>
        ));
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
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
            </div>

            <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 backdrop-blur-sm shadow-xl">

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
                                    <th className="p-4 font-medium">Etiqueta / Descripción</th>
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
            </div>
        </div>
    );
};

export default History;
