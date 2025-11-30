import React, { useState, useEffect } from 'react';
import { Clock, ArrowUpRight, ChevronRight, Activity } from 'lucide-react';
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
            } catch (err) {
                console.error('Error fetching recent history:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchRecent();
    }, [user, toolName, refreshTrigger]);

    if (loading) return <div className="animate-pulse h-24 bg-slate-900/50 rounded-xl mt-8"></div>;
    if (recentItems.length === 0) return null;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es-ES', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    return (
        <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                    <Clock size={16} />
                    Recientes
                </h3>
                <Link
                    to={`/history?tool=${encodeURIComponent(toolName)}`}
                    className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                >
                    Ver todo
                    <ChevronRight size={14} />
                </Link>
            </div>

            <div className="grid gap-3">
                {recentItems.map((item) => (
                    <div
                        key={item.id}
                        className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex items-center justify-between hover:border-slate-700 transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-2 h-2 rounded-full ${item.data.result === 'danger' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' :
                                    item.data.result === 'warning' ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]' :
                                        'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]'
                                }`}></div>

                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-white text-sm">{item.label}</span>
                                    <span className="text-xs text-slate-500">{formatDate(item.created_at)}</span>
                                </div>
                                <div className="text-xs text-slate-400 mt-0.5 flex gap-2">
                                    {item.data.resistance && <span>R: {item.data.resistance} {item.data.unit}</span>}
                                    {item.data.voltageRating && <span>V: {item.data.voltageRating}</span>}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => onLoadData(item)}
                            className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:bg-cyan-500/10 hover:text-cyan-400 transition-all opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0"
                            title="Cargar datos"
                        >
                            <ArrowUpRight size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentHistory;
