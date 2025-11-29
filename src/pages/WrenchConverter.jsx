import React, { useState } from 'react';
import { Wrench, Info } from 'lucide-react';
import ToolHeader from '../components/ToolHeader';
import BackButton from '../components/BackButton';
import AdBanner from '../components/AdBanner';

const WrenchConverter = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    // Unified Data: Nut (M) <-> Wrench (mm) <-> Wrench (inch)
    // Strictly matching the user's provided reference image rows
    const referenceData = [
        { m: 'M1.4', mm: '3', inch: '1/8"', id: 1 },
        { m: 'M2', mm: '4', inch: '3/16"', id: 2 },
        { m: 'M3.5', mm: '6', inch: '1/4"', id: 3 },
        { m: 'M5', mm: '9', inch: '5/16"', id: 4 }, // ~8mm nut, 9mm fits loose
        { m: 'M6', mm: '10', inch: '3/8"', id: 5 },
        { m: 'M7', mm: '12', inch: '7/16"', id: 6 }, // ~11mm nut, 12mm fits loose
        { m: 'M8', mm: '13', inch: '1/2"', id: 7 },
        { m: 'M9', mm: '15', inch: '9/16"', id: 8 }, // Rare size
        { m: 'M10', mm: '16', inch: '5/8"', id: 9 },
        { m: 'M11', mm: '18', inch: '11/16"', id: 10 }, // Rare size
        { m: 'M12', mm: '19', inch: '3/4"', id: 11 },
        { m: 'M12 (Alt)', mm: '20', inch: '13/16"', id: 12 },
        { m: 'M14', mm: '22', inch: '7/8"', id: 13 },
        { m: 'M16', mm: '24', inch: '15/16"', id: 14 },
        { m: 'M16 (Alt)', mm: '25', inch: '1"', id: 15 },
    ];

    return (
        <div className="max-w-4xl mx-auto animate-fade-in-up pb-20">
            <BackButton />
            <ToolHeader
                title="Tabla Maestra de Taller"
                subtitle="Conversor Unificado: Tuercas y Llaves"
                icon={Wrench}
            />

            <div className="bg-slate-900/90 rounded-3xl border border-white/10 p-1 md:p-8 relative overflow-hidden shadow-2xl min-h-[800px] flex justify-center">

                {/* Background Texture */}
                <div className="absolute inset-0 opacity-5 pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
                </div>

                {/* Background Graphics (Watermarks) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                    {/* Giant Wrench */}
                    <Wrench size={600} strokeWidth={1} className="text-slate-400 absolute -right-20 rotate-12" />
                    {/* Giant Nut */}
                    <div className="absolute -left-20 top-1/4 rotate-12">
                        <svg width="400" height="400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-cyan-400">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            <path d="M21 16.5V7.5L12 2 3 7.5v9L12 22l9-5.5z" />
                        </svg>
                    </div>
                </div>

                {/* Content Container */}
                <div className="relative z-10 w-full max-w-4xl">

                    {/* Header Row */}
                    <div className="grid grid-cols-3 mb-4 text-center bg-slate-800/80 rounded-t-2xl py-4 border-b border-white/10 backdrop-blur-sm sticky top-0 z-30">
                        <h3 className="text-sm md:text-xl font-bold text-cyan-400 uppercase tracking-widest flex items-center justify-center gap-2">
                            Tuerca <span className="text-xs opacity-50 hidden md:inline">(M)</span>
                        </h3>
                        <h3 className="text-sm md:text-xl font-bold text-white uppercase tracking-widest flex items-center justify-center gap-2">
                            Llave <span className="text-xs opacity-50 hidden md:inline">(mm)</span>
                        </h3>
                        <h3 className="text-sm md:text-xl font-bold text-purple-400 uppercase tracking-widest flex items-center justify-center gap-2">
                            Llave <span className="text-xs opacity-50 hidden md:inline">(")</span>
                        </h3>
                    </div>

                    {/* Data Rows */}
                    <div className="space-y-1">
                        {referenceData.map((item, index) => (
                            <div
                                key={item.id}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                className={`grid grid-cols-3 items-center py-3 px-2 md:px-6 transition-all duration-200 cursor-default border-b border-white/5 ${hoveredIndex === index
                                    ? 'bg-cyan-500/10 scale-[1.02] shadow-lg z-20 border-cyan-500/30 rounded-xl'
                                    : index % 2 === 0 ? 'bg-white/[0.02]' : 'bg-transparent'
                                    }`}
                            >
                                {/* Nut Side */}
                                <div className={`text-center font-mono text-lg md:text-xl font-bold transition-colors ${hoveredIndex === index ? 'text-cyan-300' : 'text-slate-400'
                                    }`}>
                                    {item.m === '-' ? '' : item.m}
                                </div>

                                {/* Metric Wrench Side (Center) */}
                                <div className={`text-center font-mono text-xl md:text-2xl font-bold transition-colors border-x border-white/5 ${hoveredIndex === index ? 'text-white' : 'text-slate-200'
                                    }`}>
                                    {item.mm}<span className="text-xs md:text-sm ml-1 opacity-40 font-normal">mm</span>
                                </div>

                                {/* Imperial Wrench Side */}
                                <div className={`text-center font-mono text-lg md:text-xl font-bold transition-colors ${hoveredIndex === index ? 'text-purple-300' : 'text-slate-400'
                                    }`}>
                                    {item.inch === '-' ? <span className="opacity-20">-</span> : item.inch}
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>

            <div className="mt-8 max-w-4xl mx-auto p-4 bg-slate-800/80 border border-white/10 rounded-xl flex items-start gap-3 backdrop-blur-md">
                <div className="text-cyan-400 shrink-0 mt-0.5">
                    <Info size={20} />
                </div>
                <div className="text-sm text-slate-200 space-y-2">
                    <p className="font-bold text-lg mb-2">¿Qué es esto?</p>
                    <p>
                        Esta tabla unificada te ayuda a encontrar la llave correcta para cada tuerca métrica.
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-slate-400">
                        <li><strong>Tuerca (M):</strong> Diámetro nominal de la rosca (ej: M6, M8).</li>
                        <li><strong>Llave (mm):</strong> Medida exacta de la llave métrica necesaria.</li>
                        <li><strong>Llave ("):</strong> Equivalente más cercano en pulgadas (útil si no tienes llaves métricas).</li>
                    </ul>
                </div>
            </div>

            {/* AdSense Banner (Moved to very bottom) */}
            <AdBanner dataAdSlot="1234567890" />

            <div className="mt-8 text-center text-slate-500 text-sm max-w-2xl mx-auto">
                <p className="mb-2">Tabla unificada de referencia para taller mecánico.</p>
                <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-cyan-500/20 border border-cyan-500/50"></div>
                        <span>Tuerca (Rosca Métrica)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-white/20 border border-white/50"></div>
                        <span>Llave Métrica (mm)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500/20 border border-purple-500/50"></div>
                        <span>Llave Inglesa (Pulgadas)</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WrenchConverter;
