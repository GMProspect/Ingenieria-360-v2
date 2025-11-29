import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    Activity,
    Wrench,
    Zap,
    Cpu,
    ClipboardList,
    Thermometer,
    Radio,
    Settings,
    BookOpen,
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
                { to: '/transmitter', label: 'Transmisor 4-20mA' },
                { to: '/temperature-sensors', label: 'Sensores de Temperatura (RTD/TC)' },
                { to: '/vibration', label: 'Vibración (API 670)' }
            ]
        },
        {
            title: 'Mecánica y Rotativos',
            description: 'Torques, alineación y mantenimiento de equipos rotativos (> 1").',
            icon: Wrench,
            color: 'orange',
            links: [
                // Future: Turbine Inventory, Torque Calculator
                { to: '/wrench-converter', label: 'Conversor de Llaves (Wrench)', isNew: true },
                { to: '#', label: 'Próximamente: Torques' },
                { to: '#', label: 'Próximamente: Inventario Turbinas' }
            ]
        },
        {
            title: 'Electricidad Industrial',
            description: 'Cálculos para motores, transformadores y distribución eléctrica.',
            icon: Zap,
            color: 'yellow',
            links: [
                { to: '/ohms-law', label: 'Ley de Ohm / Potencia' },
                // Future: Motor Star/Delta, Cable Sizing
            ]
        },
        {
            title: 'Generación de Energía',
            description: 'Sistemas de Excitación, PSS, Estabilidad y Ciclos Termodinámicos.',
            icon: Cpu,
            color: 'purple',
            links: [
                // Future: PSS Viewer, Saturation Curves
                { to: '#', label: 'Próximamente: Modelos PSS' },
                { to: '#', label: 'Próximamente: Curvas de Saturación' }
            ]
        },
        {
            title: 'Gestión y Operaciones',
            description: 'Rondas de operación, inventario, historial y reportes.',
            icon: ClipboardList,
            color: 'gray',
            links: [
                { to: '/inventory', label: 'Inventario de Equipos' },
                { to: '/history', label: 'Historial de Cálculos' },
                { to: '/converter', label: 'Conversor de Unidades' }
            ]
        }
    ];

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
                <p className="text-xl text-slate-600 max-w-2xl mx-auto font-light tracking-wide">
                    La Super App para especialistas de campo. Instrumentación, Mecánica, Electricidad y Control.
                </p>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {categories.map((category, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-slate-200 flex flex-col"
                    >
                        <div className="flex items-center mb-4">
                            <div
                                className={`p-3 rounded-full bg-${category.color}-100 text-${category.color}-600 mr-4`}
                            >
                                <category.icon size={24} strokeWidth={1.5} />
                            </div>
                            <h2 className="text-2xl font-semibold text-slate-800">
                                {category.title}
                            </h2>
                        </div>
                        <p className="text-slate-600 mb-6 flex-grow">
                            {category.description}
                        </p>
                        <div className="space-y-3">
                            {category.links.map((link, linkIndex) => (
                                <a
                                    key={linkIndex}
                                    href={link.to}
                                    className="flex items-center text-blue-600 hover:text-blue-800 transition-colors group"
                                >
                                    <span className="mr-2 text-blue-400 group-hover:text-blue-600 transition-colors">
                                        &rarr;
                                    </span>
                                    {link.label}
                                    {link.isNew && (
                                        <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                            Nuevo
                                        </span>
                                    )}
                                </a>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Feedback Section */}
            <div className="bg-blue-50 rounded-xl p-8 text-center shadow-inner border border-blue-200">
                <h2 className="text-3xl font-bold text-blue-800 mb-4">
                    ¿Tienes una idea o necesitas una herramienta?
                </h2>
                <p className="text-blue-700 mb-6 max-w-2xl mx-auto">
                    Estamos construyendo la Super App para ti. Cuéntanos qué te gustaría ver o qué problema te gustaría resolver.
                </p>
                <FeedbackForm />
            </div>

            {/* Footer */}
            <div className="mt-16 text-center text-slate-500 text-sm">
                <p className="mb-2">
                    Hecho con ❤️ por
                    <a
                        href="https://www.linkedin.com/in/felipe-andres-ruiz-perez/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 transition-colors ml-1"
                    >
                        Felipe Ruiz
                    </a>
                </p>
                <div className="flex justify-center items-center space-x-4">
                    <a href="/privacy-policy" className="hover:text-blue-600 transition-colors">
                        Política de Privacidad
                    </a>
                    <span className="text-slate-300">•</span>
                    <a href="/terms-of-service" className="hover:text-blue-600 transition-colors">
                        Términos de Servicio
                    </a>
                    <span className="text-slate-300">•</span>
                    <span>v2.1.0 (Super App Beta)</span>
                </div >
            </div >
        </div >
    );
};

export default Home;
