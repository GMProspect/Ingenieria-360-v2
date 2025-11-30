import React, { useEffect } from 'react';
import { Cpu, Info } from 'lucide-react';
import ToolHeader from '../components/ToolHeader';
import BackButton from '../components/BackButton';
import AdBanner from '../components/AdBanner';
import EducationalSection from '../components/EducationalSection';

const PSSModels = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 pb-20">
            <ToolHeader
                title="Modelos PSS (IEEE)"
                description="Estabilizadores de Sistemas de Potencia"
                icon={Cpu}
                color="purple"
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <BackButton />

                <div className="bg-slate-900/50 rounded-2xl p-6 border border-white/10 mb-8 backdrop-blur-sm">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-purple-500/10 rounded-xl">
                            <Info className="text-purple-400" size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white mb-2">Herramienta en Desarrollo</h3>
                            <p className="text-slate-400">
                                Estamos implementando los modelos estándar IEEE (PSS1A, PSS2B, PSS4B) para simulación dinámica.
                                Mientras tanto, consulta la sección teórica abajo para referencias de campo.
                            </p>
                        </div>
                    </div>
                </div>

                <EducationalSection title="Teoría: Estabilizadores de Sistemas de Potencia (PSS)">
                    <div className="space-y-4 text-slate-300">
                        <p>
                            Los <strong>Estabilizadores de Sistemas de Potencia (PSS)</strong> son dispositivos de control auxiliares instalados en los sistemas de excitación de generadores síncronos.
                            Su función principal es amortiguar las oscilaciones electromecánicas de baja frecuencia (0.1 Hz - 3.0 Hz) que ocurren en la red eléctrica.
                        </p>

                        <h4 className="text-white font-bold mt-4">Tipos de Oscilaciones</h4>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Modo Local (0.8 - 2.0 Hz):</strong> Oscilaciones de un generador contra el resto del sistema.</li>
                            <li><strong>Modo Inter-área (0.1 - 0.7 Hz):</strong> Oscilaciones entre grupos de generadores en diferentes áreas geográficas.</li>
                        </ul>

                        <h4 className="text-white font-bold mt-4">Modelos Estándar IEEE 421.5</h4>
                        <p>
                            La norma IEEE 421.5 define varios modelos estándar para PSS, siendo los más comunes:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>PSS1A:</strong> Basado en velocidad o frecuencia. Es el modelo clásico de "tipo velocidad".</li>
                            import React, {useState, useEffect} from 'react';
                            import {Activity, Zap, Sliders, CheckCircle, AlertTriangle, Info} from 'lucide-react';
                            import ToolHeader from '../components/ToolHeader';
                            import BackButton from '../components/BackButton';
                            import AdBanner from '../components/AdBanner';
                            import EducationalSection from '../components/EducationalSection';

// Import generated images (assuming they are in assets or public, but for now using placeholders or direct paths if possible, 
// since I can't move files to src/assets easily, I will use the artifact paths if I could, but for a web app they need to be in public.
// For this environment, I will use the absolute paths for the user to see, or better, I will assume the user will move them.
// Actually, I'll use a placeholder or describe them, but the user asked for "drawings". 
// I will use the `img` tag with the local path for now, knowing it might not load in a real build without moving.
// BETTER APPROACH: I will create a component that renders the block diagram using CSS/SVG if possible, OR just use the text description for now 
// and ask the user to move the images. 
// WAIT, I can't easily move files to public. I will use the `img` tag with the absolute path for the USER's local preview context if that works, 
// or just use a placeholder text "Image: PSS1A Block Diagram".
// Let's try to make a CSS Block Diagram for maximum compatibility!)

const BlockDiagramPSS1A = () => (
                            <div className="flex flex-col items-center p-4 bg-white/5 rounded-xl overflow-x-auto">
                                <div className="flex items-center min-w-[600px] gap-2">
                                    {/* Input */}
                                    <div className="flex flex-col items-center">
                                        <span className="text-xs text-slate-400 mb-1">Velocidad (ω)</span>
                                        <div className="w-16 h-10 border-2 border-slate-600 rounded flex items-center justify-center bg-slate-900 text-xs font-bold">
                                            Filtro
                                        </div>
                                    </div>
                                    <div className="w-8 h-0.5 bg-slate-600"></div>
                                    {/* Washout */}
                                    <div className="flex flex-col items-center">
                                        <span className="text-xs text-slate-400 mb-1">Washout</span>
                                        <div className="w-20 h-12 border-2 border-blue-500/50 rounded flex items-center justify-center bg-slate-900 text-xs font-mono text-blue-300 text-center">
                                            sTw<br />1+sTw
                                        </div>
                                    </div>
                                    <div className="w-8 h-0.5 bg-slate-600"></div>
                                    {/* Gain */}
                                    <div className="flex flex-col items-center">
                                        <span className="text-xs text-slate-400 mb-1">Ganancia</span>
                                        <div className="w-12 h-10 border-2 border-green-500/50 rounded flex items-center justify-center bg-slate-900 text-xs font-bold text-green-400">
                                            Ks
                                        </div>
                                    </div>
                                    <div className="w-8 h-0.5 bg-slate-600"></div>
                                    {/* Lead-Lag 1 */}
                                    <div className="flex flex-col items-center">
                                        <span className="text-xs text-slate-400 mb-1">Comp. Fase 1</span>
                                        <div className="w-24 h-12 border-2 border-purple-500/50 rounded flex items-center justify-center bg-slate-900 text-xs font-mono text-purple-300 text-center">
                                            1+sT1<br />1+sT2
                                        </div>
                                    </div>
                                    <div className="w-8 h-0.5 bg-slate-600"></div>
                                    {/* Lead-Lag 2 */}
                                    <div className="flex flex-col items-center">
                                        <span className="text-xs text-slate-400 mb-1">Comp. Fase 2</span>
                                        <div className="w-24 h-12 border-2 border-purple-500/50 rounded flex items-center justify-center bg-slate-900 text-xs font-mono text-purple-300 text-center">
                                            1+sT3<br />1+sT4
                                        </div>
                                    </div>
                                    <div className="w-8 h-0.5 bg-slate-600"></div>
                                    {/* Limiter */}
                                    <div className="flex flex-col items-center">
                                        <span className="text-xs text-slate-400 mb-1">Límite</span>
                                        <div className="w-12 h-10 border-2 border-red-500/50 rounded flex items-center justify-center bg-slate-900 text-xs font-bold text-red-400">
                                            ±Vs
                                        </div>
                                    </div>
                                    <div className="w-8 h-0.5 bg-slate-600 relative">
                                        <div className="absolute -right-1 -top-1 w-2 h-2 border-t-2 border-r-2 border-slate-600 rotate-45"></div>
                                    </div>
                                    import React, {useState, useEffect} from 'react';
                                    import {Activity, Zap, Sliders, CheckCircle, AlertTriangle, Info} from 'lucide-react';
                                    import ToolHeader from '../components/ToolHeader';
                                    import BackButton from '../components/BackButton';
                                    import AdBanner from '../components/AdBanner';
                                    import EducationalSection from '../components/EducationalSection';

const BlockDiagramPSS1A = () => (
                                    <div className="relative">
                                        <div className="absolute right-2 top-2 text-[10px] text-slate-500 animate-pulse md:hidden">
                                            ← Desliza →
                                        </div>
                                        <div className="flex flex-col items-center p-4 bg-white/5 rounded-xl overflow-x-auto custom-scrollbar">
                                            <div className="flex items-center min-w-[600px] gap-2">
                                                {/* Input */}
                                                <div className="flex flex-col items-center shrink-0">
                                                    <span className="text-xs text-slate-400 mb-1">Velocidad (ω)</span>
                                                    <div className="w-16 h-10 border-2 border-slate-600 rounded flex items-center justify-center bg-slate-900 text-xs font-bold">
                                                        Filtro
                                                    </div>
                                                </div>
                                                <div className="w-8 h-0.5 bg-slate-600"></div>
                                                {/* Washout */}
                                                <div className="flex flex-col items-center shrink-0">
                                                    <span className="text-xs text-slate-400 mb-1">Washout</span>
                                                    <div className="w-20 h-12 border-2 border-blue-500/50 rounded flex items-center justify-center bg-slate-900 text-xs font-mono text-blue-300 text-center">
                                                        sTw<br />1+sTw
                                                    </div>
                                                </div>
                                                <div className="w-8 h-0.5 bg-slate-600"></div>
                                                {/* Gain */}
                                                <div className="flex flex-col items-center shrink-0">
                                                    <span className="text-xs text-slate-400 mb-1">Ganancia</span>
                                                    <div className="w-12 h-10 border-2 border-green-500/50 rounded flex items-center justify-center bg-slate-900 text-xs font-bold text-green-400">
                                                        Ks
                                                    </div>
                                                </div>
                                                <div className="w-8 h-0.5 bg-slate-600"></div>
                                                {/* Lead-Lag 1 */}
                                                <div className="flex flex-col items-center shrink-0">
                                                    <span className="text-xs text-slate-400 mb-1">Comp. Fase 1</span>
                                                    <div className="w-24 h-12 border-2 border-purple-500/50 rounded flex items-center justify-center bg-slate-900 text-xs font-mono text-purple-300 text-center">
                                                        1+sT1<br />1+sT2
                                                    </div>
                                                </div>
                                                <div className="w-8 h-0.5 bg-slate-600"></div>
                                                {/* Lead-Lag 2 */}
                                                <div className="flex flex-col items-center shrink-0">
                                                    <span className="text-xs text-slate-400 mb-1">Comp. Fase 2</span>
                                                    <div className="w-24 h-12 border-2 border-purple-500/50 rounded flex items-center justify-center bg-slate-900 text-xs font-mono text-purple-300 text-center">
                                                        1+sT3<br />1+sT4
                                                    </div>
                                                </div>
                                                <div className="w-8 h-0.5 bg-slate-600"></div>
                                                {/* Limiter */}
                                                <div className="flex flex-col items-center shrink-0">
                                                    <span className="text-xs text-slate-400 mb-1">Límite</span>
                                                    <div className="w-12 h-10 border-2 border-red-500/50 rounded flex items-center justify-center bg-slate-900 text-xs font-bold text-red-400">
                                                        ±Vs
                                                    </div>
                                                </div>
                                                <div className="w-8 h-0.5 bg-slate-600 relative">
                                                    <div className="absolute -right-1 -top-1 w-2 h-2 border-t-2 border-r-2 border-slate-600 rotate-45"></div>
                                                </div>
                                                <span className="text-xs font-bold text-white">Vpss</span>
                                            </div>
                                            <p className="mt-4 text-xs text-slate-500 italic">Diagrama de Bloques Simplificado IEEE PSS1A</p>
                                        </div>
                                    </div>
                                    );

const BlockDiagramPSS4B = () => (
                                    <div className="relative">
                                        <div className="absolute right-2 top-2 text-[10px] text-slate-500 animate-pulse md:hidden">
                                            ← Desliza →
                                        </div>
                                        <div className="flex flex-col items-center p-6 bg-white/5 rounded-xl overflow-x-auto custom-scrollbar">
                                            <div className="flex items-center min-w-[700px] gap-4">
                                                {/* Input */}
                                                <div className="flex flex-col items-center shrink-0">
                                                    <span className="text-xs text-slate-400 mb-1">Velocidad (ω)</span>
                                                    <div className="w-12 h-12 border-2 border-slate-600 rounded-full flex items-center justify-center bg-slate-900 text-xs font-bold">
                                                        ω
                                                    </div>
                                                </div>

                                                {/* Splitter */}
                                                <div className="flex flex-col gap-8 relative px-4 border-l-2 border-slate-600 h-[200px] justify-center">
                                                    {/* Top Branch (High Freq) */}
                                                    <div className="absolute top-0 left-0 w-4 h-0.5 bg-slate-600"></div>
                                                    <div className="flex items-center gap-2 absolute top-[-14px] left-4">
                                                        <div className="w-24 h-10 border border-red-500/50 rounded flex flex-col items-center justify-center bg-slate-900 text-[10px] text-red-300">
                                                            <span className="font-bold">Banda Alta</span>
                                                            <span>(High)</span>
                                                        </div>
                                                        <div className="w-8 h-0.5 bg-slate-600"></div>
                                                        <div className="w-12 h-10 border border-green-500/50 rounded flex items-center justify-center bg-slate-900 text-xs font-bold text-green-400">
                                                            K_H
                                                        </div>
                                                    </div>

                                                    {/* Middle Branch (Intermediate Freq) */}
                                                    <div className="absolute top-1/2 left-0 w-4 h-0.5 bg-slate-600"></div>
                                                    <div className="flex items-center gap-2 absolute top-[calc(50%-20px)] left-4">
                                                        <div className="w-24 h-10 border border-yellow-500/50 rounded flex flex-col items-center justify-center bg-slate-900 text-[10px] text-yellow-300">
                                                            <span className="font-bold">Banda Media</span>
                                                            <span>(Interm.)</span>
                                                        </div>
                                                        <div className="w-8 h-0.5 bg-slate-600"></div>
                                                        <div className="w-12 h-10 border border-green-500/50 rounded flex items-center justify-center bg-slate-900 text-xs font-bold text-green-400">
                                                            K_I
                                                        </div>
                                                    </div>

                                                    {/* Bottom Branch (Low Freq) */}
                                                    <div className="absolute bottom-0 left-0 w-4 h-0.5 bg-slate-600"></div>
                                                    <div className="flex items-center gap-2 absolute bottom-[-14px] left-4">
                                                        <div className="w-24 h-10 border border-blue-500/50 rounded flex flex-col items-center justify-center bg-slate-900 text-[10px] text-blue-300">
                                                            <span className="font-bold">Banda Baja</span>
                                                            <span>(Low)</span>
                                                        </div>
                                                        <div className="w-8 h-0.5 bg-slate-600"></div>
                                                        <div className="w-12 h-10 border border-green-500/50 rounded flex items-center justify-center bg-slate-900 text-xs font-bold text-green-400">
                                                            K_L
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Summation */}
                                                <div className="flex flex-col items-center shrink-0 ml-[220px]">
                                                    <div className="w-10 h-10 border-2 border-slate-500 rounded-full flex items-center justify-center bg-slate-800 text-lg font-bold">
                                                        Σ
                                                    </div>
                                                </div>
                                                <div className="w-8 h-0.5 bg-slate-600"></div>

                                                {/* Output */}
                                                <div className="flex flex-col items-center shrink-0">
                                                    <span className="text-xs text-slate-400 mb-1">Salida</span>
                                                    <div className="w-16 h-10 border-2 border-purple-500/50 rounded flex items-center justify-center bg-slate-900 text-xs font-bold text-purple-400">
                                                        Vpss
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="mt-8 text-xs text-slate-500 italic text-center">
                                                El PSS4B procesa 3 bandas de frecuencia en paralelo para cubrir todo el espectro de oscilaciones.
                                            </p>
                                        </div>
                                    </div>
                                    );

const PSSModels = () => {
    const [activeModel, setActiveModel] = useState('pss1a'); // 'pss1a' or 'pss4b'

                                    // Calculator State (PSS1A)
                                    const [freq, setFreq] = useState('1.0');
                                    const [t1, setT1] = useState('0.15');
                                    const [t2, setT2] = useState('0.03');
                                    const [t3, setT3] = useState('0.15');
                                    const [t4, setT4] = useState('0.03');
                                    const [phaseShift, setPhaseShift] = useState(0);

                                    // Calculator State (PSS4B - Simplified Gains)
                                    const [kL, setKL] = useState('1.0'); // Low
                                    const [kI, setKI] = useState('5.0'); // Intermediate
                                    const [kH, setKH] = useState('10.0'); // High

    useEffect(() => {
                                        window.scrollTo(0, 0);
    }, []);

    // Calculate Phase Shift (PSS1A)
    useEffect(() => {
        const f = parseFloat(freq);
                                    const valT1 = parseFloat(t1);
                                    const valT2 = parseFloat(t2);
                                    const valT3 = parseFloat(t3);
                                    const valT4 = parseFloat(t4);

                                    if (!isNaN(f) && !isNaN(valT1) && !isNaN(valT2) && !isNaN(valT3) && !isNaN(valT4)) {
            const w = 2 * Math.PI * f;
                                    const phi1 = (Math.atan(w * valT1) - Math.atan(w * valT2)) * (180 / Math.PI);
                                    const phi2 = (Math.atan(w * valT3) - Math.atan(w * valT4)) * (180 / Math.PI);
                                    setPhaseShift(phi1 + phi2);
        }
    }, [freq, t1, t2, t3, t4]);

                                    return (
                                    <div className="min-h-screen bg-slate-950 pb-20">
                                        <ToolHeader
                                            title="Modelos PSS (IEEE)"
                                            description="Estabilizadores de Sistemas de Potencia"
                                            icon={Cpu}
                                            color="purple"
                                        />

                                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                                            <BackButton />

                                            {/* Model Selector Tabs */}
                                            <div className="flex p-1 bg-slate-900/80 rounded-xl mb-8 border border-white/10">
                                                <button
                                                    onClick={() => setActiveModel('pss1a')}
                                                    className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${activeModel === 'pss1a'
                                                        ? 'bg-purple-500 text-white shadow-lg'
                                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                                        }`}
                                                >
                                                    PSS1A (Clásico)
                                                </button>
                                                <button
                                                    onClick={() => setActiveModel('pss4b')}
                                                    className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${activeModel === 'pss4b'
                                                        ? 'bg-blue-500 text-white shadow-lg'
                                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                                        }`}
                                                >
                                                    PSS4B (Multi-Banda)
                                                </button>
                                            </div>

                                            {/* Content based on Active Model */}
                                            {activeModel === 'pss1a' ? (
                                                <>
                                                    {/* PSS1A Calculator */}
                                                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 backdrop-blur-sm shadow-xl mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                                        <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                                                            <Sliders size={18} />
                                                            Calculadora de Fase (PSS1A)
                                                        </h3>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                            <div className="space-y-4">
                                                                <div>
                                                                    <label className="block text-xs text-slate-500 mb-1">Frecuencia de Oscilación (Hz)</label>
                                                                    <input
                                                                        type="number"
                                                                        value={freq}
                                                                        onChange={(e) => setFreq(e.target.value)}
                                                                        step="0.1"
                                                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-purple-500 outline-none"
                                                                    />
                                                                    <p className="text-[10px] text-slate-500 mt-1">Modo Local (0.8-2.0 Hz) o Inter-área (0.1-0.8 Hz).</p>
                                                                </div>

                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div>
                                                                        <label className="block text-xs text-slate-500 mb-1">T1 (Lead)</label>
                                                                        <input
                                                                            type="number"
                                                                            value={t1}
                                                                            onChange={(e) => setT1(e.target.value)}
                                                                            step="0.01"
                                                                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-purple-500 outline-none"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-xs text-slate-500 mb-1">T2 (Lag)</label>
                                                                        <input
                                                                            type="number"
                                                                            value={t2}
                                                                            onChange={(e) => setT2(e.target.value)}
                                                                            step="0.01"
                                                                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-purple-500 outline-none"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-xs text-slate-500 mb-1">T3 (Lead)</label>
                                                                        <input
                                                                            type="number"
                                                                            value={t3}
                                                                            onChange={(e) => setT3(e.target.value)}
                                                                            step="0.01"
                                                                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-purple-500 outline-none"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-xs text-slate-500 mb-1">T4 (Lag)</label>
                                                                        <input
                                                                            type="number"
                                                                            value={t4}
                                                                            onChange={(e) => setT4(e.target.value)}
                                                                            step="0.01"
                                                                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-purple-500 outline-none"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="flex flex-col justify-center items-center bg-slate-950/50 rounded-xl border border-white/5 p-6">
                                                                <span className="text-slate-400 text-sm mb-2">Compensación Total</span>
                                                                <div className="text-5xl font-mono font-bold text-purple-400 mb-2">
                                                                    {phaseShift.toFixed(1)}°
                                                                </div>
                                                                <div className="text-xs text-slate-500 text-center max-w-[200px]">
                                                                    Objetivo: Compensar ~90° de retraso del sistema de excitación.
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* PSS1A Visual */}
                                                    <div className="mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                                                        <h3 className="text-lg font-bold text-white mb-4">Diagrama de Bloques (PSS1A)</h3>
                                                        <div className="bg-slate-900/50 p-1 rounded-2xl border border-white/5">
                                                            <BlockDiagramPSS1A />
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    {/* PSS4B Info & Settings */}
                                                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 backdrop-blur-sm shadow-xl mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                                        <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                                            <Sliders size={18} />
                                                            Ajustes Multi-Banda (PSS4B)
                                                        </h3>
                                                        <p className="text-sm text-slate-300 mb-6">
                                                            El PSS4B ("Multi-Band") utiliza tres filtros paralelos para amortiguar oscilaciones en diferentes rangos de frecuencia.
                                                            Aquí es donde entran las <strong>"8 variables"</strong> que mencionaste (Gains K y Constantes de Tiempo para cada banda).
                                                        </p>

                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                            <div className="bg-slate-950/50 p-4 rounded-xl border border-blue-500/20">
                                                                <div className="text-xs font-bold text-blue-400 mb-2 uppercase">Banda Baja (L)</div>
                                                                <div className="text-[10px] text-slate-500 mb-2">0.01 - 0.1 Hz</div>
                                                                <label className="block text-xs text-slate-400 mb-1">Ganancia (K_L)</label>
                                                                <input
                                                                    type="number"
                                                                    value={kL}
                                                                    onChange={(e) => setKL(e.target.value)}
                                                                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-sm"
                                                                />
                                                            </div>
                                                            <div className="bg-slate-950/50 p-4 rounded-xl border border-yellow-500/20">
                                                                <div className="text-xs font-bold text-yellow-400 mb-2 uppercase">Banda Media (I)</div>
                                                                <div className="text-[10px] text-slate-500 mb-2">0.1 - 1.0 Hz</div>
                                                                <label className="block text-xs text-slate-400 mb-1">Ganancia (K_I)</label>
                                                                <input
                                                                    type="number"
                                                                    value={kI}
                                                                    onChange={(e) => setKI(e.target.value)}
                                                                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-sm"
                                                                />
                                                            </div>
                                                            <div className="bg-slate-950/50 p-4 rounded-xl border border-red-500/20">
                                                                <div className="text-xs font-bold text-red-400 mb-2 uppercase">Banda Alta (H)</div>
                                                                <div className="text-[10px] text-slate-500 mb-2">1.0 - 4.0 Hz</div>
                                                                <label className="block text-xs text-slate-400 mb-1">Ganancia (K_H)</label>
                                                                <input
                                                                    type="number"
                                                                    value={kH}
                                                                    onChange={(e) => setKH(e.target.value)}
                                                                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-sm"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* PSS4B Visual */}
                                                    <div className="mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                                                        <h3 className="text-lg font-bold text-white mb-4">Diagrama Multi-Banda (PSS4B)</h3>
                                                        <div className="bg-slate-900/50 p-1 rounded-2xl border border-white/5">
                                                            <BlockDiagramPSS4B />
                                                        </div>
                                                    </div>
                                                </>
                                            )}

                                            <AdBanner dataAdSlot="1234567890" />

                                            {/* Educational Content (Shared) */}
                                            <EducationalSection title="Teoría y Puesta en Servicio">
                                                <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                                                    <CheckCircle size={16} className="text-green-400" />
                                                    Lista de Chequeo para Ingenieros de Campo
                                                </h4>
                                                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-700 mb-6 space-y-3">
                                                    <div className="flex gap-3 items-start">
                                                        <div className="mt-1 min-w-[16px] h-4 rounded-full border border-slate-500"></div>
                                                        <p className="text-sm text-slate-300"><strong>1. Verificar AVR:</strong> El regulador de voltaje debe estar sintonizado y estable antes de tocar el PSS.</p>
                                                    </div>
                                                    <div className="flex gap-3 items-start">
                                                        <div className="mt-1 min-w-[16px] h-4 rounded-full border border-slate-500"></div>
                                                        <p className="text-sm text-slate-300"><strong>2. Identificar Modo de Oscilación:</strong> Usar un analizador de señales para encontrar la frecuencia natural (0.1 - 3.0 Hz).</p>
                                                    </div>
                                                    {activeModel === 'pss1a' ? (
                                                        <div className="flex gap-3 items-start">
                                                            <div className="mt-1 min-w-[16px] h-4 rounded-full border border-slate-500"></div>
                                                            <p className="text-sm text-slate-300"><strong>3. Calcular Compensación:</strong> Usar la calculadora arriba para ajustar T1-T4 y obtener el adelanto de fase necesario.</p>
                                                        </div>
                                                    ) : (
                                                        <div className="flex gap-3 items-start">
                                                            <div className="mt-1 min-w-[16px] h-4 rounded-full border border-slate-500"></div>
                                                            <p className="text-sm text-slate-300"><strong>3. Ajuste de Bandas (PSS4B):</strong> Ajustar K_L, K_I, K_H independientemente para atacar oscilaciones locales o inter-área.</p>
                                                        </div>
                                                    )}
                                                    <div className="flex gap-3 items-start">
                                                        <div className="mt-1 min-w-[16px] h-4 rounded-full border border-slate-500"></div>
                                                        <p className="text-sm text-slate-300"><strong>4. Prueba de Escalón (Step Test):</strong> Inyectar un escalón de voltaje (2-5%) en el AVR y verificar el amortiguamiento.</p>
                                                    </div>
                                                </div>

                                                <h4 className="text-white font-bold mb-2">Instrumentos Necesarios</h4>
                                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                                                    <li className="bg-white/5 p-2 rounded text-xs text-slate-300 flex items-center gap-2">
                                                        <Zap size={14} className="text-yellow-400" />
                                                        Analizador Dinámico de Señales (DSA)
                                                    </li>
                                                    <li className="bg-white/5 p-2 rounded text-xs text-slate-300 flex items-center gap-2">
                                                        <Activity size={14} className="text-blue-400" />
                                                        Osciloscopio con memoria
                                                    </li>
                                                    <li className="bg-white/5 p-2 rounded text-xs text-slate-300 flex items-center gap-2">
                                                        <Sliders size={14} className="text-green-400" />
                                                        Caja de Inyección de Señales (±10V)
                                                    </li>
                                                </ul>

                                                <h4 className="text-white font-bold mb-2">Fórmulas Clave</h4>
                                                <div className="space-y-4">
                                                    <div className="bg-slate-950 p-3 rounded border border-slate-800">
                                                        <p className="text-xs text-slate-500 mb-1">Función de Transferencia (Lead-Lag)</p>
                                                        <code className="text-sm font-mono text-purple-300">
                                                            G(s) = K · [(1 + sT1)/(1 + sT2)] · [(1 + sT3)/(1 + sT4)]
                                                        </code>
                                                    </div>
                                                    <div className="bg-slate-950 p-3 rounded border border-slate-800">
                                                        <p className="text-xs text-slate-500 mb-1">Ángulo de Fase (por etapa)</p>
                                                        <code className="text-sm font-mono text-blue-300">
                                                            φ = arctan(2πf · T_lead) - arctan(2πf · T_lag)
                                                        </code>
                                                    </div>
                                                </div>

                                                <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex gap-3">
                                                    <AlertTriangle className="text-yellow-500 shrink-0" size={24} />
                                                    <div className="text-xs text-yellow-200/80">
                                                        <strong>Precaución:</strong> Una ganancia (Ks) excesiva puede causar inestabilidad en otras frecuencias. Siempre comience con ganancia baja y auméntela gradualmente mientras monitorea la respuesta.
                                                        {activeModel === 'pss4b' && (
                                                            <>
                                                                <br /><br />
                                                                Una ganancia excesiva en la banda alta (K_H) puede amplificar ruido eléctrico o vibraciones torsionales.
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </EducationalSection>
                                        </div>
                                    </div>
                                    );
};

                                    export default PSSModels;
