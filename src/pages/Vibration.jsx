import React, { useState, useEffect, useMemo } from 'react';
import { Activity, ArrowRightLeft, Info, Save, RotateCcw } from 'lucide-react';
import { supabase } from '../supabase';
import BackButton from '../components/BackButton';
import useLocalStorage from '../hooks/useLocalStorage';

const Vibration = () => {
    const [voltage, setVoltage] = useLocalStorage('vib_voltage', '-10.0'); // Volts DC
    const [sensitivity, setSensitivity] = useLocalStorage('vib_sens', '200'); // mV/mil or mV/um
    const [unit, setUnit] = useLocalStorage('vib_unit', 'mils'); // mils or um

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
        setSaving(true);
        try {
            const { error } = await supabase.from('history').insert([{
                tool_name: 'Sonda de Vibración',
                label: label,
                description: description,
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

            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-red-500/20 rounded-xl text-red-400">
                        <Activity size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Sonda de Vibración (API 670)</h1>
                        <p className="text-slate-400">Conversión de Voltaje de GAP a Distancia</p>
                    </div>
                </div>

                <button
                    onClick={clearAll}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-all border border-slate-700 hover:border-red-500/50"
                >
                    <RotateCcw size={18} />
                    <span className="font-bold text-sm">Reiniciar</span>
                </button>
            </div>

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

                {/* Save Section */}
                <div className="mt-12 bg-slate-950 rounded-xl border border-slate-800 p-6">
                    <div className="flex items-center gap-2 mb-4 text-slate-400 border-b border-slate-800 pb-2">
                        <Save size={18} />
                        <h3 className="font-bold uppercase tracking-wider text-xs">Guardar en Historial</h3>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Etiqueta</label>
                                <input
                                    type="text"
                                    value={label}
                                    onChange={(e) => setLabel(e.target.value)}
                                    placeholder="Ej. Turbina 1 - Sonda X"
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-purple-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Descripción</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Ubicación, detalles adicionales..."
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-purple-500 h-[50px] resize-none pt-3 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={clearAll}
                                className="flex-1 py-3 rounded-xl bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white transition-all font-bold flex items-center justify-center gap-2 border border-slate-800"
                            >
                                <RotateCcw size={20} />
                                Limpiar
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex-[2] py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2"
                            >
                                <Save size={20} />
                                {saving ? 'Guardando...' : 'Guardar Cálculo'}
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Vibration;
