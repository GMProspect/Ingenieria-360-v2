import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Database, Zap, Activity, Gauge, RefreshCw, History as HistoryIcon, LogOut, X, MessageSquare, Wrench, Thermometer } from 'lucide-react';
import { useAuth } from '../contexts/Auth';

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();
    const { signOut, user } = useAuth();
    const ADMIN_EMAIL = 'gustavomatheus2812@gmail.com';

    const links = [
        { path: '/', name: 'Inicio', icon: Home },
        { path: '/transmitter', name: 'Transmisor 4-20mA', icon: Gauge },
        { path: '/temperature-sensors', name: 'Sensores de Temp.', icon: Thermometer },
        { path: '/inventory', name: 'Inventario', icon: Database },
        { path: '/ohms-law', name: 'Ley de Ohm', icon: Zap },
        { path: '/megohmetro', name: 'Megóhmetro', icon: Activity },
        { path: '/vibration', name: 'Sondas de Vibración', icon: Activity },
        { path: '/wrench-converter', name: 'Medidas Llaves', icon: Wrench },
        { path: '/converter', name: 'Conversor Universal', icon: RefreshCw },
        { path: '/history', name: 'Historial', icon: HistoryIcon },
    ];

    if (user?.email === ADMIN_EMAIL) {
        links.push({ path: '/feedback', name: 'Feedback', icon: MessageSquare });
    }

    return (
        <>
            {/* Backdrop for mobile/when open */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Container */}
            <div className={`fixed top-0 left-0 h-full w-72 bg-slate-900/95 backdrop-blur-xl border-r border-cyan-500/30 text-white flex flex-col p-4 z-50 shadow-[0_0_50px_rgba(34,211,238,0.1)] transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>

                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-cyan-500 rounded-xl shadow-[0_0_15px_#22d3ee] flex items-center justify-center">
                            <span className="font-bold text-slate-900 text-lg">360</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent leading-none">
                                Ingeniería
                            </h1>
                            <span className="text-xs text-slate-400 font-medium tracking-wider">SUITE v2.0</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = location.pathname === link.path;
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={onClose} // Close on navigation
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.15)]'
                                    : 'hover:bg-white/5 hover:text-cyan-300 hover:translate-x-1'
                                    }`}
                            >
                                <Icon size={20} className={isActive ? 'drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]' : ''} />
                                <span className="font-medium">{link.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Actions */}
                <div className="mt-auto pt-6 border-t border-white/10 space-y-4">
                    <button
                        onClick={signOut}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all duration-300 group border border-transparent hover:border-red-500/30"
                    >
                        <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Cerrar Sesión</span>
                    </button>

                    <div className="text-xs text-slate-600 text-center font-mono">
                        Build 2024.11.28
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
