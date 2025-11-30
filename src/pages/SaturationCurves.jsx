import React, { useEffect } from 'react';
import { Activity, Info } from 'lucide-react';
import ToolHeader from '../components/ToolHeader';
import BackButton from '../components/BackButton';
import AdBanner from '../components/AdBanner';
import EducationalSection from '../components/EducationalSection';

const SaturationCurves = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 pb-20">
            <ToolHeader
                title="Curvas de Saturación"
                description="Análisis de Generadores y Transformadores"
                icon={Activity}
                color="pink"
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <BackButton />

                <div className="bg-slate-900/50 rounded-2xl p-6 border border-white/10 mb-8 backdrop-blur-sm">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-pink-500/10 rounded-xl">
                            <Info className="text-pink-400" size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white mb-2">Herramienta en Desarrollo</h3>
                            <p className="text-slate-400">
                                Estamos construyendo el graficador interactivo para curvas de saturación de vacío (OCC) y cortocircuito (SCC).
                                Mientras tanto, consulta la teoría fundamental abajo.
                            </p>
                        </div>
                    </div>
                </div>

                <EducationalSection title="Teoría: Saturación Magnética">
                    <div className="space-y-4 text-slate-300">
                        <p>
                            La <strong>Curva de Saturación</strong> describe la relación no lineal entre la corriente de excitación (campo) y el voltaje terminal (armadura) en una máquina eléctrica.
                            Es fundamental para determinar los parámetros de operación y la estabilidad del generador.
                        </p>

                        <h4 className="text-white font-bold mt-4">Curva de Característica de Vacío (OCC)</h4>
                        <p>
                            Representa el voltaje terminal vs. corriente de campo cuando el generador está operando a velocidad nominal sin carga conectada.
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Región Lineal (Entrehierro):</strong> A bajas corrientes, el voltaje es proporcional a la corriente (Ley de Ampere).</li>
                            <li><strong>Región de Codo:</strong> El núcleo comienza a saturarse y se requiere más corriente para aumentar el flujo.</li>
                            <li><strong>Región de Saturación:</strong> Aumentos grandes en corriente producen cambios mínimos en voltaje.</li>
                        </ul>

                        <h4 className="text-white font-bold mt-4">Relación de Cortocircuito (SCR)</h4>
                        <p>
                            Es un parámetro crítico definido como la relación entre la corriente de campo requerida para producir voltaje nominal en vacío y la corriente de campo requerida para producir corriente nominal en cortocircuito.
                        </p>
                        <div className="bg-slate-800 p-3 rounded font-mono text-center my-2">
                            SCR = If_vacio / If_cc
                        </div>
                        <p>
                            Un SCR alto indica una máquina más grande, más costosa, pero más estable ante perturbaciones.
                        </p>
                    </div>
                </EducationalSection>

                <div className="mt-8">
                    <AdBanner dataAdSlot="1234567890" />
                </div>
            </div>
        </div>
    );
};

export default SaturationCurves;
