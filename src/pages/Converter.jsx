import React, { useState, useEffect } from 'react';
import { RefreshCw, ArrowRightLeft, Gauge, Thermometer, Ruler, Scale, Beaker, Info } from 'lucide-react';
import { supabase } from '../supabase';
import BackButton from '../components/BackButton';
import { useAuth } from '../contexts/Auth';
import useLocalStorage from '../hooks/useLocalStorage';
import ToolHeader from '../components/ToolHeader';
import SaveCalculationSection from '../components/SaveCalculationSection';
import AdBanner from '../components/AdBanner';

const Converter = () => {
    const { user } = useAuth();
    const [category, setCategory] = useLocalStorage('conv_cat', 'pressure', user?.id);
    const [fromUnit, setFromUnit] = useLocalStorage('conv_from', '', user?.id);
    const [toUnit, setToUnit] = useLocalStorage('conv_to', '', user?.id);
    const [inputValue, setInputValue] = useLocalStorage('conv_input', '', user?.id);
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
        if (!user) {
            alert('Debes iniciar sesión para guardar.');
            return;
        }
        setSaving(true);
        try {
            const { error } = await supabase.from('history').insert([{
                tool_name: 'Conversor Universal',
                label: label,
                description: description,
                user_id: user.id,
                data: {
                    category, from: fromUnit, to: toUnit, input: inputValue, result
                }
            }]);
            if (error) throw error;
            alert('Cálculo guardado correctamente.');
            setLabel('');
            setDescription('');
        } catch (error) {
            console.error('Error saving:', error);
            alert('Error al guardar.');
        } finally {
            setSaving(false);
        }
    };

    const handleSwap = () => {
        setFromUnit(toUnit);
        setToUnit(fromUnit);
        // Also swap values if there is a result, to keep continuity
        if (result && !isNaN(parseFloat(result))) {
            setInputValue(result);
            // The effect will trigger and calculate the new result (which should be the original input)
        }
    };

    const CurrentIcon = categories[category].icon;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <BackButton />

            <ToolHeader
                title="Conversor Universal"
                subtitle="Presión, Temperatura, Longitud y más"
                icon={RefreshCw}
                iconColorClass="text-green-400"
                iconBgClass="bg-green-500/20"
                onReset={clearAll}
            />

            {/* Category Selector */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-8">
                {Object.entries(categories).map(([key, data]) => (
                    <button
                        key={key}
                        onClick={() => setCategory(key)}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${category === key
                            ? 'bg-green-500/20 border-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                            : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-800'
                            }`}
                    >
                        <data.icon size={20} />
                        <span className="text-xs font-bold">{data.name}</span>
                    </button>
                ))}
            </div>

            <div className="bg-slate-900/50 p-8 rounded-2xl border border-white/5 backdrop-blur-sm shadow-xl">

                <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                    {/* FROM */}
                    <div className="flex-1 w-full">
                        <label className="block text-slate-400 mb-2 font-medium">De:</label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-lg focus:border-green-500 outline-none transition-colors"
                                placeholder="0"
                            />
                            <select
                                value={fromUnit}
                                onChange={(e) => setFromUnit(e.target.value)}
                                className="bg-slate-950 border border-slate-700 rounded-xl px-3 text-slate-300 focus:border-green-500 outline-none max-w-[120px]"
                            >
                                {categories[category] && Object.entries(categories[category].units).map(([key, unit]) => (
                                    <option key={key} value={key}>{unit.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* SWAP */}
                    <button
                        onClick={handleSwap}
                        className="p-3 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors mt-6 shadow-lg active:scale-95"
                        title="Intercambiar unidades"
                    >
                        <ArrowRightLeft size={20} />
                    </button>

                    {/* TO */}
                    <div className="flex-1 w-full">
                        <label className="block text-slate-400 mb-2 font-medium">A:</label>
                        <div className="flex gap-2">
                            <div className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-green-400 font-bold text-lg font-mono">
                                {result || '-'}
                            </div>
                            <select
                                value={toUnit}
                                onChange={(e) => setToUnit(e.target.value)}
                                className="bg-slate-950 border border-slate-700 rounded-xl px-3 text-slate-300 focus:border-green-500 outline-none max-w-[120px]"
                            >
                                {categories[category] && Object.entries(categories[category].units).map(([key, unit]) => (
                                    <option key={key} value={key}>{unit.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* AdSense Banner */}
                <AdBanner dataAdSlot="1234567890" />

                {/* Info Box (Moved to bottom) */}
                <div className="mb-8 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-start gap-3">
                    <Info className="text-green-400 shrink-0 mt-0.5" size={20} />
                    <div className="text-sm text-green-200 space-y-2">
                        <p className="font-bold text-lg mb-2">¿Qué es esto?</p>
                        <p>
                            Herramienta multipropósito para convertir unidades físicas comunes en ingeniería.
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-green-300/90">
                            <li><strong>Categorías:</strong> Selecciona arriba el tipo de magnitud (Presión, Temperatura, etc.).</li>
                            <li><strong>Bidireccional:</strong> Escribe en cualquier lado o usa el botón de intercambio.</li>
                        </ul>
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

            </div>
        </div>
    );
};

export default Converter;
