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
    const [inputTemp, setInputTemp] = useState('');

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

    const outputVal = React.useMemo(() => {
        if (inputTemp === '' || isNaN(parseFloat(inputTemp))) {
            return '';
        }
        const t = parseFloat(inputTemp);
        const sensor = sensorData[safeCategory]?.types[safeType];
        if (sensor && sensor.calc) {
            return sensor.calc(t).toFixed(3);
        }
        return '';
    }, [inputTemp, safeCategory, safeType]);

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
                {/* Left Column: Controls & Calc */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Visual Representation */}
                    <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5 backdrop-blur-sm flex justify-center">
                        <SensorVisual
                            type={safeType}
                            category={safeCategory}
                            colors={visualColors}
                            wires={safeCategory === 'rtd' ? parseInt(wires) : 2}
                            housing={housing}
                        />
                    </div>

                    {/* Type Selector */}
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
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

                    {/* Calculator */}
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
                        <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-4 border-b border-red-500/30 pb-2">
                            Simulador de Salida
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs text-slate-500 mb-1">Temperatura (°C)</label>
                                <input
                                    type="number"
                                    value={inputTemp}
                                    onChange={(e) => setInputTemp(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white font-mono text-lg outline-none focus:border-red-500 transition-all"
                                    placeholder="100"
                                />
                            </div>
                            <div className="flex items-center justify-center text-slate-600">
                                <Zap size={24} className="fill-current" />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-500 mb-1">
                                    Salida ({safeCategory === 'rtd' ? 'Resistencia (Ω)' : 'Voltaje (mV)'})
                                </label>
                                <div className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-red-400 font-mono text-xl font-bold">
                                    {outputVal || '-'}
                                </div>
                                <p className="text-[10px] text-slate-500 mt-1 text-right">
                                    *Cálculo aproximado ideal
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Info Card */}
                <div className="lg:col-span-2">
                    <div className="bg-slate-900/80 p-8 rounded-2xl border border-white/10 backdrop-blur-md shadow-2xl h-full relative overflow-hidden">
                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 p-32 bg-red-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                        <div className="relative z-10">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h2 className="text-3xl font-bold text-white mb-1">{currentSensor.name}</h2>
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
                        </div>
                    </div>
                </div>
            </div>

            <AdBanner dataAdSlot="1234567890" />
        </div>
    );
};

export default TemperatureSensors;
