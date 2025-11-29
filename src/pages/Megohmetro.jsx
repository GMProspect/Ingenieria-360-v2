import React, { useState } from 'react';
import { Activity, AlertTriangle, CheckCircle, Info, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import BackButton from '../components/BackButton';
import ToolHeader from '../components/ToolHeader';
import SaveCalculationSection from '../components/SaveCalculationSection';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/Auth';
import useLocalStorage from '../hooks/useLocalStorage';
import AdBanner from '../components/AdBanner';

const Megohmetro = () => {
    const { t } = useTranslation();
    const { user } = useAuth();

    // State
    const [resistance, setResistance] = useLocalStorage('megger_resistance', '', user?.id);
    const [unit, setUnit] = useLocalStorage('megger_unit', 'MΩ', user?.id);
    const [voltageRating, setVoltageRating] = useLocalStorage('megger_voltage_rating', 'low', user?.id); // 'low' (<1kV), 'high' (>1kV)

    const [label, setLabel] = useState('');
    const [description, setDescription] = useState('');
    const [saving, setSaving] = useState(false);

    // Scroll to top
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Evaluation Logic (IEEE 43-2013)
    const evaluateInsulation = (res, unit, rating) => {
        if (!res) return null;
        let r = parseFloat(res);
    }
};

const result = evaluateInsulation(resistance, unit, voltageRating);

const handleSave = async () => {
    if (!label.trim()) {
        alert('Por favor ingresa una etiqueta.');
        return;
    }
    if (!user) {
        alert('Debes iniciar sesión para guardar.');
        return;
    }
    setSaving(true);
    try {
        const { error } = await supabase.from('history').insert([{
            tool_name: 'Megóhmetro',
            label: label,
            description: description,
            user_id: user.id,
            data: {
                resistance,
                unit,
                voltageRating,
                result: result?.status
            }
        }]);
        if (error) throw error;
        alert('Evaluación guardada correctamente.');
        setLabel('');
        setDescription('');
    } catch (error) {
        console.error('Error saving:', error);
        alert('Error al guardar.');
    } finally {
        setSaving(false);
    }
};

const clearAll = () => {
    setResistance('');
    setLabel('');
    setDescription('');
};

// Motor Visual Component
const MotorVisual = ({ status }) => {
    const glowColor = status === 'danger' ? '#ef4444' :
        status === 'warning' ? '#eab308' :
            status === 'success' ? '#22c55e' : '#64748b';

    const shadowIntensity = status ? '0 0 30px' : '0 0 10px';

    return (
        <div className="relative w-48 h-48 mx-auto my-6 flex items-center justify-center">
            {/* Stator Housing */}
            <div
                className="absolute inset-0 rounded-full border-4 border-slate-700 bg-slate-900/80 backdrop-blur-md transition-all duration-500"
                style={{ borderColor: glowColor, boxShadow: `${shadowIntensity} ${glowColor}40` }}
            ></div>

            {/* Windings (Coils) */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                <div
                    key={i}
                    className="absolute w-8 h-12 rounded-full border-2 bg-slate-800/50 transition-all duration-500"
                    style={{
                        transform: `rotate(${deg}deg) translateY(-65px)`,
                        borderColor: glowColor,
                        boxShadow: status ? `inset 0 0 10px ${glowColor}40` : 'none'
                    }}
                ></div>
            ))}

            {/* Rotor */}
            <div className="absolute w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center shadow-inner">
                <div className="w-4 h-4 rounded-full bg-slate-500"></div>
            </div>

            {/* Status Icon Overlay */}
            <div className="absolute -bottom-2 -right-2 bg-slate-900 rounded-full p-2 border border-slate-700 shadow-xl">
                {status === 'danger' && <AlertTriangle className="text-red-500 animate-pulse" size={24} />}
                {status === 'warning' && <AlertTriangle className="text-yellow-500" size={24} />}
                {status === 'success' && <CheckCircle className="text-green-500" size={24} />}
                {!status && <Activity className="text-slate-500" size={24} />}
            </div>
        </div>
    );
};

return (
    <div className="max-w-4xl mx-auto p-6">
        <BackButton />

        <ToolHeader
            title="Megóhmetro"
            subtitle="Evaluación de Aislamiento (IEEE 43)"
            icon={Activity}
            iconColorClass="text-purple-400"
            iconBgClass="bg-purple-500/20"
            onReset={clearAll}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 items-stretch">

            {/* Visual Section - CENTERED/LEFT */}
            <div className="flex flex-col items-center p-6 bg-slate-900/30 rounded-2xl border border-white/5 relative overflow-hidden transition-all duration-500">
                <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-4">Estado del Bobinado</h3>
                <MotorVisual status={result?.status} />

                {result ? (
                    <div className="mt-4 text-center animate-fade-in-up w-full bg-slate-950/50 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
                        <h4 className={`text-xl font-bold ${result.color} mb-2 flex items-center justify-center gap-2`}>
                            {result.status === 'danger' && <AlertTriangle size={20} />}
                            {result.status === 'warning' && <AlertTriangle size={20} />}
                            {result.status === 'success' && <CheckCircle size={20} />}
                            {result.title}
                        </h4>
                        <p className="text-white text-sm mb-3 leading-relaxed">
                            {result.message}
                        </p>
                        <div className="bg-black/40 rounded-lg p-3 border border-white/10 text-left">
                            <p className="text-slate-300 text-xs">
                                <strong className="block mb-1 text-slate-500 uppercase text-[10px] tracking-wider">Recomendación:</strong>
                                {result.action}
                            </p>
                        </div>
                    </div>
                ) : (
                    <p className="text-slate-500 text-xs text-center max-w-xs mt-4">
                        Representación visual del estator. El color indica la integridad del aislamiento según IEEE 43.
                    </p>
                )}
            </div>

            {/* Input Section - RIGHT */}
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 backdrop-blur-sm shadow-xl h-full flex flex-col justify-center">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <Zap className="mr-2 text-yellow-400" size={20} />
                    Datos de Medición
                </h3>

                <div className="space-y-6">
                    <div>
                        <label className="block text-slate-400 mb-2 text-sm font-medium">
                            Resistencia Medida (1 min)
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={resistance}
                                onChange={(e) => setResistance(e.target.value)}
                                placeholder="0.0"
                                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                            />
                            <select
                                value={unit}
                                onChange={(e) => setUnit(e.target.value)}
                                className="w-24 bg-slate-950 border border-slate-700 rounded-xl px-2 py-3 text-white text-lg font-bold focus:outline-none focus:border-purple-500 transition-all text-center cursor-pointer"
                            >
                                <option value="MΩ">MΩ</option>
                                <option value="GΩ">GΩ</option>
                                <option value="kΩ">kΩ</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-slate-400 mb-2 text-sm font-medium">
                            Voltaje Nominal del Motor
                        </label>
                        <div className="grid grid-cols-3 gap-2 mb-2">
                            {['110', '220', '480'].map((v) => (
                                <button
                                    key={v}
                                    onClick={() => setVoltageRating(v)}
                                    className={`p-2 rounded-xl border transition-all text-sm font-bold ${voltageRating === v
                                        ? 'bg-purple-500/20 border-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                                        : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-600'
                                        }`}
                                >
                                    {v} V
                                </button>
                            ))}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => setVoltageRating('mv')}
                                className={`p-2 rounded-xl border transition-all text-sm font-bold ${voltageRating === 'mv'
                                    ? 'bg-purple-500/20 border-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                                    : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-600'
                                    }`}
                            >
                                Media (2.3-4.16 kV)
                            </button>
                            <button
                                onClick={() => setVoltageRating('hv')}
                                className={`p-2 rounded-xl border transition-all text-sm font-bold ${voltageRating === 'hv'
                                    ? 'bg-purple-500/20 border-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                                    : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-600'
                                    }`}
                            >
                                Alta ({'>'} 4.16 kV)
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Safety Tips */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-2xl p-6 mb-8">
            <h4 className="text-blue-400 font-bold mb-4 flex items-center">
                <Info className="mr-2" size={20} />
                Tips de Seguridad y Mantenimiento
            </h4>
            <ul className="space-y-3 text-slate-300 text-sm">
                <li className="flex items-start">
                    <span className="mr-2 text-blue-500">•</span>
                    <span>
                        <strong>Humedad:</strong> Si el motor está fuera de servicio, usa siempre los
                        <span className="text-white font-medium"> calefactores (space heaters)</span> para evitar que el bobinado absorba humedad.
                    </span>
                </li>
                <li className="flex items-start">
                    <span className="mr-2 text-blue-500">•</span>
                    <span>
                        <strong>Temperatura:</strong> La resistencia de aislamiento disminuye a la mitad por cada
                        <span className="text-white font-medium"> 10°C de aumento</span> en la temperatura. Mide siempre a la misma temperatura para comparar.
                    </span>
                </li>
                <li className="flex items-start">
                    <span className="mr-2 text-blue-500">•</span>
                    <span>
                        <strong>Descarga:</strong> Al terminar la prueba, conecta el bobinado a tierra para descargar la energía almacenada.
                    </span>
                </li>
            </ul>
        </div>

        <SaveCalculationSection
            label={label}
            setLabel={setLabel}
            description={description}
            setDescription={setDescription}
            onSave={handleSave}
            onClear={clearAll}
            saving={saving}
        />

        <AdBanner dataAdSlot="9876543210" />
    </div>
);
};

export default Megohmetro;
