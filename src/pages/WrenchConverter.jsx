import React, { useState } from 'react';
import { Wrench, Info } from 'lucide-react';
import ToolHeader from '../components/ToolHeader';
import BackButton from '../components/BackButton';
import AdBanner from '../components/AdBanner';
import EducationalSection from '../components/EducationalSection';

const WrenchConverter = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    // Scroll to top on mount
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Unified Data: Nut (M) <-> Wrench (mm) <-> Wrench (inch)
    // Strictly matching the user's provided reference image rows
    const referenceData = [
        { m: 'M1.4', mm: '3', inch: '1/8"', id: 1 }, // 1/8 = 3.17mm (Fit)
        { m: 'M2', mm: '4', inch: '5/32"', id: 2 }, // 5/32 = 3.96mm (Tight/No). 3/16 = 4.76mm (Loose). Let's use 5/32 (approx) or 3/16.
        { m: 'M2.5', mm: '5', inch: '3/16"', id: 201 }, // 3/16 = 4.76mm (Tight). 13/64 = 5.15mm.
        { m: 'M3.5', mm: '6', inch: '1/4"', id: 3 }, // 1/4 = 6.35mm (Fit)
        { m: 'M4', mm: '7', inch: '9/32"', id: 301 }, // 9/32 = 7.14mm (Fit)
        { m: 'M5', mm: '8', inch: '5/16"', id: 401 }, // 5/16 = 7.93mm (Tight). 11/32 = 8.73mm (Loose).
        { m: 'M5 (Alt)', mm: '9', inch: '11/32"', id: 4 }, // 11/32 = 8.73mm (Tight on 9mm). 3/8 = 9.52mm (Fit).
        { m: 'M6', mm: '10', inch: '13/32"', id: 5 }, // 3/8 = 9.52mm (No). 13/32 = 10.31mm (Fit).
        { m: 'M7', mm: '11', inch: '7/16"', id: 601 }, // 7/16 = 11.11mm (Fit).
        { m: 'M8', mm: '13', inch: '17/32"', id: 7 }, // 1/2 = 12.7mm (No). 17/32 = 13.49mm (Fit).
        { m: 'M8 (Alt)', mm: '14', inch: '9/16"', id: 101 }, // 9/16 = 14.28mm (Fit).
        { m: 'M9', mm: '15', inch: '19/32"', id: 8 }, // 19/32 = 15.08mm (Fit).
        { m: 'M10', mm: '16', inch: '5/8" (Justa)', id: 9 }, // 5/8 = 15.87mm (0.13mm interference). Often forced.
        { m: 'M10 (ISO)', mm: '17', inch: '11/16"', id: 102 }, // 11/16 = 17.46mm (Fit).

        { m: 'M12', mm: '19', inch: '3/4"', id: 11 }, // 3/4 = 19.05mm (Fit).
        { m: 'M12 (Alt)', mm: '20', inch: '25/32"', id: 12 }, // 25/32 = 19.84mm (Tight/No). 13/16 = 20.63mm (Loose).
        { m: 'M14', mm: '21', inch: '13/16"', id: 1301 }, // 13/16 = 20.63mm (No). 27/32 = 21.43mm (Fit).
        { m: 'M14 (ISO)', mm: '22', inch: '7/8"', id: 13 }, // 7/8 = 22.22mm (Fit).
        { m: 'M16', mm: '24', inch: '15/16" (No)', id: 14 }, // 15/16 = 23.81mm (No). 31/32 = 24.6mm (Fit).
        { m: 'M16 (Alt)', mm: '25', inch: '1"', id: 15 }, // 1" = 25.4mm (Fit).
    ];

    return (
        <div className="max-w-4xl mx-auto animate-fade-in-up pb-20">
            <BackButton />
            <ToolHeader
                title="Tabla Maestra de Taller"
                subtitle="Conversor Unificado: Tuercas y Llaves"
                icon={Wrench}
                iconColorClass="text-orange-400"
                iconBgClass="bg-orange-500/20"
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

            <EducationalSection title="Teoría: Medidas de Llaves y Tuercas">
                <h4 className="text-white font-bold mb-2">Métrico vs Imperial (SAE)</h4>
                <p className="mb-4 text-sm">
                    Aunque algunas llaves parecen intercambiables (ej. 19mm y 3/4"), usar la incorrecta puede dañar la cabeza del perno ("redondearlo"), especialmente en tuercas atascadas.
                </p>

                <h4 className="text-white font-bold mb-2">Equivalencias Seguras</h4>
                <ul className="list-disc list-inside mb-4 text-sm space-y-1">
                    <li><strong className="text-green-400">Exactas:</strong> 5/16" ≈ 8mm (7.94mm), 7/16" ≈ 11mm (11.11mm).</li>
                    <li><strong className="text-yellow-400">Aceptables:</strong> 3/4" (19.05mm) en tuerca 19mm.</li>
                    <li><strong className="text-red-400">Peligrosas:</strong> 1/2" (12.7mm) en tuerca 13mm (Muy holgada).</li>
                </ul>

                <h4 className="text-white font-bold mb-2">Nomenclatura de Tuercas</h4>
                <p className="mb-2 text-sm">
                    El tamaño "M" (ej. M8) se refiere al diámetro de la rosca, no al tamaño de la llave.
                    La norma ISO define qué llave usa cada rosca, pero existen variantes (DIN, JIS).
                </p>
                <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-700 font-mono text-xs mb-4 text-center">
                    M8 (Rosca) ≠ 13mm (Llave)
                </div>
            </EducationalSection>

            <EducationalSection title="Teoría Avanzada: Selección y Seguridad">
                <h4 className="text-white font-bold mb-2">Métrico vs Imperial (Pulgadas)</h4>
                <p className="mb-4 text-sm">
                    Aunque algunas llaves parecen intercambiables (como la de 1/2" y 13mm), sus dimensiones exactas difieren ligeramente.
                    Usar la llave incorrecta concentra la fuerza en las esquinas de la tuerca en lugar de en los flancos (caras planas),
                    lo que aumenta drásticamente el riesgo de "barrer" o redondear la cabeza del perno.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-700">
                        <h5 className="text-cyan-400 font-bold text-sm mb-1">Ejemplo Clásico: 1/2" vs 13mm</h5>
                        <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                            <li><strong>1/2":</strong> 12.70 mm</li>
                            <li><strong>13mm:</strong> 13.00 mm</li>
                            <li><strong className="text-red-400">Riesgo:</strong> La llave de 13mm queda holgada (0.3mm de juego) en una tuerca de 1/2", dañando las esquinas al aplicar torque.</li>
                        </ul>
                    </div>
                    <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-700">
                        <h5 className="text-purple-400 font-bold text-sm mb-1">Identificación de Roscas</h5>
                        <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                            <li><strong>Métrico (M):</strong> Se especifica por Diámetro x Paso (ej. M10 x 1.5). El paso es la distancia entre crestas en mm.</li>
                            <li><strong>Imperial (UNC/UNF):</strong> Se especifica por Diámetro - Hilos por Pulgada (ej. 1/2" - 13).</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg flex gap-3 items-start">
                    <Info className="text-yellow-500 shrink-0 mt-0.5" size={18} />
                    <div className="text-xs text-yellow-200/80">
                        <strong>Tip de Seguridad:</strong> Nunca uses extensiones ("cheater bars") en llaves fijas.
                        Están diseñadas para resistir la fuerza de una mano humana promedio. Si necesitas más palanca, usa un torquímetro o una llave de golpe.
                    </div>
                </div>
            </EducationalSection>

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
