import React, { useState, useEffect } from 'react';
import { Activity, Zap, TrendingUp, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import ToolHeader from '../components/ToolHeader';
import BackButton from '../components/BackButton';
import AdBanner from '../components/AdBanner';
import EducationalSection from '../components/EducationalSection';

// Responsive SVG Graph Component
const SaturationGraph = () => (
    <div className="w-full bg-white p-4 rounded-xl overflow-hidden shadow-lg relative aspect-[4/3] md:aspect-[16/9]">
        <svg viewBox="0 0 400 300" className="w-full h-full">
            {/* Grid Lines */}
            <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Axes */}
            <line x1="40" y1="260" x2="380" y2="260" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow)" />
            <line x1="40" y1="260" x2="40" y2="20" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow)" />

            {/* Labels */}
            <text x="350" y="280" fontSize="10" fill="#64748b" fontWeight="bold">If (Campo)</text>
            <text x="10" y="15" fontSize="10" fill="#64748b" fontWeight="bold">Vt / Ia</text>

            {/* Air Gap Line (Linear) */}
            <line x1="40" y1="260" x2="200" y2="20" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />
            <text x="160" y="40" fontSize="10" fill="#94a3b8" transform="rotate(-55 160,40)">Línea de Entrehierro</text>

            {/* OCC Curve (Saturating) */}
            <path d="M 40 260 Q 140 110 280 60" fill="none" stroke="#8b5cf6" strokeWidth="3" />
            <text x="290" y="60" fontSize="12" fill="#8b5cf6" fontWeight="bold">OCC (Vacío)</text>

            {/* SCC Curve (Linear) */}
            <line x1="40" y1="260" x2="300" y2="180" stroke="#ef4444" strokeWidth="3" />
            <text x="310" y="180" fontSize="12" fill="#ef4444" fontWeight="bold">SCC (Corto)</text>

            {/* Rated Voltage Point (Vn) */}
            <line x1="35" y1="100" x2="45" y2="100" stroke="#0f172a" strokeWidth="2" />
            <text x="15" y="105" fontSize="10" fill="#0f172a" fontWeight="bold">Vn</text>
            <line x1="40" y1="100" x2="200" y2="100" stroke="#0f172a" strokeWidth="1" strokeDasharray="2,2" />
            <circle cx="200" cy="100" r="3" fill="#8b5cf6" />

            {/* If at Vn (No Load) */}
            <line x1="200" y1="100" x2="200" y2="260" stroke="#0f172a" strokeWidth="1" strokeDasharray="2,2" />
            <text x="190" y="275" fontSize="10" fill="#0f172a" fontWeight="bold">If(nl)</text>

            {/* Rated Current Point (In) */}
            <line x1="35" y1="200" x2="45" y2="200" stroke="#0f172a" strokeWidth="2" />
            <text x="15" y="205" fontSize="10" fill="#0f172a" fontWeight="bold">In</text>
            <line x1="40" y1="200" x2="235" y2="200" stroke="#0f172a" strokeWidth="1" strokeDasharray="2,2" />
            <circle cx="235" cy="200" r="3" fill="#ef4444" />

            {/* If at In (Short Circuit) */}
            <line x1="235" y1="200" x2="235" y2="260" stroke="#0f172a" strokeWidth="1" strokeDasharray="2,2" />
            <text x="230" y="275" fontSize="10" fill="#0f172a" fontWeight="bold">If(sc)</text>

        </svg>
        <div className="absolute top-2 right-2 bg-white/90 p-2 rounded border border-slate-200 text-[10px] text-slate-600 shadow-sm">
            <div className="flex items-center gap-1"><div className="w-3 h-1 bg-purple-500"></div>OCC: Voltaje vs Campo</div>
            <div className="flex items-center gap-1"><div className="w-3 h-1 bg-red-500"></div>SCC: Corriente vs Campo</div>
        </div>
    </div>
);

const SaturationCurves = () => {
    // SCR Calculator State
    const [ifNL, setIfNL] = useState(''); // Field current at rated voltage (Air Gap line / OCC)
    const [ifSC, setIfSC] = useState(''); // Field current at rated armature current (SCC)
    const [scr, setScr] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Calculate SCR
    useEffect(() => {
        const nl = parseFloat(ifNL);
        const sc = parseFloat(ifSC);

        if (!isNaN(nl) && !isNaN(sc) && sc !== 0) {
            const result = nl / sc;
            setScr(result.toFixed(3));
        } else {
            setScr(null);
        }
    }, [ifNL, ifSC]);

    return (
        <div className="max-w-4xl mx-auto p-6 pb-20">
            <BackButton />
            <ToolHeader
                title="Curvas de Saturación"
                subtitle="Generadores Síncronos: OCC, SCC y SCR"
                icon={TrendingUp}
                iconColorClass="text-purple-400"
                iconBgClass="bg-purple-500/20"
            />

            {/* 1. Interactive Graph Section */}
            <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Activity size={20} className="text-purple-400" />
                    Diagrama Típico (OCC vs SCC)
                </h3>
                <SaturationGraph />
                <p className="mt-2 text-xs text-slate-400 text-center">
                    El punto donde la curva OCC se separa de la Línea de Entrehierro indica el inicio de la saturación magnética.
                </p>
            </div>

            {/* 2. SCR Calculator Section */}
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 backdrop-blur-sm shadow-xl mb-8">
                <h3 className="text-sm font-bold text-green-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                    <Zap size={18} />
                    Calculadora SCR (Short Circuit Ratio)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs text-slate-500 mb-1">If para Voltaje Nominal en Vacío (If_nl)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={ifNL}
                                    onChange={(e) => setIfNL(e.target.value)}
                                    placeholder="Ej: 450"
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-3 pr-10 py-3 text-white focus:border-green-500 outline-none"
                                />
                                <span className="absolute right-3 top-3 text-xs text-slate-500">A</span>
                            </div>
                            <p className="text-[10px] text-slate-500 mt-1">Corriente de campo necesaria para generar Vn en la línea de entrehierro.</p>
                        </div>

                        <div>
                            <label className="block text-xs text-slate-500 mb-1">If para Corriente Nominal en Corto (If_sc)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={ifSC}
                                    onChange={(e) => setIfSC(e.target.value)}
                                    placeholder="Ej: 380"
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-3 pr-10 py-3 text-white focus:border-green-500 outline-none"
                                />
                                <span className="absolute right-3 top-3 text-xs text-slate-500">A</span>
                            </div>
                            <p className="text-[10px] text-slate-500 mt-1">Corriente de campo necesaria para circular In durante la prueba de corto.</p>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center items-center bg-slate-950/50 rounded-xl border border-white/5 p-6">
                        <span className="text-slate-400 text-sm mb-2">Relación de Cortocircuito (SCR)</span>
                        <div className="text-5xl font-mono font-bold text-green-400 mb-2">
                            {scr || '---'}
                        </div>
                        <div className="text-xs text-slate-500 text-center max-w-[200px]">
                            {scr ? (
                                parseFloat(scr) < 0.5 ? 'Generador moderno (Enfriado por H2/Agua)' :
                                    parseFloat(scr) > 1.0 ? 'Generador Hidroeléctrico (Robusto)' : 'Valor típico turbogenerador'
                            ) : 'Ingrese valores para calcular'}
                        </div>
                    </div>
                </div>
            </div>

            <AdBanner dataAdSlot="1234567890" />

            {/* 3. Educational Content */}
            <EducationalSection title="Teoría y Pruebas de Campo">
                <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                    <CheckCircle size={16} className="text-blue-400" />
                    ¿Por qué es importante la Saturación?
                </h4>
                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-700 mb-6 space-y-3">
                    <p className="text-sm text-slate-300">
                        La <strong>saturación magnética</strong> ocurre cuando el núcleo de hierro del generador ya no puede "conducir" más flujo magnético fácilmente.
                    </p>
                    <ul className="list-disc list-inside text-sm text-slate-400 space-y-1">
                        <li><strong>Operación Normal:</strong> Los generadores operan cerca del "codo" de saturación para optimizar el uso del material.</li>
                        <li><strong>Sobreexcitación:</strong> Si subes mucho el voltaje (más allá del 105-110%), entras en saturación profunda. Necesitas MUCHA más corriente de campo para subir un poco el voltaje, lo que calienta el rotor peligrosamente.</li>
                    </ul>
                </div>

                <h4 className="text-white font-bold mb-2">Interpretación del SCR</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                        <div className="text-xs font-bold text-green-400 mb-1">SCR Alto ({'>'} 1.0)</div>
                        <p className="text-xs text-slate-300">
                            Típico de máquinas hidroeléctricas. Son máquinas físicamente más grandes, más estables ante perturbaciones, pero más costosas.
                        </p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                        <div className="text-xs font-bold text-yellow-400 mb-1">SCR Bajo ({'<'} 0.6)</div>
                        <p className="text-xs text-slate-300">
                            Típico de turbogeneradores modernos. Son más compactos y eficientes, pero requieren sistemas de excitación (AVR/PSS) más rápidos para mantener la estabilidad.
                        </p>
                    </div>
                </div>

                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex gap-3">
                    <Info className="text-blue-500 shrink-0" size={24} />
                    <div className="text-xs text-blue-200/80">
                        <strong>Tip de Campo:</strong> Durante las pruebas de puesta en servicio, se levanta la curva OCC (subiendo voltaje poco a poco en vacío) para verificar que no haya espiras en corto en el rotor. Si la curva se "cae" antes de lo esperado, ¡hay problemas!
                    </div>
                </div>
            </EducationalSection>
        </div>
    );
};

export default SaturationCurves;
