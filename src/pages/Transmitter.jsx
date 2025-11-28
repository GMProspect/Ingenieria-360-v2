import React, { useState, useEffect } from 'react';
import { Gauge, ArrowRightLeft, Save } from 'lucide-react';
import { supabase } from '../supabase';
import BackButton from '../components/BackButton';

const Transmitter = () => {
    const [mode, setMode] = useState('ma_to_pv'); // 'ma_to_pv' or 'pv_to_ma'
    const [lrv, setLrv] = useState('0');
    const [urv, setUrv] = useState('100');
    const [unit, setUnit] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [result, setResult] = useState(null);
    const [label, setLabel] = useState('');
    const [saving, setSaving] = useState(false);

    // Calibration Points
    const [checkpoints, setCheckpoints] = useState([]);

    useEffect(() => {
        const min = parseFloat(lrv);
        const max = parseFloat(urv);
        const val = parseFloat(inputValue);

        if (isNaN(min) || isNaN(max)) {
            setResult(null);
            setCheckpoints([]);
            return;
        }

        const span = max - min;

        // Calculate Checkpoints (0, 25, 50, 75, 100%)
        const points = [0, 0.25, 0.5, 0.75, 1].map(percent => {
            const pv = (span * percent) + min;
            const ma = (16 * percent) + 4;
            return { percent: percent * 100, pv, ma };
        });
        setCheckpoints(points);

        if (isNaN(val)) {
            setResult(null);
            return;
        }

        if (mode === 'ma_to_pv') {
            // mA to PV
            const pv = ((val - 4) / 16) * span + min;
            setResult(pv);
        } else {
            // PV to mA
            if (span === 0) {
                setResult(null);
                return;
            }
            const ma = ((val - min) / span) * 16 + 4;
            setResult(ma);
        }
    }, [lrv, urv, inputValue, mode]);

    const handleSave = async () => {
        if (!result || !label.trim()) {
            alert('Por favor ingresa una etiqueta y realiza un cálculo válido.');
            return;
        }
        setSaving(true);
        try {
            const { error } = await supabase.from('history').insert([{
                tool_name: 'Transmisor 4-20mA',
                label: label,
                data: {
                    mode, lrv, urv, unit, input: inputValue, result, checkpoints
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
                <div className="p-3 bg-green-500/20 rounded-xl text-green-400">
                    <Gauge size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white">Escalado 4-20mA</h1>
                    <p className="text-slate-400">Calculadora de Transmisores de Instrumentación</p>
                </div>
            </div>

            <div className="bg-slate-900/50 p-8 rounded-2xl border border-white/5 backdrop-blur-sm shadow-xl">

                {/* Section: Instrument Calibration */}
                <div className="mb-8">
                    <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-4">Calibración del Instrumento</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">Valor a 4mA (Mínimo)</label>
                            <input
                                type="number"
                                value={lrv}
                                onChange={(e) => setLrv(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500 transition-colors font-mono"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">Valor a 20mA (Máximo)</label>
                            <input
                                type="number"
                                value={urv}
                                onChange={(e) => setUrv(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500 transition-colors font-mono"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">Unidad</label>
                            <input
                                type="text"
                                value={unit}
                                onChange={(e) => setUnit(e.target.value)}
                                placeholder="PSI, °C..."
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500 transition-colors"
                            />
                        </div>
                    </div>
                    <div className="mt-2 text-center text-xs text-slate-500">
                        Alcance (Span): <span className="text-purple-400 font-bold">{parseFloat(urv) - parseFloat(lrv)}</span>
                    </div>
                </div>

                <div className="border-t border-white/5 my-6" />

                {/* Section: Real Time Conversion */}
                <div className="mb-8">
                    <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-4">Conversión en Tiempo Real</h3>
                    <div className="flex flex-col md:flex-row items-end gap-4">
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-slate-400 mb-1">Señal (mA)</label>
                            <input
                                type="number"
                                disabled={mode === 'pv_to_ma'}
                                value={mode === 'ma_to_pv' ? inputValue : (result !== null ? result.toFixed(2) : '')}
                                onChange={(e) => setInputValue(e.target.value)}
                                className={`w-full bg-slate-950 border ${mode === 'ma_to_pv' ? 'border-green-500/50' : 'border-slate-800'} rounded-lg px-4 py-3 text-white focus:outline-none font-mono text-lg`}
                                onClick={() => setMode('ma_to_pv')}
                            />
                        </div>

                        <div className="pb-4 text-purple-500">
                            <ArrowRightLeft size={24} />
                        </div>

                        <div className="flex-1">
                            <label className="block text-xs font-medium text-slate-400 mb-1">Variable Física (PV)</label>
                            <input
                                type="number"
                                disabled={mode === 'ma_to_pv'}
                                value={mode === 'pv_to_ma' ? inputValue : (result !== null ? result.toFixed(2) : '')}
                                onChange={(e) => setInputValue(e.target.value)}
                                className={`w-full bg-slate-950 border ${mode === 'pv_to_ma' ? 'border-green-500/50' : 'border-slate-800'} rounded-lg px-4 py-3 text-white focus:outline-none font-mono text-lg`}
                                onClick={() => setMode('pv_to_ma')}
                            />
                        </div>
                    </div>

                    {/* Visual Scale */}
                    <div className="mt-6 relative pt-4 px-2">
                        <div className="h-2 bg-slate-800 rounded-full w-full relative overflow-hidden">
                            <div
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-600 to-cyan-400 rounded-full transition-all duration-500"
                                style={{
                                    width: `${Math.min(Math.max(((mode === 'ma_to_pv' ? parseFloat(inputValue) : result) - 4) / 16 * 100, 0), 100)}%`
                                }}
                            />
                        </div>
                        <div className="text-center mt-2 text-xs font-bold text-white">
                            {Math.min(Math.max(((mode === 'ma_to_pv' ? parseFloat(inputValue) : result) - 4) / 16 * 100, 0), 100).toFixed(1)}%
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 my-6" />

                {/* Section: Calibration Checkpoints */}
                <div className="mb-8">
                    <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-4">Puntos de Calibración (Check Points)</h3>
                    <div className="bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
                        <table className="w-full text-sm">
                            <tbody className="divide-y divide-slate-800">
                                {checkpoints.map((pt, idx) => (
                                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                                        <td className="p-3 text-purple-400 font-bold text-right w-1/4">● {pt.percent}%</td>
                                        <td className="p-3 text-slate-500 text-center">→</td>
                                        <td className="p-3 text-white font-mono text-center">{pt.pv.toFixed(2)}</td>
                                        <td className="p-3 text-slate-500 text-center">→</td>
                                        <td className="p-3 text-cyan-400 font-mono text-left w-1/4">{pt.ma.toFixed(2)} mA</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Save Section */}
                <div className="flex gap-4 items-end bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                    <div className="flex-1">
                        <label className="block text-xs font-medium text-slate-500 mb-1">Etiqueta (Ej: PT-101)</label>
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

export default Transmitter;
