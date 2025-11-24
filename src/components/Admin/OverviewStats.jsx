import './OverviewStats.css';

function OverviewStats({ stats }) {
  const statCards = [
    {
      label: 'Total ECs',
      value: stats.totalUsers,
      icon: '👥',
      color: '#667eea',
    },
    {
      label: 'Active (7 days)',
      value: stats.activeUsers7d,
      icon: '⚡',
      color: '#48bb78',
    },
    {
      label: 'Active (30 days)',
      value: stats.activeUsers30d,
      icon: '📊',
      color: '#4299e1',
    },
    {
      label: 'Avg Completion',
      value: `${stats.avgCompletion}%`,
      icon: '🎯',
      color: '#ed8936',
    },
    {
      label: 'New (7 days)',
      value: stats.newUsers7d,
      icon: '🆕',
      color: '#9f7aea',
    },
  ];

  return (
    <div className="overview-stats">
      {statCards.map((stat, index) => (
        <div key={index} className="stat-card" style={{ borderTopColor: stat.color }}>
          <div className="stat-icon">{stat.icon}</div>
          <div className="stat-content">
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value">{stat.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default OverviewStats;

