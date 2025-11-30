import React, { useState, useEffect } from 'react';
import { Gauge, ArrowRightLeft, Info, Settings } from 'lucide-react';
import { supabase } from '../supabase';
import BackButton from '../components/BackButton';
import { useAuth } from '../contexts/Auth';
import { useSync } from '../contexts/SyncContext';
import useLocalStorage from '../hooks/useLocalStorage';
import ToolHeader from '../components/ToolHeader';
import SaveCalculationSection from '../components/SaveCalculationSection';
import AdBanner from '../components/AdBanner';
import TransmitterVisual from '../components/TransmitterVisual';
import RecentHistory from '../components/RecentHistory';
import SaveModal from '../components/SaveModal';
import EducationalSection from '../components/EducationalSection';

const Transmitter = () => {
    const { user } = useAuth();
    // Calibration State
    const [rangeLow, setRangeLow] = useLocalStorage('trans_low', '0', user?.id);
    const [rangeHigh, setRangeHigh] = useLocalStorage('trans_high', '100', user?.id);
    const [unit, setUnit] = useLocalStorage('trans_unit', 'PSI', user?.id);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Real-Time State
    const [inputMa, setInputMa] = useState('');
    const [inputPv, setInputPv] = useState('');

    const [label, setLabel] = useState('');
    const [description, setDescription] = useState('');
    const [saving, setSaving] = useState(false);
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rangeLow, rangeHigh]);

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
        setIsSessionActive(false);
    };

    const { isOnline, addToQueue } = useSync();

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
            const payload = {
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
            };

            if (!isOnline) {
                addToQueue({
                    type: 'INSERT',
                    table: 'history',
                    payload: payload
                });
                alert('Sin conexión. Guardado en cola para sincronizar cuando recuperes internet.');
                setIsSessionActive(true);
                setSaving(false);
                return;
            }

            const { error } = await supabase.from('history').insert([payload]);
            if (error) throw error;
            alert('Cálculo guardado correctamente.');
            setIsSessionActive(true);
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

    return (
        <div className="max-w-5xl mx-auto p-6">
            <BackButton />
            <ToolHeader
                title="Transmisor 4-20mA"
                subtitle="Conversión Bidireccional de Señal Analógica"
                icon={Gauge}
                iconColorClass="text-purple-400"
                iconBgClass="bg-purple-500/20"
                onReset={clearAll}
                onSave={() => setIsSaveModalOpen(true)}
            />

            <div className="bg-slate-900/50 p-8 rounded-2xl border border-white/5 backdrop-blur-sm shadow-xl relative">
                {/* 1. Calibration Section */}
                <div className="mb-8">
                    <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-4 border-b border-cyan-500/30 pb-2">
                        Calibración del Instrumento
                    </h3>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="block text-xs text-slate-500 mb-1 h-8 flex items-end pb-1">Valor a 4mA (Mínimo)</label>
                            <input
                                type="number"
                                value={rangeLow}
                                onChange={(e) => setRangeLow(e.target.value)}
                                className="w-full h-[42px] bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-cyan-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 mb-1 h-8 flex items-end pb-1">Valor a 20mA (Máximo)</label>
                            <input
                                type="number"
                                value={rangeHigh}
                                onChange={(e) => setRangeHigh(e.target.value)}
                                className="w-full h-[42px] bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-cyan-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 mb-1 h-8 flex items-end pb-1">Unidad</label>
                            <select
                                value={unit}
                                onChange={(e) => setUnit(e.target.value)}
                                className="w-full h-[42px] bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-cyan-500 outline-none appearance-none"
                            >
                                <optgroup label="Presión">
                                    <option value="PSI">PSI</option>
                                    <option value="Bar">Bar</option>
                                    <option value="kPa">kPa</option>
                                    <option value="MPa">MPa</option>
                                    <option value="inH2O">inH2O</option>
                                    <option value="mmHg">mmHg</option>
                                    <option value="atm">atm</option>
                                </optgroup>
                                <optgroup label="Temperatura">
                                    <option value="°C">°C</option>
                                    <option value="°F">°F</option>
                                    <option value="K">K</option>
                                </optgroup>
                                <optgroup label="Nivel / Distancia">
                                    <option value="%">%</option>
                                    <option value="m">Metros (m)</option>
                                    <option value="cm">Centímetros (cm)</option>
                                    <option value="mm">Milímetros (mm)</option>
                                    <option value="ft">Pies (ft)</option>
                                    <option value="in">Pulgadas (in)</option>
                                </optgroup>
                                <optgroup label="Flujo">
                                    <option value="GPM">GPM</option>
                                    <option value="L/min">L/min</option>
                                    <option value="m³/h">m³/h</option>
                                    <option value="CFM">CFM</option>
                                </optgroup>
                                <optgroup label="Peso">
                                    <option value="kg">kg</option>
                                    <option value="lb">lb</option>
                                    <option value="g">g</option>
                                </optgroup>
                                <optgroup label="Eléctrico">
                                    <option value="V">Voltios (V)</option>
                                    <option value="mV">Milivoltios (mV)</option>
                                    <option value="A">Amperios (A)</option>
                                    <option value="mA">Miliamperios (mA)</option>
                                    <option value="Hz">Hertz (Hz)</option>
                                </optgroup>
                                <optgroup label="Otros">
                                    <option value="RPM">RPM</option>
                                    <option value="pH">pH</option>
                                    <option value="% HR">% Humedad</option>
                                </optgroup>
                            </select>
                        </div>
                    </div>
                    <div className="text-center text-xs text-slate-400">
                        Alcance (Span): <span className="text-purple-400 font-bold">{span.toFixed(2)}</span>
                    </div>
                </div>

                {/* 2. Real Time Conversion & Visual */}
                <div className="mb-8">
                    <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-4 border-b border-cyan-500/30 pb-2">
                        Conversión en Tiempo Real
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        {/* Left: Visual Representation */}
                        <div className="order-2 md:order-1 bg-slate-950/30 rounded-xl p-4 border border-white/5">
                            <TransmitterVisual
                                pv={inputPv}
                                unit={unit}
                                ma={inputMa}
                                percent={getPercentage()}
                            />
                        </div>

                        {/* Right: Inputs */}
                        <div className="order-1 md:order-2">
                            <div className="flex flex-col gap-6">
                                <div>
                                    <label className="block text-xs text-slate-500 mb-1">Señal de Salida (mA)</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={inputMa}
                                            onChange={(e) => handleMaChange(e.target.value)}
                                            className="w-full h-[50px] bg-slate-950 border border-slate-700 rounded-lg pl-4 pr-12 py-3 text-white font-mono text-lg outline-none focus:border-cyan-500 focus:shadow-[0_0_10px_rgba(34,211,238,0.2)] transition-all"
                                            placeholder="4.00"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-500 font-bold text-sm pointer-events-none">mA</div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-center text-slate-600">
                                    <ArrowRightLeft size={24} className="rotate-90 md:rotate-0" />
                                </div>

                                <div>
                                    <label className="block text-xs text-slate-500 mb-1">Variable de Proceso (PV)</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={inputPv}
                                            onChange={(e) => handlePvChange(e.target.value)}
                                            className="w-full h-[50px] bg-slate-950 border border-slate-700 rounded-lg pl-4 pr-12 py-3 text-white font-mono text-lg outline-none focus:border-cyan-500 focus:shadow-[0_0_10px_rgba(34,211,238,0.2)] transition-all"
                                            placeholder="0.00"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-500 font-bold text-sm pointer-events-none">PV</div>
                                    </div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-6 relative h-4 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                                <div
                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-900 to-cyan-500 transition-all duration-300"
                                    style={{ width: `${getPercentage()}%` }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow-md">
                                    {getPercentage().toFixed(1)}%
                                </div>
                            </div>
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

            </div>

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

            {/* 3. Checkpoints Table */}
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



            <RecentHistory
                toolName="Transmisor 4-20mA"
                onLoadData={(item) => {
                    if (confirm(`¿Cargar datos de ${item.label}?`)) {
                        setRangeLow(item.data.range_low || '0');
                        setRangeHigh(item.data.range_high || '100');
                        setUnit(item.data.unit || 'PSI');
                        setInputMa(item.data.input_ma || '');
                        setInputPv(item.data.input_pv || '');
                        setLabel(item.label || '');
                        setDescription(item.description || '');
                        setIsSessionActive(true);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                }}
                refreshTrigger={saving}
            />

            <div className="mt-8 mb-8 p-4 bg-slate-800/80 border border-white/10 rounded-xl flex items-start gap-3 backdrop-blur-md">
                <div className="text-cyan-400 shrink-0 mt-0.5">
                    <Info size={20} />
                </div>
                <div className="text-sm text-slate-200 space-y-2">
                    <p className="font-bold text-lg mb-2">¿Qué es esto?</p>
                    <p>
                        Esta herramienta convierte señales de instrumentación industrial (4-20 mA) a variables de proceso (PV) y viceversa.
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-slate-400">
                        <li><strong>4-20 mA:</strong> Estándar de transmisión de señal analógica. 4mA es el 0% y 20mA es el 100%.</li>
                        <li><strong>PV (Process Variable):</strong> El valor real medido (ej: 0-100 PSI, -50 a 150 °C).</li>
                        <li><strong>Rango Invertido:</strong> Soportado. Útil para válvulas "Falla Abierta" o niveles inversos.</li>
                    </ul>
                </div>
            </div>

            {/* AdSense Banner (Moved to very bottom) */}
            <AdBanner dataAdSlot="1234567890" />

            <EducationalSection title="Teoría: Lazos de Corriente 4-20 mA">
                <h4 className="text-white font-bold mb-2">¿Por qué usamos 4-20 mA?</h4>
                <p className="mb-4 text-sm">
                    El estándar de 4-20 mA es el más utilizado en la industria para transmitir señales analógicas.
                    A diferencia de las señales de voltaje (0-10V), la corriente no se atenúa con la distancia (resistencia del cable),
                    lo que permite transmisiones largas sin pérdida de precisión.
                </p>

                <h4 className="text-white font-bold mb-2">El "Cero Vivo" (Live Zero)</h4>
                <p className="mb-4 text-sm">
                    El rango comienza en 4 mA (0%) y no en 0 mA. Esto permite detectar fallas:
                </p>
                <ul className="list-disc list-inside mb-4 text-sm space-y-1">
                    <li><strong className="text-red-400">0 mA:</strong> Indica cable cortado o falla de energía.</li>
                    <li><strong className="text-green-400">4 mA:</strong> Indica que el proceso está en 0% pero el sensor funciona.</li>
                </ul>

                <h4 className="text-white font-bold mb-2">Fórmula de Conversión</h4>
                <p className="mb-2 text-sm">
                    La relación es lineal y se calcula con la ecuación de la recta:
                </p>
                <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-700 font-mono text-xs mb-4">
                    mA = 4 + [(PV - LRV) / (URV - LRV)] × 16
                </div>
                <p className="text-xs text-slate-400">
                    Donde: PV = Variable de Proceso, LRV = Valor Rango Bajo (4mA), URV = Valor Rango Alto (20mA).
                </p>
            </EducationalSection>

            <SaveModal
                isOpen={isSaveModalOpen}
                onClose={() => setIsSaveModalOpen(false)}
                label={label}
                setLabel={setLabel}
                description={description}
                setDescription={setDescription}
                onSave={handleSave}
                onClear={clearAll}
                saving={saving}
                isSessionActive={isSessionActive}
            />

        </div>

    );
};

export default Transmitter;
