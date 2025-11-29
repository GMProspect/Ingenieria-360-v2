import React from 'react';

const TransmitterVisual = ({ pv, unit, ma, percent }) => {
    return (
        <div className="relative w-64 h-80 mx-auto flex flex-col items-center justify-center select-none">
            {/* Housing Body (The "Head") */}
            <div className="w-48 h-48 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 shadow-2xl border-4 border-slate-500 relative flex items-center justify-center z-10">

                {/* Screw/Cover Details */}
                <div className="absolute top-2 w-3 h-3 rounded-full bg-slate-400 shadow-inner"></div>
                <div className="absolute bottom-2 w-3 h-3 rounded-full bg-slate-400 shadow-inner"></div>
                <div className="absolute left-2 w-3 h-3 rounded-full bg-slate-400 shadow-inner"></div>
                <div className="absolute right-2 w-3 h-3 rounded-full bg-slate-400 shadow-inner"></div>

                {/* The Screen (LCD) */}
                <div className="w-32 h-32 bg-[#9ea792] rounded-full border-4 border-slate-900 shadow-inner flex items-center justify-center overflow-hidden relative">
                    {/* LCD Shadow/Glare */}
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-white/10 rounded-t-full pointer-events-none"></div>

                    {/* Digital Display Content */}
                    <div className="flex flex-col items-center justify-center font-mono text-slate-900 z-10 w-full px-2">
                        {/* Primary Value (PV) */}
                        <div className="text-3xl font-bold tracking-tighter">
                            {pv || '----'}
                        </div>
                        {/* Unit */}
                        <div className="text-xs font-bold uppercase mt-1">
                            {unit || 'UNIT'}
                        </div>

                        {/* Secondary Value (mA) */}
                        <div className="w-full flex justify-between items-end mt-2 px-2 border-t border-slate-800/20 pt-1">
                            <span className="text-[10px] font-semibold">OUT:</span>
                            <span className="text-xs font-bold">{ma || '--'} mA</span>
                        </div>

                        {/* Bar Graph Simulation */}
                        <div className="w-20 h-1.5 bg-slate-800/20 rounded-full mt-1 overflow-hidden">
                            <div
                                className="h-full bg-slate-900 transition-all duration-300"
                                style={{ width: `${Math.min(Math.max(percent || 0, 0), 100)}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Conduit / Sensor Connection (Bottom Stem) */}
            <div className="w-16 h-24 bg-gradient-to-r from-slate-700 via-slate-500 to-slate-700 -mt-4 z-0 border-x-2 border-slate-900 flex flex-col items-center">
                {/* Threads visual */}
                <div className="w-full h-2 border-b border-slate-800/50"></div>
                <div className="w-full h-2 border-b border-slate-800/50"></div>
                <div className="w-full h-2 border-b border-slate-800/50"></div>
                <div className="w-full h-2 border-b border-slate-800/50"></div>
            </div>

            {/* Nameplate */}
            <div className="absolute bottom-12 bg-slate-900 text-[8px] text-slate-400 px-2 py-0.5 rounded border border-slate-700 shadow-lg">
                ING-360 SMART TX
            </div>
        </div>
    );
};

export default TransmitterVisual;
