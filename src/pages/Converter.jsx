import React, { useState, useEffect } from 'react';
import { RefreshCw, Save, ArrowRightLeft } from 'lucide-react';
import { supabase } from '../supabase';
import BackButton from '../components/BackButton';

const Converter = () => {
    const [category, setCategory] = useState('pressure');
    const [fromUnit, setFromUnit] = useState('');
    const [toUnit, setToUnit] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [result, setResult] = useState('');
    const [label, setLabel] = useState('');
    const [saving, setSaving] = useState(false);

    const categories = {
        pressure: {
            name: 'Presión',
            units: {
                bar: { name: 'Bar', rate: 1 },
                psi: { name: 'PSI', rate: 0.0689476 },
                pa: { name: 'Pascal', rate: 0.00001 },
                atm: { name: 'Atmósfera', rate: 1.01325 }
            }
        },
        temperature: {
            name: 'Temperatura',
            units: {
                c: { name: 'Celsius' },
                f: { name: 'Fahrenheit' },
                k: { name: 'Kelvin' }
            }
        },
        length: {
            name: 'Longitud',
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
            units: {
                kg: { name: 'Kilogramos', rate: 1 },
                lb: { name: 'Libras', rate: 0.453592 },
                g: { name: 'Gramos', rate: 0.001 },
                oz: { name: 'Onzas', rate: 0.0283495 }
            }
        }
    };

    useEffect(() => {
        const units = Object.keys(categories[category].units);
        setFromUnit(units[0]);
        setToUnit(units[1] || units[0]);
        setInputValue('');
        setResult('');
    }, [category]);

    useEffect(() => {
        if (inputValue === '' || isNaN(parseFloat(inputValue))) {
            setResult('');
            return;
        }

        const val = parseFloat(inputValue);

        if (category === 'temperature') {
            let inCelsius;
            if (fromUnit === 'c') inCelsius = val;
            else if (fromUnit === 'f') inCelsius = (val - 32) * 5 / 9;
            else if (fromUnit === 'k') inCelsius = val - 273.15;

            let outVal;
            if (toUnit === 'c') outVal = inCelsius;
            else if (toUnit === 'f') outVal = (inCelsius * 9 / 5) + 32;
            else if (toUnit === 'k') outVal = inCelsius + 273.15;

            setResult(outVal.toFixed(4));
        } else {
            const fromRate = categories[category].units[fromUnit].rate;
            const toRate = categories[category].units[toUnit].rate;
            const baseValue = val * fromRate;
            const targetValue = baseValue / toRate;
            setResult(targetValue.toFixed(4));
        }
    }, [inputValue, fromUnit, toUnit, category]);

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
                data: {
                    category, from: fromUnit, to: toUnit, input: inputValue, result
                }
            }]);
            if (error) throw error;
            alert('Conversión guardada correctamente.');
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
                <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
                    <RefreshCw size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white">Conversor Universal</h1>
                    <p className="text-slate-400">Transforma unidades de ingeniería en tiempo real</p>
                </div>
            </div>

            <div className="bg-slate-900/50 p-8 rounded-2xl border border-white/5 backdrop-blur-sm shadow-xl">
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
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors text-lg font-mono"
                        />
                        <select
                            value={fromUnit}
                            onChange={(e) => setFromUnit(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                        >
                            {category && Object.entries(categories[category].units).map(([key, unit]) => (
                                <option key={key} value={key}>{unit.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Icon */}
                    <div className="flex justify-center pt-6 text-purple-500">
                        <RefreshCw size={24} />
                    </div>

                    {/* To */}
                    <div className="space-y-2">
                        <label className="block text-xs font-medium text-slate-400">A:</label>
                        <div className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-cyan-400 text-lg font-mono min-h-[54px] flex items-center">
                            {result || '0'}
                        </div>
                        <select
                            value={toUnit}
                            onChange={(e) => setToUnit(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                        >
                            {category && Object.entries(categories[category].units).map(([key, unit]) => (
                                <option key={key} value={key}>{unit.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Save Section */}
                <div className="flex gap-4 items-end bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                    <div className="flex-1">
                        <label className="block text-xs font-medium text-slate-500 mb-1">Etiqueta (Ej: Presión Caldera)</label>
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
                        {saving ? 'Guardando...' : 'Guardar Conversión'}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Converter;
