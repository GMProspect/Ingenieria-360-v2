import React, { useState, useMemo } from 'react';
import { Activity, Info, AlertTriangle, ArrowRightLeft } from 'lucide-react';
import { supabase } from '../supabase';
import BackButton from '../components/BackButton';
import { useAuth } from '../contexts/Auth';
import useLocalStorage from '../hooks/useLocalStorage';
import ToolHeader from '../components/ToolHeader';
import SaveCalculationSection from '../components/SaveCalculationSection';
import AdBanner from '../components/AdBanner';

const Vibration = () => {
    const { user } = useAuth();
    const [voltage, setVoltage] = useLocalStorage('vib_voltage', '-10.0', user?.id); // Volts DC
    const [sensitivity, setSensitivity] = useLocalStorage('vib_sens', '200', user?.id); // mV/mil or mV/um
    const [unit, setUnit] = useLocalStorage('vib_unit', 'mils', user?.id); // mils or um

    const [label, setLabel] = useState('');
    const [description, setDescription] = useState('');
    const [saving, setSaving] = useState(false);

    // Derived Values
    const distance = useMemo(() => {
        const v = Math.abs(parseFloat(voltage));
        const s = parseFloat(sensitivity);
        if (isNaN(v) || isNaN(s) || s === 0) return 0;
        return ((v * 1000) / s);
    }, [voltage, sensitivity]);

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

    const clearAll = () => {
        setVoltage('-10.0');
        setSensitivity('200');
        setUnit('mils');
        setLabel('');
        setDescription('');
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
                tool_name: 'Sonda de Vibración',
                label: label,
                description: description,
                user_id: user.id,
                data: {
                    voltage,
                    sensitivity,
                    unit,
                    distance: distance.toFixed(2),
                    alert: alertStatus ? alertStatus.message : 'Normal'
                }
            }]);
            if (error) throw error;
            alert('Cálculo guardado correctamente.');
            setLabel('');
            setDescription('');
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
                title="Sonda de Vibración (API 670)"
                subtitle="Conversión de Voltaje de GAP a Distancia (Mils/Micras)"
                icon={Activity}
                iconColorClass="text-purple-400"
                iconBgClass="bg-purple-500/20"
                onReset={clearAll}
            />

            <div className="bg-slate-900/50 p-8 rounded-2xl border border-white/5 backdrop-blur-sm shadow-xl relative">

                {/* Configuration Section */}
                <div className="mb-8">
                    <h3 className="text-cyan-400 font-bold text-sm uppercase tracking-wider mb-4">Configuración de Sonda</h3>
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
                    <h3 className="text-cyan-400 font-bold text-sm uppercase tracking-wider mb-4">Conversión en Tiempo Real</h3>
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
                                    <span className="text-2xl font-bold text-white">{distance.toFixed(2)}</span>
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
                />
            </div>

            {/* AdSense Banner (Moved to very bottom) */}
            <AdBanner dataAdSlot="1234567890" />

        </div>
    );
};

export default Vibration;
