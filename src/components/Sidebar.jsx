import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Database, Zap, Activity, Gauge, RefreshCw, MessageSquare, History as HistoryIcon } from 'lucide-react';

const Sidebar = () => {
    const location = useLocation();

    const links = [
        { path: '/', name: 'Inicio', icon: Home },
        { path: '/transmitter', name: 'Transmisor 4-20mA', icon: Gauge },
        { path: '/inventory', name: 'Inventario', icon: Database },
        { path: '/ohms-law', name: 'Ley de Ohm', icon: Zap },
        { path: '/vibration', name: 'Sonda Vibración', icon: Activity },
        { path: '/converter', name: 'Conversor Universal', icon: RefreshCw },
        { path: '/history', name: 'Historial', icon: HistoryIcon },
    ];

    return (
        <div className="h-screen w-64 bg-slate-900/90 backdrop-blur-md border-r border-cyan-500/30 text-white flex flex-col p-4 fixed left-0 top-0 z-10 shadow-[0_0_15px_rgba(34,211,238,0.1)]">
            <div className="mb-8 flex items-center gap-2">
                <div className="w-8 h-8 bg-cyan-500 rounded-lg shadow-[0_0_10px_#22d3ee] flex items-center justify-center">
                    <span className="font-bold text-slate-900">360</span>
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                    Ingeniería 360
                </h1>
            </div>

            <nav className="flex-1 space-y-2">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.path;
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                                : 'hover:bg-white/5 hover:text-cyan-300 hover:translate-x-1'
                                }`}
                        >
                            <Icon size={20} className={isActive ? 'drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]' : ''} />
                            <span className="font-medium">{link.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto pt-6 border-t border-white/10">
                <div className="text-xs text-slate-500 text-center">
                    v2.0.0
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
