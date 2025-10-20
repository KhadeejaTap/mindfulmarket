
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ImpactMetric } from '../types';

interface ImpactChartProps {
  data: ImpactMetric[];
}

const ImpactChart: React.FC<ImpactChartProps> = ({ data }) => {
  
  const chartData = data.map(item => ({
      name: item.metric.replace(' ', '\n'),
      Score: item.score,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-lg">
          <p className="font-bold text-gray-800">{`${label.replace('\n', ' ')}`}</p>
          <p className="text-emerald-600">{`Score: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{
          top: 5,
          right: 20,
          left: -10,
          bottom: 5,
        }}
        barCategoryGap={ "20%" }
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
        <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(236, 252, 241, 0.5)'}} />
        <Legend wrapperStyle={{fontSize: "14px"}}/>
        <Bar dataKey="Score" fill="#10B981" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ImpactChart;
