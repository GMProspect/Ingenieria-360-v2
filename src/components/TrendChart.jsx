import React from 'react';
const lastItem = data[0];
if (lastItem?.data?.voltageRating === 'hv' || lastItem?.data?.voltageRating === 'mv') {
    dangerLine = 100;
    warningLine = 500;
}

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl">
                <p className="text-slate-300 text-xs mb-1">{payload[0].payload.fullDate}</p>
                <p className="text-cyan-400 font-bold text-lg">
                    {payload[0].value} {payload[0].payload.unit}
                </p>
                {payload[0].payload.rating && (
                    <p className="text-slate-500 text-xs uppercase mt-1">
                        Rating: {payload[0].payload.rating}
                    </p>
                )}
            </div>
        );
    }
    return null;
};

return (
    <div className="w-full h-[400px] bg-slate-900/50 rounded-2xl border border-white/5 p-4 backdrop-blur-sm">
        <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-4 text-center">
            Tendencia de Aislamiento (MΩ)
        </h3>
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis
                    dataKey="date"
                    stroke="#94a3b8"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#94a3b8"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 'auto']}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />

                {/* Reference Lines */}
                <ReferenceLine y={dangerLine} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Mínimo', fill: '#ef4444', fontSize: 10 }} />
                <ReferenceLine y={warningLine} stroke="#eab308" strokeDasharray="3 3" label={{ value: 'Alerta', fill: '#eab308', fontSize: 10 }} />

                <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#22d3ee"
                    strokeWidth={3}
                    dot={{ fill: '#22d3ee', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#fff' }}
                    name="Resistencia"
                />
            </LineChart>
        </ResponsiveContainer>
    </div>
);
};

export default TrendChart;
