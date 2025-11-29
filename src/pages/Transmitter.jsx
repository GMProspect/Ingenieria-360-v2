import React, { useState, useEffect } from 'react';
import { Gauge, ArrowRightLeft, Info } from 'lucide-react';
import { supabase } from '../supabase';
import BackButton from '../components/BackButton';
import { useAuth } from '../contexts/Auth';
import useLocalStorage from '../hooks/useLocalStorage';
import ToolHeader from '../components/ToolHeader';
import SaveCalculationSection from '../components/SaveCalculationSection';
import AdBanner from '../components/AdBanner';

const Transmitter = () => {
    const { user } = useAuth();
    // Calibration State
    const [rangeLow, setRangeLow] = useLocalStorage('trans_low', '0', user?.id);
    const [rangeHigh, setRangeHigh] = useLocalStorage('trans_high', '100', user?.id);
    const [unit, setUnit] = useLocalStorage('trans_unit', 'PSI', user?.id);

    // Real-Time State
    const [inputMa, setInputMa] = useState('');
    const [inputPv, setInputPv] = useState('');

    const [label, setLabel] = useState('');
    const [description, setDescription] = useState('');
    const [saving, setSaving] = useState(false);

    // Derived Values
    const span = (parseFloat(rangeHigh) - parseFloat(rangeLow)) || 0;

    // Smart Logic: Bidirectional Calculation
    const handleMaChange = (val) => {
        setInputMa(val);
        if (val === '') {
            setInputPv('');
            return;
        }
        const ma = parseFloat(val);
        const low = parseFloat(rangeLow);
        const high = parseFloat(rangeHigh);

        if (!isNaN(ma) && !isNaN(low) && !isNaN(high)) {
            // Formula: PV = Low + ((mA - 4) / 16) * Span
            const pv = low + ((ma - 4) / 16) * (high - low);
            setInputPv(pv.toFixed(2));
        }
    };

    const handlePvChange = (val) => {
        setInputPv(val);
        if (val === '') {
            setInputMa('');
            return;
        }
        const pv = parseFloat(val);
        const low = parseFloat(rangeLow);
        const high = parseFloat(rangeHigh);

        if (!isNaN(pv) && !isNaN(low) && !isNaN(high)) {
            // Formula: mA = 4 + ((PV - Low) / Span) * 16
            const ma = 4 + ((pv - low) / (high - low)) * 16;
            setInputMa(ma.toFixed(2));
        }
    };

    // Auto-recalculate when range changes (if inputMa has value)
    useEffect(() => {
        if (inputMa !== '') {
            const ma = parseFloat(inputMa);
            const low = parseFloat(rangeLow);
            const high = parseFloat(rangeHigh);

            if (!isNaN(ma) && !isNaN(low) && !isNaN(high)) {
                const pv = low + ((ma - 4) / 16) * (high - low);
                setInputPv(pv.toFixed(2));
            }
        }
    }, [rangeLow, rangeHigh, inputMa]);

    const getPercentage = () => {
        const ma = parseFloat(inputMa);
        if (isNaN(ma)) return 0;
        const percent = ((ma - 4) / 16) * 100;
        return Math.min(Math.max(percent, 0), 100);
    };

    // Validation: Check for inverted range
    const isRangeInverted = () => {
        const low = parseFloat(rangeLow);
        const high = parseFloat(rangeHigh);
        return !isNaN(low) && !isNaN(high) && low >= high;
    };

    // Validation: Check mA diagnostic status
    const getMaDiagnostic = () => {
        const ma = parseFloat(inputMa);
        if (isNaN(ma) || inputMa === '') return null;

        if (ma < 3.8) return { type: 'error', message: '⚠️ Error Crítico: Cortocircuito o falla de alimentación (< 3.8 mA)' };
        if (ma < 4) return { type: 'warning', message: '⚠️ Underrange: Sensor fuera de rango bajo (3.8 - 4.0 mA)' };
        if (ma > 23) return { type: 'error', message: '⚠️ Error Crítico: Cable abierto o saturación (> 23 mA)' };
        if (ma > 20) return { type: 'warning', message: '⚠️ Overrange: Sensor fuera de rango alto (20 - 23 mA)' };
        return { type: 'ok', message: '✅ Rango normal (4-20 mA)' };
    };

    const clearAll = () => {
        setInputMa('');
        setInputPv('');
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
                tool_name: 'Transmisor 4-20mA',
                label: label,
                description: description,
                user_id: user.id,
                data: {
                    range_low: rangeLow,
                    range_high: rangeHigh,
                    unit,
                    input_ma: inputMa,
                    input_pv: inputPv
                }
            }]);
            if (error) throw error;
            alert('Cálculo guardado correctamente.');
            setLabel('');
            setDescription('');
        } catch (error) {
            console.error('Error saving:', error);
            alert(`Error al guardar: ${JSON.stringify(error, null, 2)}`);
        } finally {
            setSaving(false);
        }
    };

    // Checkpoints Calculation
    const checkpoints = [0, 25, 50, 75, 100];
    const calculateCheckpoint = (percent) => {
        const low = parseFloat(rangeLow);
        const high = parseFloat(rangeHigh);
        if (isNaN(low) || isNaN(high)) return { pv: '-', ma: '-' };

        const ma = 4 + (percent / 100) * 16;
        const pv = low + (percent / 100) * (high - low);
        return { pv: pv.toFixed(2), ma: ma.toFixed(2) };
    };
    {/* 1. Calibration Section */ }
    <div className="mb-8">
        <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-4 border-b border-cyan-500/30 pb-2">
            Calibración del Instrumento
        </h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
                <label className="block text-xs text-slate-500 mb-1">Valor a 4mA (Mínimo)</label>
                <input
                    type="number"
                    value={rangeLow}
                    onChange={(e) => setRangeLow(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-cyan-500 outline-none"
                />
            </div>
            <div>
                <label className="block text-xs text-slate-500 mb-1">Valor a 20mA (Máximo)</label>
                <input
                    type="number"
                    value={rangeHigh}
                    onChange={(e) => setRangeHigh(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-cyan-500 outline-none"
                />
            </div>
            <div>
                <label className="block text-xs text-slate-500 mb-1">Unidad</label>
                <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="PSI, °C..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-cyan-500 outline-none"
                />
            </div>
        </div>
        <div className="text-center text-xs text-slate-400">
            Alcance (Span): <span className="text-purple-400 font-bold">{span.toFixed(2)}</span>
        </div>
    </div>

    {/* 2. Real Time Conversion */ }
    <div className="mb-8">
        <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-4 border-b border-cyan-500/30 pb-2">
            Conversión en Tiempo Real
        </h3>
        <div className="flex items-end gap-4 mb-4">
            <div className="flex-1">
                <label className="block text-xs text-slate-500 mb-1">Señal (mA)</label>
                <input
                    type="number"
                    value={inputMa}
                    onChange={(e) => handleMaChange(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white font-mono text-lg outline-none focus:border-cyan-500 focus:shadow-[0_0_10px_rgba(34,211,238,0.2)] transition-all"
                    placeholder="4.00"
                />
            </div>

            <div className="pb-4 text-slate-600">
                <ArrowRightLeft size={24} />
            </div>

            <div className="flex-1">
                <label className="block text-xs text-slate-500 mb-1">Variable Física (PV)</label>
                <input
                    type="number"
                    value={inputPv}
                    onChange={(e) => handlePvChange(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white font-mono text-lg outline-none focus:border-cyan-500 focus:shadow-[0_0_10px_rgba(34,211,238,0.2)] transition-all"
                    placeholder="0.00"
                />
            </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-4 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-900 to-cyan-500 transition-all duration-300"
                style={{ width: `${getPercentage()}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow-md">
                {getPercentage().toFixed(1)}%
            </div>
        </div>

        {/* Validation Warnings */}
        {isRangeInverted() && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg animate-pulse">
                <p className="text-red-400 text-sm font-semibold flex items-center gap-2">
                    ⚠️ <span>Rango Invertido: El mínimo ({rangeLow}) es mayor o igual al máximo ({rangeHigh})</span>
                </p>
            </div>
        )}

        {getMaDiagnostic() && getMaDiagnostic().type !== 'ok' && (
            <div className={`mt-4 p-3 rounded-lg border flex items-center gap-2 ${getMaDiagnostic().type === 'error'
                ? 'bg-red-500/10 border-red-500/30'
                : 'bg-yellow-500/10 border-yellow-500/30'
                }`}>
                <span className="text-lg">⚠️</span>
                <p className={`text-sm font-semibold ${getMaDiagnostic().type === 'error'
                    ? 'text-red-400'
                    : 'text-yellow-400'
                    }`}>
                    {getMaDiagnostic().message}
                </p>
            </div>
        )}
    </div>

    {/* 3. Checkpoints Table */ }
                <div className="mb-8">
                    <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-4 border-b border-cyan-500/30 pb-2">
                        Puntos de Calibración (Check Points)
                    </h3>
                    <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
                        <table className="w-full text-sm">
                            <tbody className="divide-y divide-slate-800">
                                {checkpoints.map((pct) => {
                                    const { pv, ma } = calculateCheckpoint(pct);
                                    return (
                                        <tr key={pct} className="hover:bg-slate-900/50 transition-colors">
                                            <td className="py-3 px-6 text-purple-400 font-bold text-center">● {pct}%</td>
                                            <td className="py-3 px-6 text-center text-white font-mono">{pv}</td>
                                            <td className="py-3 px-6 text-center text-cyan-400 font-mono">{ma} mA</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
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

    {/* AdSense Banner (Moved to very bottom) */ }
    <AdBanner dataAdSlot="1234567890" />

            </div >
        </div >
    );
};

export default Transmitter;
