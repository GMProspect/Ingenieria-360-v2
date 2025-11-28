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
    const [voltage, setVoltage] = useLocalStorage('vib_voltage', '-10.0'); // Volts DC
    const [sensitivity, setSensitivity] = useLocalStorage('vib_sens', '200'); // mV/mil or mV/um
    const [unit, setUnit] = useLocalStorage('vib_unit', 'mils'); // mils or um

    // ... (rest of state)

    // ... (derived values and clearAll)

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
        <div className="max-w-5xl mx-auto p-6">
            <BackButton />

            <ToolHeader
                title="Sonda de Vibración (API 670)"
                subtitle="Conversión de Voltaje de GAP a Distancia"
                icon={Activity}
                iconColorClass="text-red-400"
                iconBgClass="bg-red-500/20"
                onReset={clearAll}
            />

            <div className="bg-slate-900/50 p-8 rounded-2xl border border-white/5 backdrop-blur-sm shadow-xl relative">

                {/* Configuration Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Sensibilidad (mV/mil)</label>
                        <input
                            type="number"
                            value={sensitivity}
                            onChange={(e) => setSensitivity(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Unidad de Salida</label>
                        <select
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500 transition-colors"
                        >
                            <option value="mils">Mils (milésimas de pulgada)</option>
                            <option value="um">Micras (µm)</option>
                        </select>
                    </div>
                </div>

                <div className="border-t border-white/5 my-6" />

                {/* Real Time Conversion */}
                <div className="mb-8">
                    <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-4">Conversión en Tiempo Real</h3>
                    <div className="flex flex-col md:flex-row items-end gap-4">
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-slate-400 mb-1">Voltaje DC (V)</label>
                            <input
                                type="number"
                                value={voltage}
                                onChange={(e) => setVoltage(e.target.value)}
                                placeholder="-10.0"
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 font-mono text-lg shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                            />
                        </div>

                        <div className="pb-4 text-slate-600">
                            <ArrowRightLeft size={24} />
                        </div>

                        <div className="flex-1">
                            <label className="block text-xs font-medium text-slate-400 mb-1">GAP ({unit})</label>
                            <div className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white font-mono text-lg flex items-center shadow-[0_0_15px_rgba(34,211,238,0.1)]">
                                {distance.toFixed(2)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Box */}
                <div className="bg-slate-900/80 border-l-4 border-purple-500 rounded-r-xl p-6 mb-8 shadow-lg">
                    <div className="flex items-start gap-4">
                        <div className="text-purple-400 shrink-0 mt-1">
                            <Info size={28} />
                        </div>
                        <div className="space-y-3 text-slate-300">
                            <h4 className="font-bold text-white text-lg">¿Qué es esto?</h4>
                            <p className="text-sm leading-relaxed">
                                Esta herramienta simula la curva de calibración de un sistema de <strong className="text-white">Sonda de Proximidad</strong> (como Bently Nevada 3300 XL).
                            </p>
                            <ul className="text-sm space-y-2 list-disc pl-4 text-slate-400">
                                <li>
                                    <strong className="text-purple-400">API 670:</strong> Estándar mundial para protección de maquinaria (Turbinas, Compresores).
                                </li>
                                <li>
                                    <strong className="text-purple-400">TK3:</strong> Instrumento físico usado para verificar esta curva en campo.
                                </li>
                                <li>
                                    <strong className="text-purple-400">Objetivo:</strong> Verificar que la sonda mida la distancia correcta (GAP) al eje basándose en el voltaje DC.
                                </li>
                            </ul>
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
