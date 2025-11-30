import React, { useEffect, useState } from 'react';
import { Clock, ArrowUpRight, LineChart, Loader2 } from 'lucide-react';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/Auth';
import { Link } from 'react-router-dom';

const RecentHistory = ({ toolName, onLoadData, refreshTrigger }) => {
    const { user } = useAuth();
    const [recentItems, setRecentItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecent = async () => {
            if (!user) return;
            try {
                const { data, error } = await supabase
                    .from('history')
                    .select('*')
                    .eq('user_id', user.id)
                    .eq('tool_name', toolName)
                    .order('created_at', { ascending: false })
                    .limit(3);

                if (error) throw error;
                setRecentItems(data || []);
            } catch (error) {
                console.error('Error fetching recent history:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecent();
    }, [user, toolName, refreshTrigger]);

    if (loading) return (
        <div className="flex justify-center p-4">
            <Loader2 className="animate-spin text-slate-500" size={20} />
        </div>
    );

    if (recentItems.length === 0) return null;

    return (
        <div className="mt-8 pt-6 border-t border-slate-800 animate-fade-in">
            <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                <Clock size={14} />
                Cálculos Recientes
            </h4>
            <div className="grid grid-cols-1 gap-3">
                {recentItems.map((item) => (
                    <div
                        key={item.id}
                        className="bg-slate-900/50 border border-slate-800 rounded-xl p-3 flex items-center justify-between group hover:border-slate-700 transition-all"
                    >
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-purple-400 font-bold text-sm truncate">
                                    {item.label}
                                </span>
                                <span className="text-slate-600 text-xs">
                                    • {new Date(item.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="text-slate-400 text-xs truncate">
                                {item.description || 'Sin descripción'}
                            </div>
                        </div>

                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link
                                to={`/history?tool=${encodeURIComponent(toolName)}&tag=${encodeURIComponent(item.label)}`}
                                className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:bg-purple-500/10 hover:text-purple-400 transition-all"
                                title="Ver Tendencia"
                            >
                                <LineChart size={16} />
                            </Link>
                            <button
                                onClick={() => onLoadData(item)}
                                className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:bg-cyan-500/10 hover:text-cyan-400 transition-all"
                                title="Cargar datos"
                            >
                                <ArrowUpRight size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentHistory;
