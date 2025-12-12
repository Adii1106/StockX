import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PriceChart = ({ data, currencySymbol = '$', rate = 1 }) => {
    if (!data || data.length === 0) {
        return <div className="card" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>No chart data available</div>;
    }

    // Convert data for chart
    const chartData = data.map(item => ({
        ...item,
        price: item.price * rate
    }));

    // Determine color based on trend (first vs last)
    const startPrice = chartData[0].price;
    const endPrice = chartData[chartData.length - 1].price;
    const isPositive = endPrice >= startPrice;
    const color = isPositive ? '#10b981' : '#ef4444';

    return (
        <div className="card" style={{ height: '400px', padding: '20px 20px 20px 5px' }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={chartData}
                    margin={{
                        top: 10,
                        right: 0,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                        dataKey="date"
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                        minTickGap={30}
                    />
                    <YAxis
                        domain={['auto', 'auto']}
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(number) => `${currencySymbol}${number.toFixed(0)}`}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                        itemStyle={{ color: '#f8fafc' }}
                        labelStyle={{ color: '#94a3b8', marginBottom: '5px' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="price"
                        stroke={color}
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorPrice)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PriceChart;
