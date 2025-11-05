import { useState } from 'react';
import './UserStatsTable.css';

function UserStatsTable({ users }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  const filteredUsers = users
    .filter(user => {
      const matchesSearch = 
        user.github_username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (sortBy === 'completion_percentage') {
        aVal = parseFloat(aVal) || 0;
        bVal = parseFloat(bVal) || 0;
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: { bg: '#f0fff4', color: '#22543d', border: '#48bb78' },
      inactive: { bg: '#fffaf0', color: '#744210', border: '#ed8936' },
      dormant: { bg: '#fff5f5', color: '#742a2a', border: '#f56565' },
    };

    const style = styles[status] || styles.dormant;

    return (
      <span
        className="status-badge"
        style={{
          background: style.bg,
          color: style.color,
          borderColor: style.border,
        }}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="user-stats-table">
      <div className="table-header">
        <h2>User Progress</h2>
        <div className="table-controls">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="dormant">Dormant</option>
          </select>
        </div>
      </div>

      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('github_username')}>
                Name {sortBy === 'github_username' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('created_at')}>
                Joined {sortBy === 'created_at' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('last_active')}>
                Last Active {sortBy === 'last_active' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('completion_percentage')}>
                Progress {sortBy === 'completion_percentage' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('status')}>
                Status {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="user-cell">
                    {user.github_avatar_url && (
                      <img
                        src={user.github_avatar_url}
                        alt={user.github_username}
                        className="user-avatar-small"
                      />
                    )}
                    <div>
                      <div className="user-name">{user.github_username || 'Unknown'}</div>
                      <div className="user-email">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td>{formatDate(user.created_at)}</td>
                <td>{formatDate(user.last_active)}</td>
                <td>
                  <div className="progress-cell">
                    <div className="progress-bar-mini">
                      <div
                        className="progress-fill-mini"
                        style={{ width: `${user.completion_percentage || 0}%` }}
                      />
                    </div>
                    <span className="progress-text">
                      {user.completion_percentage || 0}%
                    </span>
                  </div>
                </td>
                <td>{getStatusBadge(user.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="no-results">
            No users found matching your criteria
          </div>
        )}
      </div>

      <div className="table-footer">
        Showing {filteredUsers.length} of {users.length} users
      </div>
    </div>
  );
}

export default UserStatsTable;

