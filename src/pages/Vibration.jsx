import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, AlertTriangle, ArrowRightLeft, Settings } from 'lucide-react';
import { supabase } from '../supabase';
import BackButton from '../components/BackButton';
import { useAuth } from '../contexts/Auth';
import useLocalStorage from '../hooks/useLocalStorage';
import ToolHeader from '../components/ToolHeader';
import SaveCalculationSection from '../components/SaveCalculationSection';
import AdBanner from '../components/AdBanner';
import RecentHistory from '../components/RecentHistory';

const Vibration = () => {
    const { user } = useAuth();
    const [voltage, setVoltage] = useLocalStorage('vib_voltage', '-10.0', user?.id); // Volts DC
    const [sensitivity, setSensitivity] = useLocalStorage('vib_sens', '200', user?.id); // mV/mil or mV/um
    const [unit, setUnit] = useLocalStorage('vib_unit', 'mils', user?.id); // mils or um
    const [isoClass, setIsoClass] = useLocalStorage('vib_iso_class', '1', user?.id);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [label, setLabel] = useState('');
    const [description, setDescription] = useState('');
    const [saving, setSaving] = useState(false);
    const [isSessionActive, setIsSessionActive] = useState(false);

    const [gapInput, setGapInput] = useState('');
    const [velocity, setVelocity] = useState('');
    const [acceleration, setAcceleration] = useState('');
    const [displacement, setDisplacement] = useState('');

    // Derived Values for Gap
    const distance = useMemo(() => {
        const v = Math.abs(parseFloat(voltage));
        const s = parseFloat(sensitivity);
        if (isNaN(v) || isNaN(s) || s === 0) return 0;
        return ((v * 1000) / s);
    }, [voltage, sensitivity]);

    // Update gapInput when distance changes (calculated from voltage)
    useEffect(() => {
        if (!isNaN(distance)) {
            setGapInput(distance.toFixed(2));
        }
    }, [distance]);

    const handleGapChange = (val) => {
        setGapInput(val);
        const d = parseFloat(val);
        const s = parseFloat(sensitivity);

        if (!isNaN(d) && !isNaN(s) && s !== 0) {
            // V = (D * S) / 1000
            // Maintain negative sign convention for proximity probes
            const v = (d * s) / 1000;
            setVoltage((-Math.abs(v)).toFixed(2));
        }
    };

    // Alerts Logic (API 670)
    const alertStatus = useMemo(() => {
        const v = parseFloat(voltage);
        if (isNaN(v)) return null;

        // API 670: Linear range is typically -2V to -18V
        if (v > -2.0) {
            return {
                type: 'danger',
                message: 'ALERTA: Zona Muerta / Roce (< 2V)',
                description: 'La sonda está demasiado cerca del eje. Riesgo de daño físico.'
            };
        }
        if (v < -18.0) {
            return {
                type: 'warning',
                message: 'ALERTA: Fuera de Rango Lineal (> 18V)',
                description: 'La sonda está demasiado lejos. La medición no es confiable.'
            };
        }
        return {
            type: 'success',
            message: 'Rango Lineal Óptimo',
            description: 'La sonda opera dentro de los parámetros API 670 (-2V a -18V).'
        };
    }, [voltage]);

    // ISO 10816-3 Evaluation Logic (Simplified)
    const evaluateIso = () => {
        if (!velocity) return null;
        const v = parseFloat(velocity);
        if (isNaN(v)) return null;

        // Simplified thresholds for Zone A/B/C/D based on Class
        // Class I: Small machines
        // Class II: Medium machines
        // Class III: Large rigid
        // Class IV: Large flexible

        let limits = { good: 0.71, satisfactory: 1.8, unsatisfactory: 4.5 }; // Default Class I

        if (isoClass === '2') limits = { good: 1.12, satisfactory: 2.8, unsatisfactory: 7.1 };
        if (isoClass === '3') limits = { good: 1.8, satisfactory: 4.5, unsatisfactory: 11.2 };
        if (isoClass === '4') limits = { good: 2.8, satisfactory: 7.1, unsatisfactory: 18.0 };

        if (v <= limits.good) return { status: 'success', title: 'Zona A: Bueno', message: 'Vibración dentro de límites normales para operación continua.', color: 'text-green-500', bgColor: 'bg-green-500/10', borderColor: 'border-green-500/50', action: 'Operación normal.' };
        if (v <= limits.satisfactory) return { status: 'success', title: 'Zona B: Satisfactorio', message: 'Vibración aceptable para operación a largo plazo.', color: 'text-cyan-500', bgColor: 'bg-cyan-500/10', borderColor: 'border-cyan-500/50', action: 'Monitorear tendencia.' };
        if (v <= limits.unsatisfactory) return { status: 'warning', title: 'Zona C: Insatisfactorio', message: 'Vibración restringida. Operación permitida por tiempo limitado.', color: 'text-yellow-500', bgColor: 'bg-yellow-500/10', borderColor: 'border-yellow-500/50', action: 'Planificar mantenimiento correctivo.' };
        return { status: 'danger', title: 'Zona D: Inaceptable', message: 'Niveles peligrosos de vibración. Riesgo de daño severo.', color: 'text-red-500', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/50', action: 'PARADA INMEDIATA requerida.' };
    };

    const result = evaluateIso();

    const clearAll = () => {
        setVoltage('-10.0');
        setSensitivity('200');
        setUnit('mils');
        setVelocity('');
        setAcceleration('');
        setDisplacement('');
        setLabel('');
        setDescription('');
        setIsSessionActive(false);
    };

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
                tool_name: 'Vibración',
                label: label,
                description: description,
                user_id: user.id,
                data: {
                    voltage,
                    sensitivity,
                    unit,
                    distance: distance.toFixed(2),
                    alert: alertStatus ? alertStatus.message : 'Normal',
                    velocity,
                    acceleration,
                    displacement,
                    isoClass,
                    result: result?.status
                }
            }]);
            if (error) throw error;
            alert('Evaluación guardada correctamente.');
            setIsSessionActive(true);
        } catch (error) {
            console.error('Error saving:', error);
            alert('Error al guardar.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <BackButton />

            <ToolHeader
                title="Análisis de Vibración"
                subtitle="Evaluación según ISO 10816-3 y API 670"
                icon={Activity}
                iconColorClass="text-pink-400"
                iconBgClass="bg-pink-500/20"
                onReset={clearAll}
            />

            <div className="bg-slate-900/50 p-8 rounded-2xl border border-white/5 backdrop-blur-sm shadow-xl relative">

                {/* Configuration Section */}
                <div className="mb-8">
                    <h3 className="text-cyan-400 font-bold text-sm uppercase tracking-wider mb-4 border-b border-cyan-500/30 pb-2 flex items-center gap-2">
                        <Settings size={16} /> Configuración de Sonda (API 670)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-slate-400 mb-2 text-sm">Sensibilidad</label>
                            <select
                                value={sensitivity}
                                onChange={(e) => setSensitivity(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-cyan-500 outline-none transition-colors"
                            >
                                <option value="200">200 mV/mil (Estándar API 670)</option>
                                <option value="7.87">7.87 mV/µm (Estándar Métrico)</option>
                                <option value="100">100 mV/mil (Sondas Antiguas)</option>
                                <option value="3.94">3.94 mV/µm (Equiv. 100 mV/mil)</option>
                            </select>
                            <div className="mt-2 text-[10px] text-slate-500">
                                * 200 mV/mil ≈ 7.87 mV/µm
                            </div>
                        </div>
                        <div>
                            <label className="block text-slate-400 mb-2 text-sm">Unidad de Salida</label>
                            <select
                                value={unit}
                                onChange={(e) => setUnit(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-cyan-500 outline-none transition-colors"
                            >
                                <option value="mils">Mils (milésimas de pulgada)</option>
                                <option value="um">Micras (µm)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Conversion Section */}
                <div className="mb-8">
                    <h3 className="text-cyan-400 font-bold text-sm uppercase tracking-wider mb-4 border-b border-cyan-500/30 pb-2 flex items-center gap-2">
                        <ArrowRightLeft size={16} /> Conversión en Tiempo Real
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* Inputs Column */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-slate-400 mb-2 text-sm">Voltaje DC (V)</label>
                                <div className={`relative rounded-xl border-2 transition-colors ${alertStatus?.type === 'danger' ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : alertStatus?.type === 'warning' ? 'border-yellow-500' : alertStatus?.type === 'success' ? 'border-emerald-500' : 'border-purple-500'}`}>
                                    <input
                                        type="number"
                                        value={voltage}
                                        onChange={(e) => setVoltage(e.target.value)}
                                        className="w-full bg-transparent px-4 py-3 text-white text-2xl font-bold text-center outline-none"
                                        step="0.1"
                                        placeholder="-10.0"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-slate-400 mb-2 text-sm">GAP ({unit})</label>
                                <div className="bg-slate-800/50 rounded-xl border border-slate-700 px-4 py-3 text-center">
                                    <input
                                        type="number"
                                        value={gapInput}
                                        onChange={(e) => handleGapChange(e.target.value)}
                                        className="w-full bg-transparent text-2xl font-bold text-white text-center outline-none"
                                        step="0.01"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Interactive Visualization Column */}
                        <div className="flex flex-col items-center justify-center p-8 bg-slate-950/50 rounded-2xl border border-slate-800 relative overflow-hidden min-h-[300px]">

                            {/* Interactive Visualization */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                {/* Probe Body */}
                                <div className="w-16 h-32 bg-gradient-to-r from-slate-500 to-slate-700 rounded-b-lg mb-1 relative shadow-lg z-10 flex items-center justify-center">
                                    <div className="w-12 h-full border-x border-slate-800/30"></div>
                                    <div className="absolute inset-x-0 bottom-0 h-4 bg-yellow-600/80 rounded-b-lg border-t border-yellow-500/50"></div>
                                </div>

                                {/* Gap (Dynamic Height) */}
                                <div
                                    style={{ height: `${Math.min(Math.max(distance * 3, 4), 150)}px` }}
                                    className="w-0.5 border-l-2 border-dashed border-cyan-500 transition-all duration-300 relative"
                                >
                                    <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-cyan-400 font-mono whitespace-nowrap bg-slate-900/80 px-1 rounded">
                                        {distance.toFixed(1)} {unit}
                                    </div>
                                </div>

                                {/* Surface (Shaft) */}
                                <div className="w-48 h-16 bg-slate-700 rounded-t-[100%] relative overflow-hidden shadow-inner border-t border-white/10">
                                    <div className="absolute inset-0 bg-gradient-to-b from-slate-600 to-slate-800"></div>
                                    <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] text-slate-400 uppercase tracking-widest">Superficie (Eje)</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Alert Box */}
                {alertStatus && (
                    <div className={`mb-8 p-4 rounded-xl border flex items-center gap-3 ${alertStatus.type === 'danger'
                        ? 'bg-red-500/10 border-red-500/50 text-red-400'
                        : alertStatus.type === 'warning'
                            ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-400'
                            : 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                        }`}>
                        {alertStatus.type === 'success' ? (
                            <div className="shrink-0 p-1 bg-emerald-500/20 rounded-full">
                                <Activity size={16} />
                            </div>
                        ) : (
                            <AlertTriangle className="shrink-0" />
                        )}
                        <div>
                            <div className="font-bold uppercase">{alertStatus.message}</div>
                            <div className="text-sm opacity-80">{alertStatus.description}</div>
                        </div>
                    </div>
                )}

                <SaveCalculationSection
                    label={label}
                    setLabel={setLabel}
                    description={description}
                    setDescription={setDescription}
                    onSave={handleSave}
                    onClear={clearAll}
                    saving={saving}
                    isSessionActive={isSessionActive}
                />

                {/* ISO 10816-3 Section */}
                <div className="mb-8">
                    <h3 className="text-pink-400 font-bold text-sm uppercase tracking-wider mb-4 border-b border-pink-500/30 pb-2 flex items-center gap-2">
                        <Activity size={16} /> Evaluación ISO 10816-3
                    </h3>

                    <div className="mb-6">
                        <label className="block text-xs text-slate-500 mb-2 font-bold uppercase">Clase de Máquina</label>
                        <div className="grid grid-cols-1 gap-2">
                            {[
                                { id: '1', label: 'Clase I: Pequeñas (< 15kW)' },
                                { id: '2', label: 'Clase II: Medianas (15-75kW)' },
                                { id: '3', label: 'Clase III: Grandes (Cimentación Rígida)' },
                                { id: '4', label: 'Clase IV: Grandes (Cimentación Flexible)' }
                            ].map((c) => (
                                <button
                                    key={c.id}
                                    onClick={() => setIsoClass(c.id)}
                                    className={`text-left px-4 py-3 rounded-xl border transition-all text-sm font-medium ${isoClass === c.id
                                        ? 'bg-pink-600 border-pink-500 text-white shadow-lg shadow-pink-500/20'
                                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                                        }`}
                                >
                                    {c.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div>
                            <label className="block text-xs text-slate-500 mb-1 font-bold uppercase">Velocidad (RMS)</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="number"
                                    value={velocity}
                                    onChange={(e) => setVelocity(e.target.value)}
                                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-xl font-bold outline-none focus:border-pink-500 transition-colors"
                                    placeholder="0.00"
                                />
                                <span className="text-slate-500 font-bold">mm/s</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs text-slate-500 mb-1 font-bold uppercase">Aceleración (Peak)</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="number"
                                    value={acceleration}
                                    onChange={(e) => setAcceleration(e.target.value)}
                                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-xl font-bold outline-none focus:border-pink-500 transition-colors"
                                    placeholder="0.00"
                                />
                                <span className="text-slate-500 font-bold">g</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs text-slate-500 mb-1 font-bold uppercase">Desplazamiento (p-p)</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="number"
                                    value={displacement}
                                    onChange={(e) => setDisplacement(e.target.value)}
                                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-xl font-bold outline-none focus:border-pink-500 transition-colors"
                                    placeholder="0"
                                />
                                <span className="text-slate-500 font-bold">µm</span>
                            </div>
                        </div>
                    </div>

                    {result && (
                        <div className={`p-6 rounded-2xl border transition-all duration-500 ${result.color} ${result.bgColor} ${result.borderColor}`}>
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-xl bg-black/20 shrink-0">
                                    <Activity size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-1">{result.title}</h3>
                                    <p className="text-sm opacity-90 leading-relaxed font-medium">
                                        {result.message}
                                    </p>
                                    <div className="mt-4 bg-black/20 rounded-xl p-4 border border-black/10">
                                        <p className="text-xs opacity-70 font-bold uppercase mb-1">Acción Recomendada:</p>
                                        <p className="text-sm">{result.action}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>



                <RecentHistory
                    toolName="Sonda de Vibración"
                    onLoadData={(item) => {
                        if (confirm(`¿Cargar datos de ${item.label}?`)) {
                            setVoltage(item.data.voltage || '-10.0');
                            setSensitivity(item.data.sensitivity || '200');
                            setUnit(item.data.unit || 'mils');
                            setVelocity(item.data.velocity || '');
                            setAcceleration(item.data.acceleration || '');
                            setDisplacement(item.data.displacement || '');
                            setIsoClass(item.data.isoClass || '1');
                            setLabel(item.label || '');
                            setDescription(item.description || '');
                            setIsSessionActive(true);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                    }}
                    refreshTrigger={saving}
                />

                <AdBanner dataAdSlot="1234567890" />
            </div>
        </div>
    );
};

export default Vibration;
