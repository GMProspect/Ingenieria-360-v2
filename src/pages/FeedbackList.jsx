import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { Mail, Calendar, Trash2, MessageSquare, CheckCircle, Circle } from 'lucide-react';

const FeedbackList = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFeedback = async () => {
        try {
            const { data, error } = await supabase
                .from('feedback')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setFeedbacks(data);
        } catch (error) {
            console.error('Error fetching feedback:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este mensaje?')) return;

        try {
            const { error } = await supabase
                .from('feedback')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setFeedbacks(feedbacks.filter(f => f.id !== id));
        } catch (error) {
            console.error('Error deleting feedback:', error);
        }
    };

    const toggleRead = async (id, currentStatus) => {
        try {
            const { error } = await supabase
                .from('feedback')
                .update({ read: !currentStatus })
                .eq('id', id);

            if (error) throw error;

            setFeedbacks(feedbacks.map(f =>
                f.id === id ? { ...f, read: !currentStatus } : f
            ));
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    useEffect(() => {
        fetchFeedback();
    }, []);

    if (loading) {
        return <div className="text-center text-slate-400 mt-20">Cargando mensajes...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto animate-fade-in-up">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-cyan-500/20 rounded-xl">
                    <MessageSquare size={32} className="text-cyan-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white">Buzón de Mensajes</h1>
                    <p className="text-slate-400">Feedback recibido de los usuarios</p>
                </div>
            </div>

            {feedbacks.length === 0 ? (
                <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-white/5">
                    <p className="text-slate-500 text-lg">No hay mensajes todavía.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {feedbacks.map((item) => (
                        <div
                            key={item.id}
                            className={`bg-slate-900/80 border rounded-xl p-6 transition-all group relative ${item.read
                                    ? 'border-white/5 opacity-60 hover:opacity-100'
                                    : 'border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.05)]'
                                }`}
                        >

                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2 text-cyan-400 text-sm font-medium">
                                    <Mail size={16} />
                                    <span>{item.email || 'Anónimo'}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => toggleRead(item.id, item.read)}
                                        className={`p-1 transition-colors ${item.read ? 'text-slate-600 hover:text-cyan-400' : 'text-cyan-400 hover:text-cyan-300'}`}
                                        title={item.read ? "Marcar como no leído" : "Marcar como leído"}
                                    >
                                        {item.read ? <Circle size={18} /> : <CheckCircle size={18} />}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="text-slate-600 hover:text-red-400 transition-colors p-1"
                                        title="Eliminar mensaje"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <p className="text-slate-300 mb-6 whitespace-pre-wrap text-sm leading-relaxed">
                                "{item.message}"
                            </p>

                            <div className="flex items-center gap-2 text-xs text-slate-500 pt-4 border-t border-white/5">
                                <Calendar size={14} />
                                <span>{new Date(item.created_at).toLocaleString()}</span>
                                {item.read && <span className="ml-auto text-slate-600 italic">Leído</span>}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FeedbackList;
