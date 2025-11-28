import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/Auth';

const FeedbackForm = () => {
    const { user } = useAuth();
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null); // 'success', 'error', null

    useEffect(() => {
        if (user?.email) {
            setEmail(user.email);
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        setLoading(true);
        setStatus(null);

        try {
            const { error } = await supabase
                .from('feedback')
                .insert([{
                    message,
                    email: user?.email || email, // Prefer auth email
                    user_id: user?.id, // Optional: link to user ID if table supports it
                    created_at: new Date()
                }]);

            if (error) throw error;

            setStatus('success');
            setMessage('');
            if (!user) setEmail(''); // Only clear email if not logged in
        } catch (error) {
            console.error('Error sending feedback:', error);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-slate-900/50 p-8 rounded-2xl border border-white/5 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white mb-2">Buzón de Sugerencias</h2>
            <p className="text-slate-400 mb-6">Ayúdanos a mejorar Ingeniería 360. Tus comentarios son valiosos.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
                {!user && (
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Tu Email (Opcional)</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                            placeholder="ingeniero@ejemplo.com"
                        />
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Mensaje</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        rows={4}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                        placeholder="¿Qué te gustaría ver en la próxima versión?"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-lg transition-all shadow-lg shadow-cyan-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Enviando...' : (
                        <>
                            <Send size={18} />
                            Enviar Feedback
                        </>
                    )}
                </button>

                {status === 'success' && (
                    <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-sm text-center">
                        ¡Gracias! Tu mensaje ha sido recibido.
                    </div>
                )}

                {status === 'error' && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm text-center">
                        Hubo un error al enviar el mensaje. Inténtalo de nuevo.
                    </div>
                )}
            </form>
        </div>
    );
};

export default FeedbackForm;
