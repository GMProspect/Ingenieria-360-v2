import React, { useState, useEffect } from 'react';
import { RefreshCw, ArrowRightLeft, Gauge, Thermometer, Ruler, Scale, Beaker } from 'lucide-react';
import { supabase } from '../supabase';
import BackButton from '../components/BackButton';
import { useAuth } from '../contexts/Auth';
import useLocalStorage from '../hooks/useLocalStorage';
import ToolHeader from '../components/ToolHeader';
import SaveCalculationSection from '../components/SaveCalculationSection';

const Converter = () => {
    const { user } = useAuth();
    const [category, setCategory] = useLocalStorage('conv_cat', 'pressure');
    const [fromUnit, setFromUnit] = useLocalStorage('conv_from', '');
    const [toUnit, setToUnit] = useLocalStorage('conv_to', '');
    const [inputValue, setInputValue] = useLocalStorage('conv_input', '');
    const [result, setResult] = useState('');

    // ... (rest of state and effects)

    // ... (clearAll)

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

            <ToolHeader
                title="Conversor Universal"
                subtitle="Transforma unidades de ingeniería en tiempo real"
                icon={RefreshCw}
                iconColorClass="text-blue-400"
                iconBgClass="bg-blue-500/20"
                onReset={clearAll}
            />

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
