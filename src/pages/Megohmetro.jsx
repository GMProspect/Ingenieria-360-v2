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
    const [voltageRating, setVoltageRating] = useLocalStorage('megger_voltage_rating', 'low', user?.id); // 'low' (<1kV), 'high' (>1kV)

    const [label, setLabel] = useState('');
    const [description, setDescription] = useState('');
    const [saving, setSaving] = useState(false);

    // Scroll to top
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Evaluation Logic (IEEE 43-2013)
    const evaluateInsulation = (res, rating) => {
        if (!res) return null;
        const r = parseFloat(res);
        if (isNaN(r)) return null;

        if (r < 5) {
            return {
                status: 'danger',
                title: 'PELIGRO CRÍTICO',
                message: 'El aislamiento está severamente comprometido. NO ENERGIZAR.',
                action: 'El motor requiere limpieza profunda, secado en horno y re-evaluación. Riesgo inminente de falla a tierra.',
                color: 'text-red-500',
                bgColor: 'bg-red-500/10',
                borderColor: 'border-red-500/50'
            };
        } else if (r >= 5 && r < 100) {
            if (rating === 'low') {
                return {
                    status: 'warning',
                    title: 'PRECAUCIÓN (Baja Tensión)',
                    message: 'Valor aceptable para motores < 1kV, pero bajo para estándares modernos.',
                    action: 'Monitorear tendencia. Si el valor ha bajado drásticamente respecto al historial, programar mantenimiento.',
                    color: 'text-yellow-500',
                    bgColor: 'bg-yellow-500/10',
                    borderColor: 'border-yellow-500/50'
                };
            } else {
                return {
                    status: 'warning',
                    title: 'ALERTA (Alta Tensión)',
                    message: 'Valor bajo para motores > 1kV. Se recomienda > 100 MΩ.',
                    action: 'Investigar causas (humedad, suciedad). Se recomienda limpieza y secado.',
                    color: 'text-orange-500',
                    bgColor: 'bg-orange-500/10',
                    borderColor: 'border-orange-500/50'
                };
            }
        } else {
            return {
                status: 'success',
                title: 'AISLAMIENTO ÓPTIMO',
                message: 'El valor de resistencia es seguro para la operación.',
                action: 'El motor está en buenas condiciones de aislamiento. Registrar valor para historial.',
                color: 'text-green-500',
                bgColor: 'bg-green-500/10',
                borderColor: 'border-green-500/50'
            };
        }
    };

    const result = evaluateInsulation(resistance, voltageRating);

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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Input Section */}
                <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 backdrop-blur-sm shadow-xl">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                        <Zap className="mr-2 text-yellow-400" size={20} />
                        Datos de Medición
                    </h3>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-slate-400 mb-2 text-sm font-medium">
                                Resistencia Medida (1 min)
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={resistance}
                                    onChange={(e) => setResistance(e.target.value)}
                                    placeholder="0.0"
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">
                                    MΩ
                                </span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-slate-400 mb-2 text-sm font-medium">
                                Voltaje Nominal del Motor
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setVoltageRating('low')}
                                    className={`p-3 rounded-xl border transition-all flex flex-col items-center justify-center ${voltageRating === 'low'
                                            ? 'bg-purple-500/20 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                                            : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-600'
                                        }`}
                                >
                                    <span className="font-bold text-lg">&lt; 1000 V</span>
                                    <span className="text-xs opacity-80">Baja Tensión</span>
                                </button>
                                <button
                                    onClick={() => setVoltageRating('high')}
                                    className={`p-3 rounded-xl border transition-all flex flex-col items-center justify-center ${voltageRating === 'high'
                                            ? 'bg-purple-500/20 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                                            : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-600'
                                        }`}
                                >
                                    <span className="font-bold text-lg">&ge; 1000 V</span>
                                    <span className="text-xs opacity-80">Alta Tensión</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Result Section */}
                <div className="space-y-6">
                    {result ? (
                        <div className={`h-full p-6 rounded-2xl border ${result.borderColor} ${result.bgColor} backdrop-blur-sm transition-all animate-fade-in`}>
                            <div className="flex items-start mb-4">
                                {result.status === 'danger' && <AlertTriangle className="text-red-500 mr-3 shrink-0" size={32} />}
                                {result.status === 'warning' && <AlertTriangle className="text-yellow-500 mr-3 shrink-0" size={32} />}
                                {result.status === 'success' && <CheckCircle className="text-green-500 mr-3 shrink-0" size={32} />}

                                <div>
                                    <h3 className={`text-2xl font-bold ${result.color} mb-2`}>
                                        {result.title}
                                    </h3>
                                    <p className="text-white text-lg font-medium mb-4 leading-relaxed">
                                        {result.message}
                                    </p>
                                    <div className="bg-black/20 rounded-xl p-4 border border-black/10">
                                        <p className="text-slate-200 text-sm">
                                            <strong className="block mb-1 text-slate-400 uppercase text-xs tracking-wider">Recomendación:</strong>
                                            {result.action}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full bg-slate-900/30 p-6 rounded-2xl border border-white/5 flex flex-col justify-center items-center text-center text-slate-500 border-dashed">
                            <Activity size={48} className="mb-4 opacity-20" />
                            <p>Ingresa el valor de resistencia para ver el diagnóstico.</p>
                        </div>
                    )}
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
