import React, { useState, useEffect } from 'react';
import { Thermometer, Info, Zap, Layers } from 'lucide-react';
import ToolHeader from '../components/ToolHeader';
import BackButton from '../components/BackButton';
import AdBanner from '../components/AdBanner';
import useLocalStorage from '../hooks/useLocalStorage';
import { useAuth } from '../contexts/Auth';

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
                    // Callendar-Van Dusen (Simplified for >0: R = R0 * (1 + A*t + B*t^2))
                    const R0 = 100;
                    const A = 3.9083e-3;
                    const B = -5.775e-7;
                    if (t >= 0) return R0 * (1 + A * t + B * t * t);
                    // For <0: R = R0 * (1 + A*t + B*t^2 + C*(t-100)*t^3)
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
            }
        }
    },
    tc: {
        name: 'Termocupla (Termopar)',
        types: {
            k: {
                name: 'Tipo K',
                desc: 'Uso general, bajo costo',
                composition: {
                    pos: { name: 'Cromel (Chromel)', detail: '90% Níquel, 10% Cromo', color: 'Amarillo (ANSI) / Verde (IEC)' },
                    neg: { name: 'Alumel', detail: '95% Níquel, 2% Manganeso, 2% Aluminio, 1% Silicio', color: 'Rojo (ANSI) / Blanco (IEC)' }
                },
                range: '-270°C a 1260°C',
                sensitivity: '~41 µV/°C',
                calc: (t) => t * 0.041 // Linear approx for demo (Real is NIST poly)
            },
            j: {
                name: 'Tipo J',
                desc: 'Atmósferas reductoras',
                composition: {
                    pos: { name: 'Hierro (Iron)', detail: '100% Fe (Magnético)', color: 'Blanco (ANSI) / Negro (IEC)' },
                    neg: { name: 'Constantán', detail: '55% Cobre, 45% Níquel', color: 'Rojo (ANSI) / Blanco (IEC)' }
                },
                range: '-40°C a 750°C',
                sensitivity: '~50 µV/°C',
                calc: (t) => t * 0.050 // Linear approx
            },
            t: {
                name: 'Tipo T',
                desc: 'Bajas temperaturas / Criogenia',
                composition: {
                    pos: { name: 'Cobre (Copper)', detail: '100% Cu', color: 'Azul (ANSI) / Marrón (IEC)' },
                    neg: { name: 'Constantán', detail: '55% Cobre, 45% Níquel', color: 'Rojo (ANSI) / Blanco (IEC)' }
                },
                range: '-270°C a 370°C',
                sensitivity: '~43 µV/°C',
                calc: (t) => t * 0.043 // Linear approx
            },
            e: {
                name: 'Tipo E',
                desc: 'Alta sensibilidad',
                composition: {
                    pos: { name: 'Cromel (Chromel)', detail: '90% Níquel, 10% Cromo', color: 'Púrpura (ANSI) / Violeta (IEC)' },
                    neg: { name: 'Constantán', detail: '55% Cobre, 45% Níquel', color: 'Rojo (ANSI) / Blanco (IEC)' }
                },
                range: '-270°C a 870°C',
                sensitivity: '~68 µV/°C',
                calc: (t) => t * 0.068 // Linear approx
            }
        }
    }
};

const TemperatureSensors = () => {
    const { user } = useAuth();
    const [category, setCategory] = useLocalStorage('temp_cat', 'tc', user?.id);
    const [type, setType] = useLocalStorage('temp_type', 'k', user?.id);
    const [inputTemp, setInputTemp] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Reset type when category changes if invalid
    useEffect(() => {
        if (!sensorData[category].types[type]) {
            setType(Object.keys(sensorData[category].types)[0]);
        }
    }, [category, type]);
    const outputVal = React.useMemo(() => {
        if (inputTemp === '' || isNaN(parseFloat(inputTemp))) {
            return '';
        }
        const t = parseFloat(inputTemp);
        const sensor = sensorData[category].types[type];
        if (sensor && sensor.calc) {
            return sensor.calc(t).toFixed(3);
        }
        return '';
    }, [inputTemp, category, type]);

    const currentSensor = sensorData[category].types[type];

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
                        className={`flex-1 p-4 rounded-xl border transition-all font-bold text-lg ${category === key
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
                    {/* Type Selector */}
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
                        <label className="block text-xs text-slate-500 mb-2 uppercase tracking-wider font-bold">Tipo de Sensor</label>
                        <div className="grid grid-cols-2 gap-2">
                            {Object.entries(sensorData[category].types).map(([key, data]) => (
                                <button
                                    key={key}
                                    onClick={() => setType(key)}
                                    className={`p-2 rounded-lg text-sm font-bold transition-colors ${type === key
                                        ? 'bg-red-500 text-white'
                                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                        }`}
                                >
                                    {data.name}
                                </button>
                            ))}
                        </div>
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
                                    Salida ({category === 'rtd' ? 'Resistencia (Ω)' : 'Voltaje (mV)'})
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
                                {category === 'tc' ? (
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
