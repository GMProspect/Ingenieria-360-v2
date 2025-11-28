import React, { useState, useEffect } from 'react';
import { Activity, ArrowRightLeft, Info, Save } from 'lucide-react';
import { supabase } from '../supabase';
import BackButton from '../components/BackButton';

const Vibration = () => {
    const [voltage, setVoltage] = useState('-10.0'); // Volts DC
    const [sensitivity, setSensitivity] = useState('200'); // mV/mil or mV/um
    const [unit, setUnit] = useState('mils'); // mils or um
    const [distance, setDistance] = useState(0);
    const [label, setLabel] = useState('');
    const [saving, setSaving] = useState(false);

    // Standard Gap Range for visualization (approx 0 to 100 mils usually)
    const MAX_GAP_MILS = 100;
    const MAX_GAP_UM = 2500;

    useEffect(() => {
        const v = Math.abs(parseFloat(voltage)); // Use absolute value for calculation logic usually, but gap voltage is negative
        const s = parseFloat(sensitivity);

        // Gap Voltage is usually negative (e.g. -10V). 
        // Distance = (Voltage * 1000) / Sensitivity. 
        // Usually we care about the magnitude.

        if (!isNaN(v) && !isNaN(s) && s !== 0) {
            const d = (v * 1000) / s;
            setDistance(d);
        } else {
            setDistance(0);
        }
    }, [voltage, sensitivity]);

    const getProgressPercentage = () => {
        const max = unit === 'mils' ? MAX_GAP_MILS : MAX_GAP_UM;
        const percent = (distance / max) * 100;
        return Math.min(Math.max(percent, 0), 100);
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
                data: {
                    voltage, sensitivity, unit, distance
                }
            }]);
            if (error) throw error;
            alert('Cálculo guardado correctamente.');
            setLabel('');
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

            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-red-500/20 rounded-xl text-red-400">
                    <Activity size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white">Sonda de Vibración (API 670)</h1>
                    <p className="text-slate-400">Conversión de Voltaje de GAP a Distancia (Mils/Micras)</p>
                </div>
            </div>

            <div className="bg-slate-900/50 p-8 rounded-2xl border border-white/5 backdrop-blur-sm shadow-xl">

                {/* Configuration Section */}
                <div className="mb-8">
                    <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-4">Configuración de Sonda</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">Sensibilidad (mV/mil) ↺</label>
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
                </div>

                <div className="border-t border-white/5 my-6" />

                {/* Real Time Conversion */}
                <div className="mb-8">
                    <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-4">Conversión en Tiempo Real</h3>
                    <div className="flex flex-col md:flex-row items-end gap-4">
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-slate-400 mb-1">Voltaje DC (V)</label>
                            <input
                                type="number"
                                value={voltage}
                                onChange={(e) => setVoltage(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 font-mono text-lg"
                            />
                        </div>

                        <div className="pb-4 text-purple-500">
                            <ArrowRightLeft size={24} />
                        </div>

                        <div className="flex-1">
                            <label className="block text-xs font-medium text-slate-400 mb-1">GAP ({unit})</label>
                            <div className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white font-mono text-lg flex items-center">
                                {distance.toFixed(2)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Visualization */}
                <div className="bg-slate-950 rounded-xl p-8 border border-slate-800 relative overflow-hidden mb-8 h-48 flex items-center justify-center">
                    {/* Probe Tip */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-24 bg-gradient-to-b from-slate-600 to-slate-400 rounded-b-lg z-10 shadow-lg flex items-end justify-center">
                        <div className="w-8 h-2 bg-black/40 rounded-full mb-2 blur-[1px]" />
                    </div>

                    {/* Shaft Surface */}
                    <div
                        className="absolute left-1/2 -translate-x-1/2 w-32 h-1 bg-cyan-500 shadow-[0_0_15px_#22d3ee] transition-all duration-300 z-20"
                        style={{ bottom: `${Math.max(100 - getProgressPercentage(), 10)}%` }} // Invert logic: 0 gap = close to probe (top)
                    >
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-cyan-400 font-mono whitespace-nowrap">
                            SUPERFICIE (EJE)
                        </div>
                    </div>

                    {/* Distance Label */}
                    <div
                        className="absolute left-1/2 translate-x-8 text-cyan-400 font-bold text-sm transition-all duration-300"
                        style={{ top: `${getProgressPercentage() / 2 + 20}%` }}
                    >
                        {distance.toFixed(1)} {unit}
                    </div>
                </div>

                {/* Info Box */}
                <div className="bg-slate-900/80 border border-blue-500/30 rounded-xl p-4 flex gap-4 mb-8">
                    <div className="text-blue-400 shrink-0 mt-1">
                        <Info size={24} />
                    </div>
                    <div className="text-sm text-slate-300 space-y-2">
                        <h4 className="font-bold text-white">¿Qué es esto?</h4>
                        <p>Esta herramienta simula la curva de calibración de un sistema de <strong className="text-white">Sonda de Proximidad</strong> (como Bently Nevada 3300 XL).</p>
                        <ul className="list-disc pl-4 space-y-1 text-slate-400">
                            <li><strong className="text-slate-300">API 670</strong>: Estándar mundial para protección de maquinaria (Turbinas, Compresores).</li>
                            <li><strong className="text-slate-300">Objetivo</strong>: Verificar que la sonda mida la distancia correcta (GAP) al eje basándose en el voltaje DC.</li>
                        </ul>
                    </div>
                </div>

                {/* Save Section */}
                <div className="flex gap-4 items-end bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                    <div className="flex-1">
                        <label className="block text-xs font-medium text-slate-500 mb-1">Etiqueta (Ej: VIB-201A)</label>
                        <input
                            type="text"
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                        />
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-2 bg-slate-700 hover:bg-purple-600 text-white font-bold rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        <Save size={18} />
                        {saving ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Vibration;
