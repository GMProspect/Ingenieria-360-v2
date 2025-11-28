import React, { useState, useMemo } from 'react';
import { Activity, ArrowRightLeft, Info } from 'lucide-react';
import { supabase } from '../supabase';
import BackButton from '../components/BackButton';
import { useAuth } from '../contexts/Auth';
import useLocalStorage from '../hooks/useLocalStorage';
import ToolHeader from '../components/ToolHeader';
import SaveCalculationSection from '../components/SaveCalculationSection';

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

        // Formula: Distance = (Voltage * 1000) / Sensitivity
        return ((v * 1000) / s);
    }, [voltage, sensitivity]);

    const clearAll = () => {
        setVoltage('');
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
                    distance: distance.toFixed(2)
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
                title="Sonda de Proximidad (Vibración)"
                subtitle="Verificación de GAP (Voltaje vs Distancia)"
                icon={Activity}
                iconColorClass="text-purple-400"
                iconBgClass="bg-purple-500/20"
                onReset={clearAll}
            />

            <div className="bg-slate-900/50 p-8 rounded-2xl border border-white/5 backdrop-blur-sm shadow-xl relative">

                {/* Info Box */}
                <div className="mb-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-start gap-3">
                    <Info className="text-blue-400 shrink-0 mt-0.5" size={20} />
                    <div className="text-sm text-blue-200">
                        <p className="font-bold mb-1">API 670 Standard</p>
                        <p>
                            Para sondas típicas de 5mm/8mm, la sensibilidad estándar es <strong>200 mV/mil</strong> (7.87 mV/µm).
                            El rango lineal suele ser de 10 a 90 mils (aprox -2V a -18V).
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-12">

                    {/* Inputs */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-slate-400 mb-2 font-medium">Voltaje DC (Gap)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={voltage}
                                    onChange={(e) => setVoltage(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-lg focus:border-purple-500 outline-none transition-colors"
                                    placeholder="-10.0"
                                    step="0.1"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">Vdc</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-slate-400 mb-2 font-medium">Sensibilidad de Sonda</label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    value={sensitivity}
                                    onChange={(e) => setSensitivity(e.target.value)}
                                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-lg focus:border-purple-500 outline-none transition-colors"
                                    placeholder="200"
                                />
                                <select
                                    value={unit}
                                    onChange={(e) => setUnit(e.target.value)}
                                    className="bg-slate-950 border border-slate-700 rounded-xl px-3 text-slate-300 focus:border-purple-500 outline-none"
                                >
                                    <option value="mils">mV/mil</option>
                                    <option value="um">mV/µm</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Result */}
                    <div className="flex flex-col items-center justify-center p-8 bg-slate-950/50 rounded-2xl border border-slate-800">
                        <div className="text-slate-500 font-medium mb-2 uppercase tracking-widest text-sm">Distancia (Gap)</div>
                        <div className="text-5xl font-bold text-white mb-2 font-mono">
                            {distance.toFixed(2)}
                        </div>
                        <div className="text-purple-400 font-bold text-xl">
                            {unit === 'mils' ? 'mils' : 'µm'}
                        </div>
                    </div>
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

            </div>
        </div>
    );
};

export default Vibration;
