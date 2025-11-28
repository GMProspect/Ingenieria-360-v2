import React, { useState, useEffect } from 'react';
import { RefreshCw, Save, ArrowRightLeft, RotateCcw, Gauge, Thermometer, Ruler, Scale, Beaker } from 'lucide-react';
import { supabase } from '../supabase';
import BackButton from '../components/BackButton';
import useLocalStorage from '../hooks/useLocalStorage';

const Converter = () => {
    const [category, setCategory] = useLocalStorage('conv_cat', 'pressure');
    const [fromUnit, setFromUnit] = useLocalStorage('conv_from', '');
    const [toUnit, setToUnit] = useLocalStorage('conv_to', '');
    const [inputValue, setInputValue] = useLocalStorage('conv_input', '');
    const [result, setResult] = useState('');

    const [label, setLabel] = useState('');
    const [description, setDescription] = useState('');
    const [saving, setSaving] = useState(false);

    const categories = {
        pressure: {
            name: 'Presión',
            icon: Gauge,
            units: {
                bar: { name: 'Bar', rate: 1 },
                psi: { name: 'PSI', rate: 0.0689476 },
                pa: { name: 'Pascal', rate: 0.00001 },
                atm: { name: 'Atmósfera', rate: 1.01325 },
                kgcm2: { name: 'kg/cm²', rate: 0.980665 }
            }
        },
        temperature: {
            name: 'Temperatura',
            icon: Thermometer,
            units: {
                c: { name: 'Celsius' },
                f: { name: 'Fahrenheit' },
                k: { name: 'Kelvin' }
            }
        },
        length: {
            name: 'Longitud',
            icon: Ruler,
            units: {
                m: { name: 'Metros', rate: 1 },
                ft: { name: 'Pies', rate: 0.3048 },
                in: { name: 'Pulgadas', rate: 0.0254 },
                cm: { name: 'Centímetros', rate: 0.01 },
                mm: { name: 'Milímetros', rate: 0.001 }
            }
        },
        weight: {
            name: 'Peso',
            icon: Scale,
            units: {
                kg: { name: 'Kilogramos', rate: 1 },
                lb: { name: 'Libras', rate: 0.453592 },
                g: { name: 'Gramos', rate: 0.001 },
                oz: { name: 'Onzas', rate: 0.0283495 }
            }
        },
        volume: {
            name: 'Volumen',
            icon: Beaker,
            units: {
                l: { name: 'Litros', rate: 1 },
                gal: { name: 'Galones (US)', rate: 3.78541 },
                m3: { name: 'Metros Cúbicos', rate: 1000 },
                ml: { name: 'Mililitros', rate: 0.001 }
            }
        }
    };

    // Ensure units are valid when category changes
    useEffect(() => {
        if (categories[category]) {
            const units = Object.keys(categories[category].units);
            if (!units.includes(fromUnit)) setFromUnit(units[0]);
            if (!units.includes(toUnit)) setToUnit(units[1] || units[0]);
        }
    }, [category]);

    // Smart Logic: Auto-Calculate & Smart Clear
    useEffect(() => {
        if (inputValue === '') {
            setResult('');
            return;
        }

        const val = parseFloat(inputValue);
        if (isNaN(val)) {
            setResult('');
            return;
        }

        if (category === 'temperature') {
            let inCelsius;
            if (fromUnit === 'c') inCelsius = val;
            else if (fromUnit === 'f') inCelsius = (val - 32) * 5 / 9;
            else if (fromUnit === 'k') inCelsius = val - 273.15;

            let outVal;
            if (toUnit === 'c') outVal = inCelsius;
            else if (toUnit === 'f') outVal = (inCelsius * 9 / 5) + 32;
            else if (toUnit === 'k') outVal = inCelsius + 273.15;

            setResult(outVal !== undefined ? outVal.toFixed(4) : '');
        } else {
            const fromRate = categories[category]?.units[fromUnit]?.rate;
            const toRate = categories[category]?.units[toUnit]?.rate;

            if (fromRate && toRate) {
                const baseValue = val * fromRate;
                const targetValue = baseValue / toRate;
                setResult(targetValue.toFixed(4));
            }
        }
    }, [inputValue, fromUnit, toUnit, category]);

    const clearAll = () => {
        setInputValue('');
        setResult('');
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
                tool_name: 'Conversor Universal',
                label: label,
                description: description,
                data: {
                    category, from: fromUnit, to: toUnit, input: inputValue, result
                }
            }]);
            if (error) throw error;
            alert('Conversión guardada correctamente.');
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
                    <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
                        <RefreshCw size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Conversor Universal</h1>
                        <p className="text-slate-400">Transforma unidades de ingeniería en tiempo real</p>
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

                {/* Category Selector */}
                <div className="flex flex-wrap gap-2 mb-8 justify-center">
                    {Object.entries(categories).map(([key, data]) => (
                        <button
                            key={key}
                            onClick={() => setCategory(key)}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${category === key ? 'bg-cyan-500 text-slate-900 shadow-[0_0_15px_rgba(34,211,238,0.4)]' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'}`}
                        >
                            {data.name}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-6 items-center mb-8">
                    {/* From */}
                    <div className="space-y-2">
                        <label className="block text-xs font-medium text-slate-400">De:</label>
                        <input
                            type="number"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="0.00"
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors text-lg font-mono shadow-[0_0_15px_rgba(34,211,238,0.1)]"
                        />
                        <select
                            value={fromUnit}
                            onChange={(e) => setFromUnit(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                        >
                            {category && categories[category] && Object.entries(categories[category].units).map(([key, unit]) => (
                                <option key={key} value={key}>{unit.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Animated Flow Icon */}
                    <div className="flex justify-center pt-6 text-purple-500 relative h-16 w-16 mx-auto cursor-pointer hover:scale-110 transition-transform" onClick={() => {
                        const tempUnit = fromUnit;
                        setFromUnit(toUnit);
                        setToUnit(tempUnit);

                        // Swap values to preserve context
                        if (result && result !== '---') {
                            setInputValue(result);
                        }
                    }} title="Intercambiar Unidades y Valores">
                        <div className="absolute inset-0 flex items-center justify-center animate-spin-slow opacity-50">
                            <RefreshCw size={40} />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <ArrowRightLeft size={24} className="animate-pulse" />
                        </div>
                    </div>

                    {/* To */}
                    <div className="space-y-2">
                        <label className="block text-xs font-medium text-slate-400">A:</label>
                        <div className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-cyan-400 text-lg font-mono min-h-[54px] flex items-center shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                            {result || '---'}
                        </div>
                        <select
                            value={toUnit}
                            onChange={(e) => setToUnit(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                        >
                            {category && categories[category] && Object.entries(categories[category].units).map(([key, unit]) => (
                                <option key={key} value={key}>{unit.name}</option>
                            ))}
                        </select>
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
                                    placeholder="Ej. Conversión Válvula"
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-purple-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Descripción</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Notas adicionales..."
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
                                {saving ? 'Guardando...' : 'Guardar Conversión'}
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Converter;
