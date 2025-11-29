import React from 'react';
import { Link } from 'react-router-dom';
import { Database, Zap, Activity, Gauge, RefreshCw, Wrench } from 'lucide-react';
import HomeCraneIcon from '../components/HomeCraneIcon';
import FeedbackForm from '../components/FeedbackForm';

const Home = () => {
    const tools = [
        { path: '/inventory', name: 'Inventario', icon: Database, desc: 'Gestión de activos y especificaciones dinámicas.', color: 'text-blue-400', bg: 'bg-blue-500/10', hover: 'group-hover:text-blue-300', border: 'hover:border-blue-500/50', shadow: 'hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]' },
        { path: '/ohms-law', name: 'Ley de Ohm', icon: Zap, desc: 'Cálculo de V, I, R con interfaz triangular.', color: 'text-yellow-400', bg: 'bg-yellow-500/10', hover: 'group-hover:text-yellow-300', border: 'hover:border-yellow-500/50', shadow: 'hover:shadow-[0_0_30px_rgba(234,179,8,0.1)]' },
        { path: '/transmitter', name: 'Transmisor 4-20mA', icon: Gauge, desc: 'Conversión de señales de instrumentación.', color: 'text-purple-400', bg: 'bg-purple-500/10', hover: 'group-hover:text-purple-300', border: 'hover:border-purple-500/50', shadow: 'hover:shadow-[0_0_30px_rgba(168,85,247,0.1)]' },
        { path: '/vibration', name: 'Sondas de Vibración', icon: Activity, desc: 'API 670: Voltaje de GAP a Mils/Micras.', color: 'text-cyan-400', bg: 'bg-cyan-500/10', hover: 'group-hover:text-cyan-300', border: 'hover:border-cyan-500/50', shadow: 'hover:shadow-[0_0_30px_rgba(34,211,238,0.1)]' },
        { path: '/wrench-converter', name: 'Medidas de Llaves', icon: Wrench, desc: 'Tabla Maestra: Tuercas (M) vs Llaves (mm/pulg).', color: 'text-orange-400', bg: 'bg-orange-500/10', hover: 'group-hover:text-orange-300', border: 'hover:border-orange-500/50', shadow: 'hover:shadow-[0_0_30px_rgba(249,115,22,0.1)]' },
        { path: '/converter', name: 'Conversor Universal', icon: RefreshCw, desc: 'Presión, Temperatura, Longitud y Peso.', color: 'text-green-400', bg: 'bg-green-500/10', hover: 'group-hover:text-green-300', border: 'hover:border-green-500/50', shadow: 'hover:shadow-[0_0_30px_rgba(34,197,94,0.1)]' },
    ];

    return (
        <div className="flex flex-col min-h-[calc(100vh-100px)] items-center justify-center text-center">

            {/* Header Section */}
            <div className="mb-16 animate-fade-in-down">
                <div className="flex justify-center mb-6">
                    <HomeCraneIcon size={120} className="drop-shadow-[0_0_25px_rgba(234,179,8,0.4)]" />
                </div>
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4 tracking-tight">
                    Ingeniería 360
                </h1>
                <p className="text-xl text-slate-400 font-light tracking-wide">
                    Bienvenido a tu Entorno Técnico Inteligente
                </p>
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl w-full px-4 mb-20 animate-fade-in-up">
                {tools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                        <Link
                            key={tool.path}
                            to={tool.path}
                            className={`group bg-slate-900/40 border border-white/5 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 flex flex-col items-center ${tool.border} ${tool.shadow}`}
                        >
                            <div className={`p-4 rounded-xl mb-6 transition-colors ${tool.bg}`}>
                                <Icon size={40} className={`${tool.color} transition-colors`} />
                            </div>
                            <h3 className={`text-xl font-bold text-white mb-2 transition-colors ${tool.hover}`}>
                                {tool.name}
                            </h3>
                            <p className="text-sm text-slate-500 group-hover:text-slate-400 transition-colors">
                                {tool.desc}
                            </p>
                        </Link>
                    );
                })}
            </div>

            {/* Feedback Section */}
            <div className="w-full max-w-2xl px-4 mb-16 animate-fade-in-up delay-200">
                <FeedbackForm />
            </div>

            {/* Footer */}
            <footer className="mt-auto text-xs text-slate-600 font-mono space-y-2">
                <div className="flex justify-center gap-4 mb-2">
                    <Link to="/privacy-policy" className="hover:text-cyan-400 transition-colors">
                        Privacy Policy
                    </Link>
                    <span>•</span>
                    <Link to="/terms-of-service" className="hover:text-cyan-400 transition-colors">
                        Terms of Service
                    </Link>
                </div>
                <div>
                    Creado por <span className="text-cyan-600 font-bold">Gustavo Matheus</span> | Ingeniería 360 © 2025
                </div>
            </footer>

        </div>
    );
};

export default Home;
