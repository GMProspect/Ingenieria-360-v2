import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    Activity,
    Wrench,
    Zap,
    Cpu,
    ClipboardList,
    Thermometer,
    Gauge,
    RefreshCw,
    Database,
    History
} from 'lucide-react';
import HomeCraneIcon from '../components/HomeCraneIcon';
import FeedbackForm from '../components/FeedbackForm';

const Home = () => {
    const { t } = useTranslation();

    // Scroll to top on mount
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const categories = [
        {
            title: 'Instrumentación y Control',
            description: 'Sensores, Transmisores, PLC, Lógica y Troubleshooting.',
            icon: Activity,
            color: 'blue',
            links: [
                { to: '/transmitter', label: 'Transmisor 4-20mA', icon: Gauge, color: 'text-purple-400' },
                { to: '/temperature-sensors', label: 'Sensores de Temperatura', icon: Thermometer, color: 'text-red-400' },
                { to: '/vibration', label: 'Vibración (API 670)', icon: Activity, color: 'text-cyan-400' },
                { to: '/wrench-converter', label: 'Conversor de Llaves', icon: Wrench, color: 'text-orange-400', isNew: true }
            ]
        },
        {
            title: 'Mecánica y Rotativos',
            description: 'Torques, alineación y mantenimiento de equipos rotativos (> 1").',
            icon: Wrench,
            color: 'orange',
            links: [
                { to: '/torque', label: 'Calculadora de Torque', icon: Wrench, color: 'text-orange-400', isNew: true },
                { to: '/inventory', label: 'Inventario de Taller', icon: Database, color: 'text-blue-400' }
            ]
        },
        {
            title: 'Electricidad Industrial',
            description: 'Cálculos para motores, transformadores y distribución eléctrica.',
            icon: Zap,
            color: 'yellow',
            links: [
                { to: '/ohms-law', label: 'Ley de Ohm / Potencia', icon: Zap, color: 'text-yellow-400' },
                { to: '/megohmetro', label: 'Megóhmetro (Aislamiento)', icon: Activity, color: 'text-purple-400', isNew: true },
            ]
        },
        {
            title: 'Generación de Energía',
            description: 'Sistemas de Excitación, PSS, Estabilidad y Ciclos Termodinámicos.',
            icon: Cpu,
            color: 'purple',
            links: [
                { to: '#', label: 'Próximamente: Modelos PSS', icon: Cpu, color: 'text-slate-500' },
                { to: '#', label: 'Próximamente: Curvas de Saturación', icon: Activity, color: 'text-slate-500' }
            ]
        },
        {
            title: 'Gestión y Operaciones',
            description: 'Rondas de operación, inventario, historial y reportes.',
            icon: ClipboardList,
            color: 'gray',
            links: [
                { to: '/history', label: 'Historial de Cálculos', icon: History, color: 'text-slate-400' },
                { to: '/converter', label: 'Conversor de Unidades', icon: RefreshCw, color: 'text-green-400' }
            ]
        }
    ];

    const getGlowStyles = (color) => {
        const styles = {
            blue: 'border-blue-500/30 hover:border-blue-400/60 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]',
            orange: 'border-orange-500/30 hover:border-orange-400/60 hover:shadow-[0_0_20px_rgba(249,115,22,0.2)]',
            yellow: 'border-yellow-500/30 hover:border-yellow-400/60 hover:shadow-[0_0_20px_rgba(234,179,8,0.2)]',
            purple: 'border-purple-500/30 hover:border-purple-400/60 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]',
            gray: 'border-slate-500/30 hover:border-slate-400/60 hover:shadow-[0_0_20px_rgba(148,163,184,0.2)]',
        };
        return styles[color] || styles.gray;
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header Section */}
            <div className="text-center mb-16 animate-fade-in-down">
                <div className="flex justify-center mb-6">
                    <HomeCraneIcon size={120} className="drop-shadow-[0_0_25px_rgba(234,179,8,0.4)]" />
                </div>
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4 tracking-tight">
                    Ingeniería 360
                </h1>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light tracking-wide">
                    La Super App para especialistas de campo. Instrumentación, Mecánica, Electricidad y Control.
                </p>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {categories.map((category, index) => (
                    <div
                        key={index}
                        className={`bg-slate-900/40 backdrop-blur-sm rounded-2xl transition-all duration-300 p-6 border flex flex-col group hover:-translate-y-1 ${getGlowStyles(category.color)}`}
                    >
                        <div className="flex items-center mb-4">
                            <div
                                className={`p-3 rounded-xl bg-${category.color}-500/10 text-${category.color}-400 mr-4 ring-1 ring-${category.color}-500/20 group-hover:bg-${category.color}-500/20 transition-colors`}
                            >
                                <category.icon size={28} strokeWidth={1.5} />
                            </div>
                            <h2 className="text-2xl font-bold text-white tracking-tight">
                                {category.title}
                            </h2>
                        </div>
                        <p className="text-slate-400 mb-6 flex-grow leading-relaxed font-light">
                            {category.description}
                        </p>
                        <div className="space-y-3 border-t border-white/5 pt-4">
                            {category.links.map((link, linkIndex) => {
                                const LinkIcon = link.icon;
                                return (
                                    <Link
                                        key={linkIndex}
                                        to={link.to}
                                        className="flex items-center text-slate-300 hover:bg-white/5 rounded-lg p-2 -mx-2 transition-all group/link"
                                    >
                                        <div className={`mr-3 ${link.color || 'text-slate-400'} transition-colors`}>
                                            <LinkIcon size={18} />
                                        </div>
                                        <span className="font-medium text-sm group-hover/link:text-white transition-colors">
                                            {link.label}
                                        </span>
                                        {link.isNew && (
                                            <span className="ml-auto px-2 py-0.5 bg-cyan-500/10 text-cyan-400 text-[10px] font-bold uppercase tracking-wider rounded-full border border-cyan-500/20 shadow-[0_0_10px_rgba(34,211,238,0.2)]">
                                                Nuevo
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Feedback Section */}
            <div className="bg-slate-900/40 rounded-2xl p-8 text-center shadow-lg border border-white/5 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 pointer-events-none" />
                <h2 className="text-3xl font-bold text-white mb-4 relative z-10">
                    ¿Qué herramienta te falta en campo? 👷‍♂️
                </h2>
                <p className="text-slate-400 mb-8 max-w-2xl mx-auto relative z-10">
                    Ayúdanos a mejorar. ¿Necesitas tablas de cables para termopares? ¿Cálculos de luminarias? ¿Separar señales analógicas/digitales? Cuéntanos qué necesitas en tu día a día y lo agregaremos.
                </p>
                <div className="relative z-10">
                    <FeedbackForm />
                </div>
            </div>

            {/* Footer */}
            <div className="mt-16 text-center text-slate-600 text-sm font-mono">
                <p className="mb-2">
                    Hecho con ❤️ por
                    <a
                        href="#"
                        className="text-cyan-600 hover:text-cyan-400 transition-colors ml-1"
                    >
                        Gustavo Matheus
                    </a>
                </p>
                <div className="flex justify-center items-center space-x-4">
                    <Link to="/privacy-policy" className="hover:text-cyan-400 transition-colors">
                        Política de Privacidad
                    </Link>
                    <span className="text-slate-700">•</span>
                    <Link to="/terms-of-service" className="hover:text-cyan-400 transition-colors">
                        Términos de Servicio
                    </Link>
                    <span className="text-slate-700">•</span>
                    <span>v2.1.0 (Super App Beta)</span>
                </div>
            </div>
        </div>
    );
};

export default Home;
