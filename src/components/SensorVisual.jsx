import React from 'react';

const SensorVisual = ({ type, category, colors, wires = 3, housing = 'connector' }) => {
    const isRTD = category === 'rtd';
    const isIndustrialHead = isRTD || housing === 'head';

    // Helper to render wires
    const renderWires = (count, color = '#e2e8f0') => {
        const wireElements = [];
        const spacing = 6;
        const startY = -((count - 1) * spacing) / 2;

        for (let i = 0; i < count; i++) {
            // RTD Color Code Logic (IEC 60751)
            let wireColor = '#fff';
            if (count === 2) wireColor = i === 0 ? '#ef4444' : '#fff';
            if (count === 3) wireColor = i < 2 ? '#ef4444' : '#fff';
            if (count === 4) wireColor = i < 2 ? '#ef4444' : '#fff';

            wireElements.push(
                <div
                    key={i}
                    className="absolute h-1 bg-slate-400"
                    style={{
                        top: `calc(50% + ${startY + (i * spacing)}px)`,
                        left: -40,
                        width: 40,
                        backgroundColor: wireColor,
                        boxShadow: '0 1px 2px rgba(0,0,0,0.3)'
                    }}
                />
            );
        }
        return wireElements;
    };

    return (
        <div className="relative w-full h-64 flex items-center justify-center select-none overflow-hidden">
            {isIndustrialHead ? (
                // Industrial Head Visual (Shared for RTD and Industrial TC)
                <div className="flex items-center relative">
                    {/* Wires (Only visible for RTD usually, but we can show conduit entry for TC) */}
                    {isRTD && (
                        <div className="absolute left-2 top-0 w-full h-full z-0">
                            {renderWires(wires)}
                        </div>
                    )}

                    {/* TC Conduit Entry (if not RTD) */}
                    {!isRTD && (
                        <div className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-16 h-8 bg-gradient-to-r from-slate-800 to-slate-600 rounded-l z-0 border-y border-l border-slate-500">
                            {/* Threads */}
                            <div className="absolute right-2 top-0 w-1 h-full bg-black/20"></div>
                            <div className="absolute right-4 top-0 w-1 h-full bg-black/20"></div>
                        </div>
                    )}

                    {/* Connection Head (Industrial Style) */}
                    <div className="w-20 h-24 bg-gradient-to-br from-slate-300 via-slate-400 to-slate-600 rounded-xl shadow-2xl border border-slate-500 relative z-10 flex flex-col items-center">
                        {/* Cap */}
                        <div className="w-22 h-6 bg-slate-700 rounded-t-lg absolute -top-2 w-[110%] shadow-lg border-b border-slate-900"></div>

                        {/* Label */}
                        <div className="mt-8 w-12 h-8 bg-slate-200 border border-slate-400 rounded flex items-center justify-center shadow-inner">
                            <span className="text-[8px] font-mono font-bold text-slate-800 uppercase">
                                {isRTD ? 'Pt100' : `TC-${type}`}
                            </span>
                        </div>

                        {/* Cable Gland */}
                        <div className="absolute -left-3 bottom-4 w-4 h-6 bg-slate-700 rounded-l border-r border-slate-900 shadow-md"></div>
                    </div>

                    {/* Probe Sheath */}
                    <div className="w-56 h-6 bg-gradient-to-b from-slate-200 via-slate-100 to-slate-300 border-y border-slate-400 -ml-1 z-0 relative shadow-lg">
                        {/* Metallic Shine */}
                        <div className="absolute top-1 left-0 w-full h-1 bg-white/60 blur-[1px]"></div>

                        {/* Tip */}
                        <div className="absolute -right-3 top-[-1px] w-4 h-[calc(100%+2px)] bg-slate-300 rounded-r-full border-r border-y border-slate-400 shadow-sm"></div>

                        {/* Sensor Element (Internal X-ray view hint) */}
                        <div className={`absolute right-6 top-1/2 -translate-y-1/2 w-10 h-1.5 blur-[2px] animate-pulse ${isRTD ? 'bg-red-500/40' : 'bg-orange-500/60'}`}></div>
                    </div>
                </div>
            ) : (
                // Standard Thermocouple Visual: Connector + Wires
                <div className="flex items-center">
                    {/* Connector (Plug) */}
                    <div
                        className="w-20 h-28 rounded-lg shadow-2xl border-2 border-black/10 relative z-10 flex flex-col items-center justify-center gap-1"
                        style={{
                            backgroundColor: colors.connector || '#ccc',
                            backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0.1) 100%)'
                        }}
                    >
                        {/* Grip Lines */}
                        <div className="w-12 h-1 bg-black/10 rounded-full mb-1"></div>
                        <div className="w-12 h-1 bg-black/10 rounded-full mb-1"></div>
                        <div className="w-12 h-1 bg-black/10 rounded-full"></div>

                        {/* Pins */}
                        <div className="absolute -left-4 top-8 w-5 h-3 bg-yellow-600 rounded-l-sm shadow-sm"></div>
                        <div className="absolute -left-4 bottom-8 w-5 h-4 bg-yellow-600 rounded-l-sm shadow-sm"></div>

                        <div className="absolute bottom-2 right-2 text-[10px] font-bold text-white/90 drop-shadow-md uppercase tracking-widest">
                            {type}
                        </div>
                    </div>

                    {/* Wires */}
                    <div className="flex flex-col justify-center -ml-2 z-0">
                        {/* Positive Wire */}
                        <div
                            className="w-48 h-3 mb-1 shadow-md rounded-r-full relative overflow-hidden"
                            style={{ backgroundColor: colors.pos || '#f00' }}
                        >
                            <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20"></div>
                        </div>
                        {/* Negative Wire */}
                        <div
                            className="w-48 h-3 mt-1 shadow-md rounded-r-full relative overflow-hidden"
                            style={{ backgroundColor: colors.neg || '#00f' }}
                        >
                            <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20"></div>
                        </div>
                    </div>

                    {/* Hot Junction (Tip) */}
                    <div className="w-4 h-4 rounded-full bg-slate-400 border border-slate-600 -ml-2 z-10 shadow-lg relative flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse shadow-[0_0_10px_#f97316]"></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SensorVisual;
