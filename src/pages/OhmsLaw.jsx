import React, { useState } from 'react';
import { Zap, RefreshCw, Save } from 'lucide-react';
import { supabase } from '../supabase';
import BackButton from '../components/BackButton';

const OhmsLaw = () => {
    const [voltage, setVoltage] = useState('');
    const [current, setCurrent] = useState('');
    const [resistance, setResistance] = useState('');
    const [activeField, setActiveField] = useState(null); // 'v', 'i', 'r'
    const [label, setLabel] = useState('');
    const [saving, setSaving] = useState(false);

    const calculate = () => {
        const v = parseFloat(voltage);
        const i = parseFloat(current);
        const r = parseFloat(resistance);

        if (activeField === 'v' && !isNaN(i) && !isNaN(r)) {
            setVoltage((i * r).toFixed(2));
        } else if (activeField === 'i' && !isNaN(v) && !isNaN(r)) {
            setCurrent((v / r).toFixed(4));
        } else if (activeField === 'r' && !isNaN(v) && !isNaN(i)) {
            setResistance((v / i).toFixed(2));
        }
    };

    const reset = () => {
        setVoltage('');
        setCurrent('');
        setResistance('');
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
                    voltage, current, resistance, calculated_field: activeField
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
                <div className="p-3 bg-yellow-500/20 rounded-xl text-yellow-400">
                    <Zap size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white">Ley de Ohm</h1>
                    <p className="text-slate-400">Calcula Voltaje (V), Corriente (I) o Resistencia (R)</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Visual Triangle */}
                <div className="relative flex justify-center">
                    <div className="w-80 h-80 relative">
                        <svg viewBox="0 0 200 180" className="w-full h-full drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                            <path d="M100 10 L190 170 L10 170 Z" fill="none" stroke="#eab308" strokeWidth="2" className="drop-shadow-lg" />
                            <line x1="55" y1="90" x2="145" y2="90" stroke="#eab308" strokeWidth="2" />
                            <line x1="100" y1="90" x2="100" y2="170" stroke="#eab308" strokeWidth="2" />

                            <text x="100" y="70" textAnchor="middle" fill={activeField === 'v' ? '#ffffff' : '#eab308'} fontSize="40" fontWeight="bold" className="cursor-pointer hover:fill-white transition-colors" onClick={() => setActiveField('v')}>V</text>
                            <text x="60" y="140" textAnchor="middle" fill={activeField === 'i' ? '#ffffff' : '#eab308'} fontSize="40" fontWeight="bold" className="cursor-pointer hover:fill-white transition-colors" onClick={() => setActiveField('i')}>I</text>
                            <text x="140" y="140" textAnchor="middle" fill={activeField === 'r' ? '#ffffff' : '#eab308'} fontSize="40" fontWeight="bold" className="cursor-pointer hover:fill-white transition-colors" onClick={() => setActiveField('r')}>R</text>
                        </svg>

                        <div className="absolute -bottom-8 left-0 w-full text-center text-sm text-slate-500">
                            Haz clic en la letra que quieres calcular
                        </div>
                    </div>
                </div>

                {/* Inputs */}
                <div className="space-y-6 bg-slate-900/50 p-8 rounded-2xl border border-white/5 backdrop-blur-sm shadow-xl">
                    <div className={`transition-all duration-300 ${activeField === 'v' ? 'opacity-50 pointer-events-none' : ''}`}>
                        <label className="block text-sm font-medium text-yellow-400 mb-1">Voltaje (V)</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={voltage}
                                onChange={(e) => setVoltage(e.target.value)}
                                placeholder="0.00"
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-4 pr-12 py-3 text-white focus:outline-none focus:border-yellow-500 transition-colors text-lg font-mono"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">V</span>
                        </div>
                    </div>

                    <div className={`transition-all duration-300 ${activeField === 'i' ? 'opacity-50 pointer-events-none' : ''}`}>
                        <label className="block text-sm font-medium text-cyan-400 mb-1">Corriente (I)</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={current}
                                onChange={(e) => setCurrent(e.target.value)}
                                placeholder="0.00"
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-4 pr-12 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors text-lg font-mono"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">A</span>
                        </div>
                    </div>

                    <div className={`transition-all duration-300 ${activeField === 'r' ? 'opacity-50 pointer-events-none' : ''}`}>
                        <label className="block text-sm font-medium text-purple-400 mb-1">Resistencia (R)</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={resistance}
                                onChange={(e) => setResistance(e.target.value)}
                                placeholder="0.00"
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-4 pr-12 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors text-lg font-mono"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">Ω</span>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            onClick={calculate}
                            disabled={!activeField}
                            className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Calcular {activeField ? activeField.toUpperCase() : ''}
                        </button>
                        <button
                            onClick={reset}
                            className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                        >
                            <RefreshCw size={20} />
                        </button>
                    </div>

                    <div className="border-t border-white/5 my-4" />

                    {/* Save Section */}
                    <div className="flex gap-4 items-end">
                        <div className="flex-1">
                            <input
                                type="text"
                                value={label}
                                onChange={(e) => setLabel(e.target.value)}
                                placeholder="Etiqueta (Ej: Circuito 1)"
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                            />
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-4 py-2 bg-slate-700 hover:bg-purple-600 text-white font-bold rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 text-sm"
                        >
                            <Save size={16} />
                            Guardar
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default OhmsLaw;
