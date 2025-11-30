import React, { useState, useEffect } from 'react';
import { Wrench, Info, Settings, AlertTriangle } from 'lucide-react';
import ToolHeader from '../components/ToolHeader';
import BackButton from '../components/BackButton';
import AdBanner from '../components/AdBanner';
import SaveModal from '../components/SaveModal';
import EducationalSection from '../components/EducationalSection';

const TorqueCalculator = () => {
    const [diameter, setDiameter] = useState('0.75'); // 3/4"
    const [grade, setGrade] = useState('B7');
    const [lubrication, setLubrication] = useState('moly');
    const [torque, setTorque] = useState({ ftlb: 0, nm: 0 });
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    // Dummy state for SaveModal compatibility (Torque Calculator doesn't have save logic yet, but we'll add the UI)
    const [label, setLabel] = useState('');
    const [description, setDescription] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Data
    const diameters = [
        { val: '0.5', label: '1/2"', area: 0.1419, tpi: 13 },
        { val: '0.625', label: '5/8"', area: 0.226, tpi: 11 },
        { val: '0.75', label: '3/4"', area: 0.334, tpi: 10 },
        { val: '0.875', label: '7/8"', area: 0.462, tpi: 9 },
        { val: '1.0', label: '1"', area: 0.606, tpi: 8 },
        { val: '1.125', label: '1-1/8"', area: 0.790, tpi: 8 },
        { val: '1.25', label: '1-1/4"', area: 1.000, tpi: 8 },
        { val: '1.375', label: '1-3/8"', area: 1.233, tpi: 8 },
        { val: '1.5', label: '1-1/2"', area: 1.492, tpi: 8 },
        { val: '1.625', label: '1-5/8"', area: 1.78, tpi: 8 },
        { val: '1.75', label: '1-3/4"', area: 2.08, tpi: 8 },
        { val: '1.875', label: '1-7/8"', area: 2.41, tpi: 8 },
        { val: '2.0', label: '2"', area: 2.77, tpi: 8 },
    ];

    const lubricants = {
        dry: { name: 'Seco / Óxido', k: 0.20, desc: 'Sin lubricante o acero oxidado.' },
        oil: { name: 'Aceite de Máquina', k: 0.15, desc: 'Lubricación ligera estándar.' },
        moly: { name: 'Moly / Anti-Seize', k: 0.12, desc: 'Pasta de Disulfuro de Molibdeno o Cobre.' },
        custom: { name: 'K Personalizado', k: 0.10, desc: 'Valor específico del fabricante.' }
    };

    const grades = {
        B7: { name: 'ASTM A193 B7', yield: 105000, targetPercent: 0.50 }, // 50% Yield is common target
        B8: { name: 'ASTM A193 B8 (Inox)', yield: 30000, targetPercent: 0.65 }, // Lower yield, higher % often used
        B16: { name: 'ASTM A193 B16', yield: 105000, targetPercent: 0.50 },
    };

    useEffect(() => {
        calculateTorque();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [diameter, grade, lubrication]);

    const calculateTorque = () => {
        const d = parseFloat(diameter);
        const boltData = diameters.find(b => b.val === diameter);
        const lubData = lubricants[lubrication];
        const gradeData = grades[grade];

        if (!boltData || !lubData || !gradeData) return;

        // Target Load (F) = Yield * Area * TargetPercent
        // This is a simplified industrial target, often 40-50% of Yield for B7
        const targetLoad = gradeData.yield * boltData.area * gradeData.targetPercent;

        // Torque (T) = K * D * F / 12 (for ft-lb)
        const t_ftlb = (lubData.k * d * targetLoad) / 12;
        const t_nm = t_ftlb * 1.35582;

        setTorque({
            ftlb: Math.round(t_ftlb),
            nm: Math.round(t_nm)
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-6 pb-20">
            <BackButton />
            <ToolHeader
                title="Calculadora de Torque"
                subtitle="Pernos y Espárragos Industriales"
                icon={Wrench}
                iconColorClass="text-orange-400"
                iconBgClass="bg-orange-500/20"
                onSave={() => setIsSaveModalOpen(true)}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Inputs */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
                        <label className="block text-xs text-slate-500 mb-2 uppercase tracking-wider font-bold">Diámetro del Perno</label>
                        <select
                            value={diameter}
                            onChange={(e) => setDiameter(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 transition-colors"
                        >
                            {diameters.map(d => (
                                <option key={d.val} value={d.val}>{d.label} - {d.tpi} TPI</option>
                            ))}
                        </select>
                    </div>

                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
                        <label className="block text-xs text-slate-500 mb-2 uppercase tracking-wider font-bold">Material (Grado)</label>
                        <div className="space-y-2">
                            {Object.entries(grades).map(([key, data]) => (
                                <button
                                    key={key}
                                    onClick={() => setGrade(key)}
                                    className={`w-full p-3 rounded-xl text-left transition-all border ${grade === key
                                        ? 'bg-orange-500/20 border-orange-500 text-white'
                                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                                        }`}
                                >
                                    <div className="font-bold text-sm">{data.name}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
                        <label className="block text-xs text-slate-500 mb-2 uppercase tracking-wider font-bold">Lubricación (Factor K)</label>
                        <div className="space-y-2">
                            {Object.entries(lubricants).map(([key, data]) => (
                                <button
                                    key={key}
                                    onClick={() => setLubrication(key)}
                                    className={`w-full p-3 rounded-xl text-left transition-all border ${lubrication === key
                                        ? 'bg-blue-500/20 border-blue-500 text-white'
                                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                                        }`}
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-bold text-sm">{data.name}</span>
                                        <span className="text-xs font-mono bg-slate-900 px-2 py-0.5 rounded">K={data.k}</span>
                                    </div>
                                    <div className="text-xs text-slate-500">{data.desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Results & Art */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Result Card */}
                    <div className="bg-slate-900/50 p-8 rounded-2xl border border-white/5 backdrop-blur-sm shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-32 bg-orange-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                        <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-6 flex items-center gap-2">
                            <Settings size={16} />
                            Torque Recomendado
                        </h3>

                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <div className="text-5xl font-bold text-white mb-2 font-mono tracking-tighter">
                                    {torque.ftlb}
                                </div>
                                <div className="text-orange-400 font-bold text-sm uppercase tracking-wider">Ft-Lbs (Pies-Libra)</div>
                            </div>
                            <div className="border-l border-white/10 pl-8">
                                <div className="text-5xl font-bold text-white mb-2 font-mono tracking-tighter">
                                    {torque.nm}
                                </div>
                                <div className="text-blue-400 font-bold text-sm uppercase tracking-wider">Newton-Metro</div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/10">
                            <div className="flex gap-3 items-start bg-yellow-500/10 p-4 rounded-xl border border-yellow-500/20">
                                <AlertTriangle className="text-yellow-500 shrink-0 mt-0.5" size={18} />
                                <div className="text-xs text-yellow-200/80 leading-relaxed">
                                    <strong>Nota Importante:</strong> Este cálculo asume una carga objetivo del {grades[grade].targetPercent * 100}% del límite elástico (Yield).
                                    El factor K de lubricación afecta drásticamente el resultado.
                                    <br /><br />
                                    <em>"Un perno mal lubricado puede leer el torque correcto pero tener solo la mitad de la fuerza de apriete."</em>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* The Art of Torque */}
                    <div className="bg-slate-950/30 p-8 rounded-2xl border border-white/5">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Wrench className="text-orange-400" size={24} />
                            El Arte del Torque
                        </h3>
                        <div className="prose prose-invert prose-sm max-w-none text-slate-400 space-y-4">
                            <p>
                                El torque no es solo apretar una tuerca; es la ciencia de estirar un perno para que actúe como un resorte gigante que mantiene la unión cerrada.
                            </p>
                            <ul className="space-y-2 list-disc pl-4">
                                <li>
                                    <strong className="text-white">La Lubricación es Vida:</strong> El 90% de la energía del torque se pierde en fricción. Solo el 10% estira el perno. Si cambias el lubricante, cambias la fuerza de apriete, aunque el torque sea el mismo.
                                </li>
                                <li>
                                    <strong className="text-white">Patrón de Estrella:</strong> Nunca aprietes en círculo. Usa siempre un patrón cruzado (estrella) y avanza en pasos (30%, 60%, 100%) para asentar la brida uniformemente.
                                </li>
                                <li>
                                    <strong className="text-white">Tuercas Marcadas:</strong> Las tuercas tienen un lado de carga. Asegúrate de que las marcas de grado miren hacia afuera para inspección.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <EducationalSection title="Teoría: Torque y Tensión de Pernos">
                <h4 className="text-white font-bold mb-2">¿Qué es el Torque?</h4>
                <p className="mb-4 text-sm">
                    El torque no es la tensión final del perno, sino la fuerza rotacional aplicada para lograr esa tensión.
                    El objetivo real es estirar el perno para que actúe como un resorte fuerte (fuerza de clampeo).
                </p>

                <h4 className="text-white font-bold mb-2">El Factor K (Nut Factor)</h4>
                <p className="mb-2 text-sm">
                    Es la variable más crítica. Representa la fricción entre la tuerca, el perno y la arandela.
                </p>
                <ul className="list-disc list-inside mb-4 text-sm space-y-1">
                    <li><strong className="text-red-400">Seco (K=0.20):</strong> Alta fricción. Requiere más torque para lograr la misma tensión.</li>
                    <li><strong className="text-blue-400">Moly (K=0.12):</strong> Baja fricción. Logra la misma tensión con mucho menos torque.</li>
                </ul>
                <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-700 font-mono text-xs mb-4 text-center">
                    T = K × D × F
                </div>
                <p className="text-xs text-slate-400 mb-4">
                    Donde: T = Torque, K = Factor de Fricción, D = Diámetro, F = Carga Objetivo.
                </p>

                <h4 className="text-white font-bold mb-2">Grados de Pernos (ASTM)</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                    <li><strong className="text-orange-400">B7:</strong> Acero aleado tratado térmicamente. El estándar para alta presión/temperatura.</li>
                    <li><strong className="text-slate-400">B8:</strong> Acero inoxidable (AISI 304). Menor resistencia, usado por corrosión.</li>
                </ul>
            </EducationalSection>

            <AdBanner dataAdSlot="9876543210" />

            <SaveModal
                isOpen={isSaveModalOpen}
                onClose={() => setIsSaveModalOpen(false)}
                label={label}
                setLabel={setLabel}
                description={description}
                setDescription={setDescription}
                onSave={() => {
                    alert('La función de guardar para Torque estará disponible pronto.');
                    setIsSaveModalOpen(false);
                }}
                onClear={() => {
                    setLabel('');
                    setDescription('');
                }}
                saving={saving}
                saveButtonText="Guardar (Próximamente)"
            />
        </div>
    );
};

export default TorqueCalculator;
