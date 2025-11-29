import React, { useState, useEffect } from 'react';
import { Thermometer, Info, Zap, Layers } from 'lucide-react';
import ToolHeader from '../components/ToolHeader';
import BackButton from '../components/BackButton';
import AdBanner from '../components/AdBanner';
import useLocalStorage from '../hooks/useLocalStorage';
import { useAuth } from '../contexts/Auth';
import SensorVisual from '../components/SensorVisual';

const sensorData = {
    rtd: {
        name: 'RTD (Detector de Temperatura Resistivo)',
        types: {
            pt100: {
                name: 'Pt100',
                desc: 'Platino 100Ω a 0°C',
                note: 'El estándar industrial más común. Excelente precisión y estabilidad.',
                composition: 'Platino Puro (99.99%)',
                alpha: '0.00385 (IEC 60751)',
                range: '-200°C a 850°C',
                color: 'Blanco / Rojo (IEC)',
                calc: (t) => {
                    const R0 = 100;
                    const A = 3.9083e-3;
                    const B = -5.775e-7;
                    if (t >= 0) return R0 * (1 + A * t + B * t * t);
                    const C = -4.183e-12;
                    return R0 * (1 + A * t + B * t * t + C * (t - 100) * t * t * t);
                }
            },
            pt1000: {
                name: 'Pt1000',
                desc: 'Platino 1000Ω a 0°C',
                note: 'Mayor resistencia reduce el error por cables y el autocalentamiento. Ideal para equipos a batería.',
                composition: 'Platino Puro (99.99%)',
                alpha: '0.00385 (IEC 60751)',
                range: '-200°C a 850°C',
                color: 'Blanco / Rojo (IEC)',
                calc: (t) => {
                    const R0 = 1000;
                    const A = 3.9083e-3;
                    const B = -5.775e-7;
                    if (t >= 0) return R0 * (1 + A * t + B * t * t);
                    const C = -4.183e-12;
                    return R0 * (1 + A * t + B * t * t + C * (t - 100) * t * t * t);
                }
            },
            ni120: {
                name: 'Ni120',
                desc: 'Níquel 120Ω a 0°C',
                note: 'Alta sensibilidad pero rango limitado. Común en HVAC y sistemas antiguos.',
                composition: 'Níquel Puro',
                alpha: '0.00672 (DIN 43760)',
                range: '-80°C a 260°C',
                color: 'Rojo / Rojo / Blanco (DIN)',
                calc: (t) => {
                    // Simplified polynomial for Ni120
                    const R0 = 120;
                    const A = 5.485e-3;
                    const B = 6.65e-6;
                    return R0 * (1 + A * t + B * t * t);
                }
            },
            cu10: {
                name: 'Cu10',
                desc: 'Cobre 10Ω a 25°C',
                note: 'Muy lineal. Se usa principalmente para medir temperatura en bobinados de motores.',
                composition: 'Cobre Electrolítico',
                alpha: '0.00427',
                range: '-200°C a 260°C',
                color: 'Blanco / Rojo',
                calc: (t) => {
                    // Linear approx for Cu10 (R25 = 10)
                    // R(t) = R25 * (1 + alpha * (t - 25))
                    return 10 * (1 + 0.00427 * (t - 25));
                }
            }
        }
    },
    tc: {
        name: 'Termocupla (Termopar)',
        types: {
            k: {
                name: 'Tipo K',
                desc: 'Uso general, bajo costo',
                note: 'La más popular. Buen rango y resistencia a la oxidación. No usar en atmósferas sulfurosas.',
                connectorColor: '#fbbf24', // Yellow
                composition: {
                    pos: { name: 'Cromel (Chromel)', detail: '90% Níquel, 10% Cromo', color: 'Amarillo (ANSI)', hex: '#fbbf24' },
                    neg: { name: 'Alumel', detail: '95% Níquel, 2% Manganeso...', color: 'Rojo (ANSI)', hex: '#ef4444' }
                },
                range: '-270°C a 1260°C',
                sensitivity: '~41 µV/°C',
                calc: (t) => t * 0.041
            },
            j: {
                name: 'Tipo J',
                desc: 'Atmósferas reductoras',
                note: 'Mayor sensibilidad que la K. El hierro se oxida rápido, no recomendada para humedad.',
                connectorColor: '#000000', // Black
                composition: {
                    pos: { name: 'Hierro (Iron)', detail: '100% Fe (Magnético)', color: 'Blanco (ANSI)', hex: '#ffffff' },
                    neg: { name: 'Constantán', detail: '55% Cobre, 45% Níquel', color: 'Rojo (ANSI)', hex: '#ef4444' }
                },
                range: '-40°C a 750°C',
                sensitivity: '~50 µV/°C',
                calc: (t) => t * 0.050
            },
            t: {
                name: 'Tipo T',
                desc: 'Bajas temperaturas / Criogenia',
                note: 'Excelente estabilidad en frío extremo. Resistente a la humedad.',
                connectorColor: '#3b82f6', // Blue
                composition: {
                    pos: { name: 'Cobre (Copper)', detail: '100% Cu', color: 'Azul (ANSI)', hex: '#3b82f6' },
                    neg: { name: 'Constantán', detail: '55% Cobre, 45% Níquel', color: 'Rojo (ANSI)', hex: '#ef4444' }
                },
                range: '-270°C a 370°C',
                sensitivity: '~43 µV/°C',
                calc: (t) => t * 0.043
            },
            e: {
                name: 'Tipo E',
                desc: 'Alta sensibilidad',
                note: 'La mayor señal de salida (mV/°C). Ideal para detectar pequeños cambios de temperatura.',
                connectorColor: '#a855f7', // Purple
                composition: {
                    pos: { name: 'Cromel (Chromel)', detail: '90% Níquel, 10% Cromo', color: 'Púrpura (ANSI)', hex: '#a855f7' },
                    neg: { name: 'Constantán', detail: '55% Cobre, 45% Níquel', color: 'Rojo (ANSI)', hex: '#ef4444' }
                },
                range: '-270°C a 870°C',
                sensitivity: '~68 µV/°C',
                calc: (t) => t * 0.068
            }
        }
    }
};

const TemperatureSensors = () => {
    const { user } = useAuth();
    const [category, setCategory] = useLocalStorage('temp_cat', 'tc', user?.id);
    const [type, setType] = useLocalStorage('temp_type', 'k', user?.id);
    const [wires, setWires] = useLocalStorage('temp_wires', '3', user?.id); // Default 3 wires for RTD
    const [housing, setHousing] = useLocalStorage('temp_housing', 'connector', user?.id); // 'connector' or 'head'
    const [inputOutput, setInputOutput] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Safety check for category
    const safeCategory = sensorData[category] ? category : 'tc';
    // Safety check for type
    const safeType = (sensorData[safeCategory].types && sensorData[safeCategory].types[type])
        ? type
        : Object.keys(sensorData[safeCategory].types)[0];

    // Update state if mismatch found (to fix local storage)
    useEffect(() => {
        if (category !== safeCategory) setCategory(safeCategory);
        if (type !== safeType) setType(safeType);
    }, [category, safeCategory, type, safeType, setCategory, setType]);

    // Helper: Solve Temperature from Output (Binary Search for RTD, Linear for TC)
    const solveTemp = (outVal) => {
        const sensor = sensorData[safeCategory]?.types[safeType];
        if (!sensor || !sensor.calc) return '';

        if (safeCategory === 'tc') {
            // Linear approximation inverse: T = V / Sensitivity
            // Sensitivity is roughly constant in this simplified model
            // We need to extract the factor from the calc function or use the sensitivity value
            // Since calc is t => t * factor, factor = calc(1)
            const factor = sensor.calc(1);
            return (outVal / factor);
        } else {
            // RTD: Binary Search
            // Range: -200 to 850
            let low = -200;
            let high = 850;
            let mid = 0;
            let calcR = 0;

            // Optimization: Check bounds first
            if (outVal < sensor.calc(low)) return low;
            if (outVal > sensor.calc(high)) return high;

            for (let i = 0; i < 20; i++) { // 20 iterations is enough for high precision
                mid = (low + high) / 2;
                calcR = sensor.calc(mid);
                if (Math.abs(calcR - outVal) < 0.001) return mid;
                if (calcR < outVal) low = mid;
                else high = mid;
            }
            return mid;
        }
    };

    // Handle Input Temp Change
    const handleTempChange = (val) => {
        setInputTemp(val);
        if (val === '' || isNaN(parseFloat(val))) {
            setInputOutput('');
            return;
        }

        let t = parseFloat(val);
        // Convert F to C for calculation
        if (tempUnit === 'F') {
            t = (t - 32) * 5 / 9;
        }

        const sensor = sensorData[safeCategory]?.types[safeType];
        if (sensor && sensor.calc) {
            setInputOutput(sensor.calc(t).toFixed(3));
        }
    };

    // Handle Input Output Change
    const handleOutputChange = (val) => {
        setInputOutput(val);
        if (val === '' || isNaN(parseFloat(val))) {
            setInputTemp('');
            return;
        }

        const out = parseFloat(val);
        let t = solveTemp(out);

        // Convert C to F for display if needed
        if (tempUnit === 'F') {
            t = (t * 9 / 5) + 32;
        }

        setInputTemp(t.toFixed(2));
    };

    // Recalculate when type/category/unit changes (keeping Temp as master)
    useEffect(() => {
        if (inputTemp !== '') {
            handleTempChange(inputTemp);
        } else {
            setInputOutput('');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category, type, tempUnit]);

    const currentSensor = sensorData[safeCategory].types[safeType];

    // Prepare colors for visual
    const visualColors = safeCategory === 'tc' ? {
        pos: currentSensor.composition.pos.hex,
        neg: currentSensor.composition.neg.hex,
        connector: currentSensor.connectorColor
    } : {};

    return (
        <div className="max-w-4xl mx-auto p-6 pb-20">
            <BackButton />
            <ToolHeader
                title="Sensores de Temperatura"
                subtitle="RTDs, Termocuplas y Aleaciones"
                icon={Thermometer}
                iconColorClass="text-red-400"
                iconBgClass="bg-red-500/20"
            />

            {/* Category Selector */}
            <div className="flex gap-4 mb-8">
                {Object.entries(sensorData).map(([key, data]) => (
                    <button
                        key={key}
                        onClick={() => setCategory(key)}
                        className={`flex-1 p-4 rounded-xl border transition-all font-bold text-lg ${safeCategory === key
                            ? 'bg-red-500/20 border-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                            : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-800'
                            }`}
                    >
                        {data.name}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Selectors & Visual */}
                <div className="lg:col-span-1 space-y-6 flex flex-col">
                    {/* Type Selector (Top) */}
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 backdrop-blur-sm order-1">
                        <label className="block text-xs text-slate-500 mb-2 uppercase tracking-wider font-bold">Tipo de Sensor</label>
                        <div className="grid grid-cols-2 gap-2">
                            {Object.entries(sensorData[safeCategory].types).map(([key, data]) => (
                                <button
                                    key={key}
                                    onClick={() => setType(key)}
                                    className={`p-2 rounded-lg text-sm font-bold transition-colors ${safeType === key
                                        ? 'bg-red-500 text-white'
                                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                        }`}
                                >
                                    {data.name}
                                </button>
                            ))}
                        </div>

                        {/* Wire Selector for RTD */}
                        {safeCategory === 'rtd' && (
                            <div className="mt-4 pt-4 border-t border-white/5">
                                <label className="block text-xs text-slate-500 mb-2 uppercase tracking-wider font-bold">Configuración de Hilos</label>
                                <div className="flex gap-2">
                                    {[2, 3, 4].map((w) => (
                                        <button
                                            key={w}
                                            onClick={() => setWires(w.toString())}
                                            className={`flex-1 p-2 rounded-lg text-sm font-bold transition-colors ${wires === w.toString()
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                                }`}
                                        >
                                            {w} Hilos
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Housing Selector for TC */}
                        {safeCategory === 'tc' && (
                            <div className="mt-4 pt-4 border-t border-white/5">
                                <label className="block text-xs text-slate-500 mb-2 uppercase tracking-wider font-bold">Tipo de Conexión</label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setHousing('connector')}
                                        className={`flex-1 p-2 rounded-lg text-sm font-bold transition-colors ${housing === 'connector'
                                            ? 'bg-yellow-600 text-white'
                                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                            }`}
                                    >
                                        Conector
                                    </button>
                                    <button
                                        onClick={() => setHousing('head')}
                                        className={`flex-1 p-2 rounded-lg text-sm font-bold transition-colors ${housing === 'head'
                                            ? 'bg-slate-500 text-white'
                                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                            }`}
                                    >
                                        Cabezal Ind.
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Visual Representation (Bottom) */}
                    <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5 backdrop-blur-sm flex justify-center order-2">
                        <SensorVisual
                            type={safeType}
                            category={safeCategory}
                            colors={visualColors}
                            wires={safeCategory === 'rtd' ? parseInt(wires) : 2}
                            housing={housing}
                        />
                    </div>
                </div>

                {/* Right Column: Simulator & Info */}
                <div className="lg:col-span-2 space-y-6 flex flex-col">
                    {/* Simulator (Top Right) */}
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 backdrop-blur-sm shadow-lg relative group order-1">
                        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                        <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-4 border-b border-red-500/30 pb-2 flex items-center gap-2 relative z-10">
                            <Zap size={16} />
                            Simulador de Salida
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-xs text-slate-500">Temperatura de Entrada</label>
                                    <div className="flex bg-slate-800 rounded-lg p-0.5">
                                        <button
                                            onClick={() => setTempUnit('C')}
                                            className={`px-2 py-0.5 text-[10px] font-bold rounded ${tempUnit === 'C' ? 'bg-red-500 text-white' : 'text-slate-400 hover:text-white'}`}
                                        >
                                            °C
                                        </button>
                                        <button
                                            onClick={() => setTempUnit('F')}
                                            className={`px-2 py-0.5 text-[10px] font-bold rounded ${tempUnit === 'F' ? 'bg-red-500 text-white' : 'text-slate-400 hover:text-white'}`}
                                        >
                                            °F
                                        </button>
                                    </div>
                                </div>
                                <input
                                    type="number"
                                    value={inputTemp}
                                    onChange={(e) => handleTempChange(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white font-mono text-lg outline-none focus:border-red-500 transition-all shadow-inner"
                                    placeholder={`Ej: ${tempUnit === 'C' ? '100' : '212'}`}
                                />
                            </div>

                            <div>
                                <label className="block text-xs text-slate-500 mb-1">
                                    Salida Esperada ({safeCategory === 'rtd' ? 'Resistencia' : 'Voltaje'})
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={inputOutput}
                                        onChange={(e) => handleOutputChange(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-red-400 font-mono text-xl font-bold outline-none focus:border-red-500 transition-all shadow-inner"
                                        placeholder="-"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-600 font-normal pointer-events-none">
                                        {safeCategory === 'rtd' ? 'Ω' : 'mV'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Info Card (Below Simulator) */}
                    <div className="bg-slate-900/80 p-8 rounded-2xl border border-white/10 backdrop-blur-md shadow-2xl relative overflow-hidden order-2">
                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 p-32 bg-red-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                        <div className="relative z-10">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h2 className="text-3xl font-bold text-white">{currentSensor.name}</h2>
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-slate-400 border border-white/5">
                                            {safeCategory === 'tc' ? 'ANSI MC96.1' : 'IEC 60751'}
                                        </span>
                                    </div>
                                    <p className="text-red-400 text-lg">{currentSensor.desc}</p>
                                </div>
                                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                                    <Layers className="text-slate-400" size={32} />
                                </div>
                            </div>

                            {/* Composition Details */}
                            <div className="space-y-6">
                                {safeCategory === 'tc' ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-slate-950/50 p-4 rounded-xl border-l-4 border-red-500">
                                            <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Pata Positiva (+)</h4>
                                            <div className="text-white font-bold text-lg mb-1">{currentSensor.composition.pos.name}</div>
                                            <div className="text-sm text-slate-400 mb-2">{currentSensor.composition.pos.detail}</div>
                                            <div className="text-xs font-mono bg-slate-900 py-1 px-2 rounded inline-block text-slate-300">
                                                Color: {currentSensor.composition.pos.color}
                                            </div>
                                        </div>
                                        <div className="bg-slate-950/50 p-4 rounded-xl border-l-4 border-blue-500">
                                            <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Pata Negativa (-)</h4>
                                            <div className="text-white font-bold text-lg mb-1">{currentSensor.composition.neg.name}</div>
                                            <div className="text-sm text-slate-400 mb-2">{currentSensor.composition.neg.detail}</div>
                                            <div className="text-xs font-mono bg-slate-900 py-1 px-2 rounded inline-block text-slate-300">
                                                Color: {currentSensor.composition.neg.color}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-slate-950/50 p-6 rounded-xl border border-white/5">
                                        <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Material del Elemento</h4>
                                        <div className="text-white font-bold text-xl mb-2">{currentSensor.composition}</div>
                                        <p className="text-slate-400 text-sm">
                                            El platino es ideal por su estabilidad química y linealidad. El coeficiente de temperatura (Alpha) estándar es {currentSensor.alpha}.
                                        </p>
                                    </div>
                                )}

                                {/* Specs Grid */}
                                <div className="grid grid-cols-2 gap-4 mt-6">
                                    <div className="p-4 bg-white/5 rounded-xl">
                                        <div className="text-xs text-slate-500 mb-1">Rango de Temperatura</div>
                                        <div className="text-white font-mono font-bold">{currentSensor.range}</div>
                                    </div>
                                    {currentSensor.sensitivity && (
                                        <div className="p-4 bg-white/5 rounded-xl">
                                            <div className="text-xs text-slate-500 mb-1">Sensibilidad (Seebeck)</div>
                                            <div className="text-white font-mono font-bold">{currentSensor.sensitivity}</div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Educational Note / Dynamic Info (Merged) */}
                            <div className="mt-6 pt-6 border-t border-white/10">
                                <div className="flex gap-4 items-start bg-blue-500/10 p-4 rounded-xl border border-blue-500/20">
                                    <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400 shrink-0">
                                        <Info size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-blue-400 font-bold mb-2 text-xs uppercase tracking-wider">
                                            Información Adicional
                                        </h4>

                                        <div className="space-y-3">
                                            {/* Type Specific Note */}
                                            <p className="text-slate-300 text-xs leading-relaxed italic border-l-2 border-blue-500/30 pl-3">
                                                "{currentSensor.note}"
                                            </p>

                                            {/* Context Specific Info */}
                                            {safeCategory === 'tc' ? (
                                                <div className="space-y-2">
                                                    <p className="text-slate-400 text-[10px] leading-relaxed">
                                                        {housing === 'connector'
                                                            ? 'Mostrando conector estándar polarizado.'
                                                            : 'Mostrando cabezal de conexión industrial.'
                                                        }
                                                    </p>
                                                    <div className="pt-2 border-t border-blue-500/20 text-[10px] text-slate-400">
                                                        <span className="text-red-400 font-bold">¡OJO!</span> En norma ANSI, el cable <strong className="text-red-400">ROJO es NEGATIVO (-)</strong>.
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    {wires === '2' && (
                                                        <p className="text-slate-400 text-[10px] leading-relaxed">
                                                            <strong>2 Hilos:</strong> Baja precisión. La resistencia del cable se suma al error.
                                                        </p>
                                                    )}
                                                    {wires === '3' && (
                                                        <p className="text-slate-400 text-[10px] leading-relaxed">
                                                            <strong>3 Hilos:</strong> Estándar industrial. Compensa la resistencia del cable.
                                                        </p>
                                                    )}
                                                    {wires === '4' && (
                                                        <p className="text-slate-400 text-[10px] leading-relaxed">
                                                            <strong>4 Hilos:</strong> Máxima precisión (Laboratorio). Elimina error de cables.
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AdBanner dataAdSlot="1234567890" />
        </div>
    );
};

export default TemperatureSensors;
