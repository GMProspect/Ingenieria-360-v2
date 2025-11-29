import React from 'react';

const SensorVisual = ({ type, category, colors }) => {
    // colors = { pos: 'color', neg: 'color', connector: 'color' } for TC
    // or just generic for RTD

    const isRTD = category === 'rtd';

    return (
        <div className="relative w-full h-64 flex items-center justify-center select-none overflow-hidden">
            {isRTD ? (
                // RTD Visual: Probe with Head
                <div className="flex items-center">
                    {/* Connection Head */}
                    <div className="w-16 h-20 bg-gradient-to-br from-slate-400 to-slate-600 rounded-lg shadow-xl border-2 border-slate-700 relative z-10 flex items-center justify-center">
                        <div className="w-10 h-10 bg-slate-300 rounded-full border border-slate-500 shadow-inner"></div>
                        {/* Cable Gland */}
                        <div className="absolute -left-4 w-4 h-8 bg-slate-700 rounded-l"></div>
                    </div>

                    {/* Probe Sheath */}
                    <div className="w-48 h-4 bg-gradient-to-b from-slate-200 via-white to-slate-300 border-y border-slate-400 -ml-2 z-0 relative">
                        {/* Tip */}
                        <div className="absolute -right-2 top-0 w-2 h-full bg-slate-300 rounded-r-full border-r border-y border-slate-400"></div>

                        {/* Sensor Element (Internal X-ray view hint) */}
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-1 bg-red-500/30 blur-[1px]"></div>
                    </div>
                </div>
            ) : (
                // Thermocouple Visual: Connector + Wires + Junction
                <div className="flex items-center">
                    {/* Connector (Plug) */}
                    <div
                        className="w-16 h-24 rounded shadow-xl border-2 border-black/20 relative z-10 flex flex-col items-center justify-center gap-1"
                        style={{ backgroundColor: colors.connector || '#ccc' }}
                    >
                        {/* Pins */}
                        <div className="absolute -left-3 top-6 w-3 h-2 bg-yellow-600 rounded-l-sm"></div>
                        <div className="absolute -left-3 bottom-6 w-3 h-3 bg-yellow-600 rounded-l-sm"></div>

                        <div className="text-[10px] font-bold text-white/90 drop-shadow-md uppercase tracking-widest rotate-90">
                            TYPE {type}
                        </div>
                    </div>

                    {/* Wires */}
                    <div className="flex flex-col justify-center -ml-1 z-0">
                        {/* Positive Wire */}
                        <div
                            className="w-40 h-2 mb-1 shadow-sm"
                            style={{ backgroundColor: colors.pos || '#f00' }}
                        ></div>
                        {/* Negative Wire */}
                        <div
                            className="w-40 h-2 mt-1 shadow-sm"
                            style={{ backgroundColor: colors.neg || '#00f' }}
                        ></div>
                    </div>

                    {/* Hot Junction (Tip) */}
                    <div className="w-3 h-3 rounded-full bg-slate-400 border border-slate-600 -ml-1 z-10 shadow-sm relative">
                        <div className="absolute inset-0 bg-orange-500/50 rounded-full animate-pulse"></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SensorVisual;
