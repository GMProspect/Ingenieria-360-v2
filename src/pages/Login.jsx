import React, { useState } from 'react';
import { useAuth } from '../contexts/Auth';
import CraneIcon from '../components/CraneIcon';

const Login = () => {
    const { signInWithGoogle } = useAuth();
    const [error, setError] = useState(null);

    const handleGoogleLogin = async () => {
        try {
            const { error } = await signInWithGoogle();
            if (error) throw error;
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-slate-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-sm shadow-2xl text-center">

                <div className="mb-8">
                    <div className="flex justify-center mb-6">
                        <CraneIcon size={80} className="text-cyan-500 drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-3">
                        Ingeniería 360
                    </h1>
                    <p className="text-slate-400 text-lg">Tu Entorno Técnico Inteligente</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <p className="text-slate-300 mb-4">Inicia sesión para continuar</p>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full py-4 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-xl transition-all transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-3 text-lg"
                    >
                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Continuar con Google
                    </button>
                </div>

                <div className="mt-8 text-xs text-slate-500">
                    Al continuar, aceptas nuestros{' '}
                    <a href="/terms-of-service" className="text-cyan-500 hover:text-cyan-400 hover:underline transition-colors">
                        términos y condiciones
                    </a>
                    {' '}y{' '}
                    <a href="/privacy-policy" className="text-cyan-500 hover:text-cyan-400 hover:underline transition-colors">
                        política de privacidad
                    </a>.
                </div>
            </div>
        </div>
    );
};

export default Login;
