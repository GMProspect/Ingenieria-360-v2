import React, { useState } from 'react';
import { Zap, Gauge, Activity } from 'lucide-react';
import { supabase } from '../supabase';
import BackButton from '../components/BackButton';
import { useAuth } from '../contexts/Auth';
import useLocalStorage from '../hooks/useLocalStorage';
import SaveCalculationSection from '../components/SaveCalculationSection';
import ToolHeader from '../components/ToolHeader';

const OhmsLaw = () => {
    const { user } = useAuth();
    // Use local storage for persistence
    const [voltage, setVoltage] = useLocalStorage('ohms_voltage', '', user?.id);
    const [current, setCurrent] = useLocalStorage('ohms_current', '', user?.id);
    const [resistance, setResistance] = useLocalStorage('ohms_resistance', '', user?.id);

    // Track which field is being edited to avoid overwriting it
    const [activeField, setActiveField] = useState(null);
    const [label, setLabel] = useState('');
    const [description, setDescription] = useState('');
    const [saving, setSaving] = useState(false);

    const handleInputChange = (e, field) => {
        const val = e.target.value;
        setActiveField(field);

        // Update the state for the changed field
        if (field === 'voltage') setVoltage(val);
        if (field === 'current') setCurrent(val);
        if (field === 'resistance') setResistance(val);

        // SMART CLEARING LOGIC:
        if (val === '') {
            if (field === 'voltage') {
                if (resistance) setCurrent('');
                else if (current) setResistance('');
            }
            if (field === 'current') {
                if (resistance) setVoltage('');
                else if (voltage) setResistance('');
            }
            if (field === 'resistance') {
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
        setActiveField(null);
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
                tool_name: 'Ley de Ohm',
                label: label,
                description: description,
                user_id: user.id,
                data: {
                    voltage, current, resistance
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

    return (
        <div className="max-w-4xl mx-auto p-6">
            <BackButton />

            <ToolHeader
                title="Ley de Ohm"
                subtitle="Calculadora Automática (Triángulo)"
                icon={Zap}
                iconColorClass="text-yellow-400"
                label={label}
                setLabel={setLabel}
                description={description}
                setDescription={setDescription}
                onSave={handleSave}
                onClear={clearAll}
                saving={saving}
            />

        </div>
        </div >
    );
};

export default OhmsLaw;
