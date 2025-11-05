import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import './SectionStats.css';

function SectionStats({ sections }) {
  const chartData = sections
    .map(section => ({
      name: section.title.length > 20 
        ? section.title.substring(0, 20) + '...' 
        : section.title,
      fullName: section.title,
      rate: parseFloat(section.completion_rate) || 0,
      completed: section.completed_by,
      total: section.total_users,
    }))
    .sort((a, b) => a.rate - b.rate);

  const getBarColor = (rate) => {
    if (rate >= 75) return '#48bb78';
    if (rate >= 50) return '#4299e1';
    if (rate >= 25) return '#ed8936';
    return '#f56565';
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-title">{data.fullName}</p>
          <p className="tooltip-value">Completion: {data.rate.toFixed(1)}%</p>
          <p className="tooltip-detail">
            {data.completed} of {data.total} users
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="section-stats">
      <div className="section-stats-header">
        <h2>Section Completion Rates</h2>
        <p>Identify sections with low completion (potential issues)</p>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 120, right: 20, top: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} />
            <YAxis 
              type="category" 
              dataKey="name" 
              width={110}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="rate" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.rate)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="legend">
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#48bb78' }}></span>
          <span>75%+ (Good)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#4299e1' }}></span>
          <span>50-75% (Fair)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#ed8936' }}></span>
          <span>25-50% (Low)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#f56565' }}></span>
          <span>&lt;25% (Critical)</span>
        </div>
      </div>
    </div>
  );
}

export default SectionStats;

