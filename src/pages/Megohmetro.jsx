import React, { useState } from 'react';
import { Activity, AlertTriangle, CheckCircle, Info, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import BackButton from '../components/BackButton';
import ToolHeader from '../components/ToolHeader';
import SaveCalculationSection from '../components/SaveCalculationSection';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/Auth';
import useLocalStorage from '../hooks/useLocalStorage';
import AdBanner from '../components/AdBanner';

                            </label >
    <div className="grid grid-cols-2 gap-4">
        <button
            onClick={() => setVoltageRating('low')}
            className={`p-3 rounded-xl border transition-all flex flex-col items-center justify-center ${voltageRating === 'low'
                ? 'bg-purple-500/20 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-600'
                }`}
        >
            <span className="font-bold text-lg">&lt; 1000 V</span>
            <span className="text-xs opacity-80">Baja Tensión</span>
        </button>
        <button
            onClick={() => setVoltageRating('high')}
            className={`p-3 rounded-xl border transition-all flex flex-col items-center justify-center ${voltageRating === 'high'
                ? 'bg-purple-500/20 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-600'
                }`}
        >
            <span className="font-bold text-lg">&ge; 1000 V</span>
            <span className="text-xs opacity-80">Alta Tensión</span>
        </button>
    </div>
                        </div >
                    </div >
                </div >

    {/* Result Section */ }
    < div className = "space-y-6" >
    {
        result?(
                        <div className = {`h-full p-6 rounded-2xl border ${result.borderColor} ${result.bgColor} backdrop-blur-sm transition-all animate-fade-in`} >
        <div className="flex items-start mb-4">
            {result.status === 'danger' && <AlertTriangle className="text-red-500 mr-3 shrink-0" size={32} />}
            {result.status === 'warning' && <AlertTriangle className="text-yellow-500 mr-3 shrink-0" size={32} />}
            {result.status === 'success' && <CheckCircle className="text-green-500 mr-3 shrink-0" size={32} />}

            <div>
                <h3 className={`text-2xl font-bold ${result.color} mb-2`}>
                    {result.title}
                </h3>
                <p className="text-white text-lg font-medium mb-4 leading-relaxed">
                    {result.message}
                </p>
                <div className="bg-black/20 rounded-xl p-4 border border-black/10">
                    <p className="text-slate-200 text-sm">
                        <strong className="block mb-1 text-slate-400 uppercase text-xs tracking-wider">Recomendación:</strong>
                        {result.action}
                    </p>
                </div>
            </div>
        </div>
                        </div >
                    ) : (
    <div className="h-full bg-slate-900/30 p-6 rounded-2xl border border-white/5 flex flex-col justify-center items-center text-center text-slate-500 border-dashed">
        <Activity size={48} className="mb-4 opacity-20" />
        <p>Ingresa el valor de resistencia para ver el diagnóstico.</p>
    </div>
)}
                </div >
            </div >

    {/* Safety Tips */ }
    < div className = "bg-blue-900/20 border border-blue-500/30 rounded-2xl p-6 mb-8" >
                <h4 className="text-blue-400 font-bold mb-4 flex items-center">
                    <Info className="mr-2" size={20} />
                    Tips de Seguridad y Mantenimiento
                </h4>
                <ul className="space-y-3 text-slate-300 text-sm">
                    <li className="flex items-start">
                        <span className="mr-2 text-blue-500">•</span>
                        <span>
                            <strong>Humedad:</strong> Si el motor está fuera de servicio, usa siempre los
                            <span className="text-white font-medium"> calefactores (space heaters)</span> para evitar que el bobinado absorba humedad.
                        </span>
                    </li>
                    <li className="flex items-start">
                        <span className="mr-2 text-blue-500">•</span>
                        <span>
                            <strong>Temperatura:</strong> La resistencia de aislamiento disminuye a la mitad por cada
                            <span className="text-white font-medium"> 10°C de aumento</span> en la temperatura. Mide siempre a la misma temperatura para comparar.
                        </span>
                    </li>
                    <li className="flex items-start">
                        <span className="mr-2 text-blue-500">•</span>
                        <span>
                            <strong>Descarga:</strong> Al terminar la prueba, conecta el bobinado a tierra para descargar la energía almacenada.
                        </span>
                    </li>
                </ul>
            </div >

            <SaveCalculationSection
                label={label}
                setLabel={setLabel}
                description={description}
                setDescription={setDescription}
                onSave={handleSave}
                onClear={clearAll}
                saving={saving}
            />

            <AdBanner dataAdSlot="9876543210" />
        </div >
    );
};

export default Megohmetro;
