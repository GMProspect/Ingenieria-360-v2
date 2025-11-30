import React, { useState } from 'react';
import { Zap, Gauge, Activity, Info } from 'lucide-react';
import { supabase } from '../supabase';
import BackButton from '../components/BackButton';
import { useAuth } from '../contexts/Auth';
import { useSync } from '../contexts/SyncContext';
import useLocalStorage from '../hooks/useLocalStorage';
import SaveCalculationSection from '../components/SaveCalculationSection';
import ToolHeader from '../components/ToolHeader';
import AdBanner from '../components/AdBanner';
import RecentHistory from '../components/RecentHistory';
import SaveModal from '../components/SaveModal';

const OhmsLaw = () => {
    const { user } = useAuth();
    // Use local storage for persistence
    const [voltage, setVoltage] = useLocalStorage('ohms_voltage', '', user?.id);
    const [current, setCurrent] = useLocalStorage('ohms_current', '', user?.id);
    const [resistance, setResistance] = useLocalStorage('ohms_resistance', '', user?.id);

    const [label, setLabel] = useState('');
    const [description, setDescription] = useState('');
    const [saving, setSaving] = useState(false);
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

    // Scroll to top on mount
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleInputChange = (e, field) => {
        const val = e.target.value;

        // Update the state for the changed field
        if (field === 'voltage') setVoltage(val);
        if (field === 'current') setCurrent(val);
        if (field === 'resistance') setResistance(val);

        // SMART CLEARING LOGIC:
        if (val === '') {
            if (field === 'voltage') {
                // If V is cleared, keep R, clear I (Cycle 1)
                if (resistance) setCurrent('');
                else if (current) setResistance('');
            }
            if (field === 'current') {
                // If I is cleared, keep V, clear R (Cycle 2)
                if (voltage) setResistance('');
                else if (resistance) setVoltage('');
            }
            if (field === 'resistance') {
                // If R is cleared, keep I, clear V (Cycle 3)
                if (current) setVoltage('');
                else if (voltage) setCurrent('');
            }
            return;
        }

        const numVal = parseFloat(val);
        if (isNaN(numVal)) return;

        // CALCULATION LOGIC:
        if (field === 'voltage') {
            const r = parseFloat(resistance);
            const i = parseFloat(current);
            if (!isNaN(r) && r !== 0) {
                setCurrent((numVal / r).toFixed(2));
            } else if (!isNaN(i) && i !== 0) {
                setResistance((numVal / i).toFixed(2));
            }
        }

        if (field === 'current') {
            const r = parseFloat(resistance);
            const v = parseFloat(voltage);
            if (!isNaN(r)) {
                setVoltage((numVal * r).toFixed(2));
            } else if (!isNaN(v) && numVal !== 0) {
                setResistance((v / numVal).toFixed(2));
            }
        }

        if (field === 'resistance') {
            const i = parseFloat(current);
            const v = parseFloat(voltage);
            if (!isNaN(i)) {
                setVoltage((numVal * i).toFixed(2));
            } else if (!isNaN(v) && numVal !== 0) {
                setCurrent((v / numVal).toFixed(2));
            }
        }
    };

    const clearAll = () => {
        setVoltage('');
        setCurrent('');
        setResistance('');
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
                tool_name: 'Ley de Ohm',
                label: label,
                description: description,
                user_id: user.id,
                data: {
                    voltage, current, resistance
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
            alert('Error al guardar.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <BackButton />

            <ToolHeader
                title="Ley de Ohm"
                subtitle="Calculadora Automática (Triángulo)"
                icon={Zap}
                iconColorClass="text-yellow-400"
                iconBgClass="bg-yellow-500/20"
                onReset={clearAll}
                onSave={() => setIsSaveModalOpen(true)}
            />

            <div className="bg-slate-900/50 p-8 rounded-2xl border border-white/5 backdrop-blur-sm shadow-xl relative">

                {/* Triangle Container - Exact dimensions from original project (440x380) */}
                <div className="relative w-full max-w-[440px] mx-auto h-[300px] md:h-[380px] mb-6 flex justify-center items-center overflow-hidden">

                    {/* Scaled Wrapper for Mobile */}
                    <div className="transform scale-[0.65] sm:scale-[0.8] md:scale-100 origin-center w-[440px] h-[380px] relative flex justify-center items-center">

                        {/* The Triangle Shape (Background) */}
                        <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                            <div className="w-0 h-0 
                                border-l-[220px] border-l-transparent 
                                border-r-[220px] border-r-transparent 
                                border-b-[380px] border-b-slate-800/50 
                                filter drop-shadow-[0_0_15px_rgba(0,242,255,0.1)]">
                            </div>
                        </div>

                        {/* Dividers */}
                        {/* Horizontal divider - Corrected width (220px) to fit inside triangle at 50% height */}
                        <div className="absolute top-[190px] left-1/2 -translate-x-1/2 w-[220px] h-1 bg-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.5)] rounded-full"></div>
                        {/* Vertical divider - shorter height to stay within triangle bounds */}
                        <div className="absolute top-[190px] left-1/2 w-1 h-[150px] bg-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.5)] rounded-full"></div>

                        {/* TOP SECTION: VOLTAGE (Centered horizontally) */}
                        <div className="absolute top-[70px] left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
                            <label className="text-yellow-400 font-bold mb-1 flex items-center gap-1 text-lg shadow-black drop-shadow-md">
                                <Zap size={20} /> V
                            </label>
                            <input
                                type="number"
                                value={voltage}
                                onChange={(e) => handleInputChange(e, 'voltage')}
                                placeholder="?"
                                className="w-[90px] md:w-[100px] bg-slate-950/80 border-2 border-yellow-500/50 rounded-xl px-2 py-2 text-center text-lg md:text-xl font-bold text-white focus:outline-none focus:border-yellow-400 focus:shadow-[0_0_20px_rgba(250,204,21,0.4)] transition-all placeholder-slate-600"
                            />
                        </div>

                        {/* BOTTOM LEFT: RESISTANCE (Centered in left half: ~25% of width) */}
                        <div className="absolute top-[250px] left-[25%] -translate-x-1/2 flex flex-col items-center z-10">
                            <label className="text-purple-400 font-bold mb-1 flex items-center gap-1 text-lg shadow-black drop-shadow-md">
                                <Gauge size={20} /> R
                            </label>
                            <input
                                type="number"
                                value={resistance}
                                onChange={(e) => handleInputChange(e, 'resistance')}
                                placeholder="?"
                                className="w-[90px] md:w-[100px] bg-slate-950/80 border-2 border-purple-500/50 rounded-xl px-2 py-2 text-center text-lg md:text-xl font-bold text-white focus:outline-none focus:border-purple-400 focus:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all placeholder-slate-600"
                            />
                        </div>

                        {/* BOTTOM RIGHT: CURRENT (Centered in right half: ~75% of width) */}
                        <div className="absolute top-[250px] left-[75%] -translate-x-1/2 flex flex-col items-center z-10">
                            <label className="text-cyan-400 font-bold mb-1 flex items-center gap-1 text-lg shadow-black drop-shadow-md">
                                <Activity size={20} /> I
                            </label>
                            <input
                                type="number"
                                value={current}
                                onChange={(e) => handleInputChange(e, 'current')}
                                placeholder="?"
                                className="w-[90px] md:w-[100px] bg-slate-950/80 border-2 border-cyan-500/50 rounded-xl px-2 py-2 text-center text-lg md:text-xl font-bold text-white focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all placeholder-slate-600"
                            />
                        </div>
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

                <RecentHistory
                    toolName="Ley de Ohm"
                    onLoadData={(item) => {
                        if (confirm(`¿Cargar datos de ${item.label}?`)) {
                            setVoltage(item.data.voltage || '');
                            setCurrent(item.data.current || '');
                            setResistance(item.data.resistance || '');
                            setLabel(item.label || '');
                            setDescription(item.description || '');
                            setIsSessionActive(true);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                    }}
                    refreshTrigger={saving}
                />

                {/* AdSense Banner (Moved to very bottom) */}
                <AdBanner dataAdSlot="1234567890" />

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
        </div>
    );
};

export default OhmsLaw;
