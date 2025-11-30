import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, AlertTriangle, ArrowRightLeft } from 'lucide-react';
import { supabase } from '../supabase';
import BackButton from '../components/BackButton';
import { useAuth } from '../contexts/Auth';
import useLocalStorage from '../hooks/useLocalStorage';
import ToolHeader from '../components/ToolHeader';
import SaveCalculationSection from '../components/SaveCalculationSection';
import AdBanner from '../components/AdBanner';
import RecentHistory from '../components/RecentHistory';

const Vibration = () => {
    const { user } = useAuth();
    const [voltage, setVoltage] = useLocalStorage('vib_voltage', '-10.0', user?.id); // Volts DC
    const [sensitivity, setSensitivity] = useLocalStorage('vib_sens', '200', user?.id); // mV/mil or mV/um
    const [unit, setUnit] = useLocalStorage('vib_unit', 'mils', user?.id); // mils or um

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [label, setLabel] = useState('');
    const [description, setDescription] = useState('');
    const [saving, setSaving] = useState(false);

    const [gapInput, setGapInput] = useState('');

    // Derived Values
    const distance = useMemo(() => {
        const v = Math.abs(parseFloat(voltage));
        const s = parseFloat(sensitivity);
        if (isNaN(v) || isNaN(s) || s === 0) return 0;
        return ((v * 1000) / s);
    }, [voltage, sensitivity]);

    // Update gapInput when distance changes (calculated from voltage)
    useEffect(() => {
        if (!isNaN(distance)) {
            setGapInput(distance.toFixed(2));
        }
    }, [distance]);

    const handleGapChange = (val) => {
        setGapInput(val);
        const d = parseFloat(val);
        const s = parseFloat(sensitivity);

        if (!isNaN(d) && !isNaN(s) && s !== 0) {
            // V = (D * S) / 1000
            // Maintain negative sign convention for proximity probes
            const v = (d * s) / 1000;
            setVoltage((-Math.abs(v)).toFixed(2));
        }
    };

    // Alerts Logic (API 670)
    const alertStatus = useMemo(() => {
        const v = parseFloat(voltage);
        if (isNaN(v)) return null;

        // API 670: Linear range is typically -2V to -18V
        if (v > -2.0) {
            return {
                type: 'danger',
                message: 'ALERTA: Zona Muerta / Roce (< 2V)',
                description: 'La sonda está demasiado cerca del eje. Riesgo de daño físico.'
            };
        }
        if (v < -18.0) {
            return {
                type: 'warning',
                {/* Alert Box */ }
            {
                alertStatus && (
                    <div className={`mb-8 p-4 rounded-xl border flex items-center gap-3 ${alertStatus.type === 'danger'
                        ? 'bg-red-500/10 border-red-500/50 text-red-400'
                        : alertStatus.type === 'warning'
                            ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-400'
                            : 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                        }`}>
                        {alertStatus.type === 'success' ? (
                            <div className="shrink-0 p-1 bg-emerald-500/20 rounded-full">
                                <Activity size={16} />
                            </div>
                        ) : (
                            <AlertTriangle className="shrink-0" />
                        )}
                        <div>
                            <div className="font-bold uppercase">{alertStatus.message}</div>
                            <div className="text-sm opacity-80">{alertStatus.description}</div>
                        </div>
                    </div>
                )
            }

                <SaveCalculationSection
                    label={label}
                    setLabel={setLabel}
                    description={description}
                    setDescription={setDescription}
                    onSave={handleSave}
                    onClear={clearAll}
                    saving={saving}
                />

                <RecentHistory
                    toolName="Sonda de Vibración"
                    onLoadData={(item) => {
                        if (confirm(`¿Cargar datos de ${item.label}?`)) {
                            setVoltage(item.data.voltage || '-10.0');
                            setSensitivity(item.data.sensitivity || '200');
                            setUnit(item.data.unit || 'mils');
                            setLabel(item.label || '');
                            setDescription(item.description || '');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                    }}
                    refreshTrigger={saving}
                />
            </div >

    {/* AdSense Banner (Moved to very bottom) */ }
    < AdBanner dataAdSlot = "1234567890" />

        </div >
    );
};

export default Vibration;
