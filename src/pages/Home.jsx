import React from 'react';
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
    Calculator,
    Box
} from 'lucide-react';
import CategoryCard from '../components/CategoryCard';
import { useTranslation } from 'react-i18next';

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
            description: 'Torques, medidas de llaves y mantenimiento de equipos rotativos.',
            icon: Wrench,
            color: 'orange',
            links: [
                { to: '/wrench-converter', label: 'Conversor de Llaves (Wrench)', isNew: true },
                // Future: Turbine Inventory, Torque Calculator
            ]
        },
        {
            title: 'Electricidad Industrial',
            description: 'Cálculos para motores, transformadores y distribución eléctrica.',
            icon: Zap,
            color: 'yellow',
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
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                    Ingeniería <span className="text-blue-600">360</span>
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                    La Super App para especialistas de campo. Instrumentación, Mecánica, Electricidad y Control en un solo lugar.
                </p>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                {categories.map((category, index) => (
                    <CategoryCard key={index} {...category} />
                ))}
            </div>

            {/* Footer Links */}
            <div className="border-t border-slate-200 pt-8 mt-12">
                <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
                    <a href="/privacy-policy" className="hover:text-blue-600 transition-colors">
                        Política de Privacidad
                    </a>
                    <span className="text-slate-300">•</span>
                    <a href="/terms-of-service" className="hover:text-blue-600 transition-colors">
                        Términos de Servicio
                    </a>
                    <span className="text-slate-300">•</span>
                    <span>v2.1.0 (Super App Beta)</span>
                </div>
            </div>
        </div>
    );
};

export default Home;
