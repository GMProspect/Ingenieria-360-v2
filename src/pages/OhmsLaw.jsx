import React, { useState, useEffect } from 'react';
import { Zap, Save, Trash2, Activity, Gauge, RotateCcw } from 'lucide-react';
import { supabase } from '../supabase';
import BackButton from '../components/BackButton';
import useLocalStorage from '../hooks/useLocalStorage';

const OhmsLaw = () => {
    // Use local storage for persistence
    const [voltage, setVoltage] = useLocalStorage('ohms_voltage', '');
    const [current, setCurrent] = useLocalStorage('ohms_current', '');
    const [resistance, setResistance] = useLocalStorage('ohms_resistance', '');

    // Track which field is being edited to avoid overwriting it
    const [activeField, setActiveField] = useState(null);
    const [label, setLabel] = useState('');
    const [saving, setSaving] = useState(false);

    const handleInputChange = (e, field) => {
        const val = e.target.value;
        setActiveField(field);

        // Update the state for the changed field
        if (field === 'voltage') setVoltage(val);
        if (field === 'current') setCurrent(val);
        if (field === 'resistance') setResistance(val);

        // SMART CLEARING LOGIC:
        // If the user clears a field, we must clear the dependent field to avoid "ghost" values.
        // We assume that if you clear a value, you are breaking the current calculation.
        if (val === '') {
            if (field === 'voltage') {
                // If V is cleared, and we have R, clear I (because I depended on V/R)
                // Or if we have I, clear R.
                if (resistance) setCurrent('');
                else if (current) setResistance('');
            }
            if (field === 'current') {
                if (resistance) setVoltage('');
                else if (voltage) setResistance('');
            }
            if (field === 'resistance') {
                if (current) setVoltage('');
                else if (voltage) setCurrent('');
            }
            return;
        }

        const numVal = parseFloat(val);
        if (isNaN(numVal)) return;

        // CALCULATION LOGIC:

        if (field === 'voltage') {
            const r = parseFloat(resistance);
            const i = parseFloat(current);
            if (!isNaN(r) && r !== 0) {
                setCurrent((numVal / r).toFixed(2));
            } else if (!isNaN(i) && i !== 0) {
                setResistance((numVal / i).toFixed(2));
            }
        }

        if (field === 'current') {
            const r = parseFloat(resistance);
            const v = parseFloat(voltage);
            if (!isNaN(r)) {
                setVoltage((numVal * r).toFixed(2));
            } else if (!isNaN(v) && numVal !== 0) {
                setResistance((v / numVal).toFixed(2));
            }
        }

        if (field === 'resistance') {
            const i = parseFloat(current);
            const v = parseFloat(voltage);
            if (!isNaN(i)) {
                setVoltage((numVal * i).toFixed(2));
            } else if (!isNaN(v) && numVal !== 0) {
                setCurrent((v / numVal).toFixed(2));
            }
        }
    };

    const clearAll = () => {
        setVoltage('');
        setCurrent('');
        setResistance('');
        setLabel('');
        setActiveField(null);
    };

    const handleSave = async () => {
        if (!label.trim()) {
            alert('Por favor ingresa una etiqueta.');
            return;
        }
        setSaving(true);
        try {
            const { error } = await supabase.from('history').insert([{
                tool_name: 'Ley de Ohm',
                label: label,
                data: {
                    voltage, current, resistance
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
        <div className="max-w-4xl mx-auto p-6">
            <BackButton />

            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-yellow-500/20 rounded-xl text-yellow-400">
                        <Zap size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Ley de Ohm</h1>
                        <p className="text-slate-400">Calculadora Automática (Triángulo)</p>
                    </div>
                </div>

                {/* Visible Reset Button */}
                <button
                    onClick={clearAll}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-all border border-slate-700 hover:border-red-500/50"
                >
                    <RotateCcw size={18} />
                    <span className="font-bold text-sm">Reiniciar</span>
                </button>
            </div>

            <div className="bg-slate-900/50 p-8 rounded-2xl border border-white/5 backdrop-blur-sm shadow-xl relative">

                {/* Triangle Container */}
                <div className="relative w-full max-w-[500px] mx-auto h-[450px] mb-12 flex justify-center items-center">

                    {/* The Triangle Shape (Background) */}
                    <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                        <div className="w-0 h-0 
                            border-l-[250px] border-l-transparent 
                            border-r-[250px] border-r-transparent 
                            border-b-[433px] border-b-slate-800/50 
                            filter drop-shadow-[0_0_15px_rgba(0,242,255,0.1)]">
                        </div>
                    </div>

                    {/* Dividers - Adjusted Widths */}
                    {/* Horizontal Divider: At 50% height, width is 50% of base (250px) */}
                    <div className="absolute top-[216px] w-[220px] h-1 bg-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.5)] rounded-full"></div>
                    {/* Vertical Divider */}
                    <div className="absolute top-[216px] bottom-[17px] w-1 bg-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.5)] rounded-full"></div>

                    {/* TOP SECTION: VOLTAGE */}
                    <div className="absolute top-[80px] flex flex-col items-center z-10">
                        <label className="text-yellow-400 font-bold mb-1 flex items-center gap-1 text-lg shadow-black drop-shadow-md">
                            <Zap size={20} /> Voltaje (V)
                        </label>
                        <input
                            type="number"
                            value={voltage}
                            onChange={(e) => handleInputChange(e, 'voltage')}
                            placeholder="?"
                            className="w-32 bg-slate-950/80 border-2 border-yellow-500/50 rounded-xl px-2 py-2 text-center text-2xl font-bold text-white focus:outline-none focus:border-yellow-400 focus:shadow-[0_0_20px_rgba(250,204,21,0.4)] transition-all placeholder-slate-600"
                        />
                    </div>

                    {/* BOTTOM LEFT: RESISTANCE */}
                    <div className="absolute bottom-[50px] left-[40px] md:left-[60px] flex flex-col items-center z-10">
                        <label className="text-purple-400 font-bold mb-1 flex items-center gap-1 text-lg shadow-black drop-shadow-md">
                            <Gauge size={20} /> Resistencia (R)
                        </label>
                        <input
                            type="number"
                            value={resistance}
                            onChange={(e) => handleInputChange(e, 'resistance')}
                            placeholder="?"
                            className="w-32 bg-slate-950/80 border-2 border-purple-500/50 rounded-xl px-2 py-2 text-center text-2xl font-bold text-white focus:outline-none focus:border-purple-400 focus:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all placeholder-slate-600"
                        />
                    </div>

                    {/* BOTTOM RIGHT: CURRENT */}
                    <div className="absolute bottom-[50px] right-[40px] md:right-[60px] flex flex-col items-center z-10">
                        <label className="text-cyan-400 font-bold mb-1 flex items-center gap-1 text-lg shadow-black drop-shadow-md">
                            <Activity size={20} /> Corriente (I)
                        </label>
                        <input
                            type="number"
                            value={current}
                            onChange={(e) => handleInputChange(e, 'current')}
                            placeholder="?"
                            className="w-32 bg-slate-950/80 border-2 border-cyan-500/50 rounded-xl px-2 py-2 text-center text-2xl font-bold text-white focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all placeholder-slate-600"
                        />
                    </div>
                </div>

                {/* Save Section */}
                <div className="mt-8 bg-slate-950 rounded-xl border border-slate-800 p-6">
                    <div className="flex items-center gap-2 mb-4 text-slate-400 border-b border-slate-800 pb-2">
                        <Save size={18} />
                        <h3 className="font-bold uppercase tracking-wider text-xs">Guardar en Historial</h3>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full">
                            <label className="block text-xs font-medium text-slate-500 mb-1">Etiqueta (Ej: Motor Principal)</label>
                            <input
                                type="text"
                                value={label}
                                onChange={(e) => setLabel(e.target.value)}
                                placeholder="Nombre para identificar este cálculo..."
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                            />
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full md:w-auto px-6 py-2.5 bg-slate-800 hover:bg-purple-600 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 border border-slate-700 hover:border-purple-500"
                        >
                            <Save size={18} />
                            {saving ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default OhmsLaw;
