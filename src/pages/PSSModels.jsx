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
                            <li><strong>PSS2B:</strong> Modelo de doble entrada (potencia eléctrica y velocidad/frecuencia). Ofrece mejor rechazo al ruido y evita acciones de control indeseadas durante cambios rápidos de potencia mecánica.</li>
                            <li><strong>PSS4B:</strong> Modelo multibanda que permite sintonizar diferentes rangos de frecuencia por separado.</li>
                        </ul>

                        <div className="bg-slate-800/50 p-4 rounded-lg mt-4 border-l-4 border-purple-500">
                            <p className="text-sm">
                                <strong>Nota de Campo:</strong> Un PSS mal sintonizado puede inestabilizar el sistema en lugar de amortiguarlo. Siempre verifique la fase de compensación durante las pruebas de puesta en servicio.
                            </p>
                        </div>
                    </div>
                </EducationalSection>

                <div className="mt-8">
                    <AdBanner dataAdSlot="1234567890" />
                </div>
            </div>
        </div>
    );
};

export default PSSModels;
