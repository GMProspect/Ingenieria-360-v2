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
            {/* Feedback Section */ }
        < div className = "bg-slate-900/40 rounded-2xl p-8 text-center shadow-lg border border-white/5 backdrop-blur-sm relative overflow-hidden" >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 pointer-events-none" />
                <h2 className="text-3xl font-bold text-white mb-4 relative z-10">
                    ¿Tienes una idea o necesitas una herramienta? 💡
                </h2>
                <p className="text-slate-400 mb-8 max-w-2xl mx-auto relative z-10">
                    Estamos construyendo la Super App para ti. Cuéntanos qué te gustaría ver.
                </p>
                <div className="relative z-10">
                    <FeedbackForm />
                </div>
            </div >

    {/* Footer */ }
    < div className = "mt-16 text-center text-slate-600 text-sm font-mono" >
                <p className="mb-2">
                    Hecho con ❤️ por
                    <a
                        href="https://www.linkedin.com/in/felipe-andres-ruiz-perez/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-600 hover:text-cyan-400 transition-colors ml-1"
                    >
                        Felipe Ruiz
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
                </div >
            </div >
        </div >
    );
};

export default Home;
