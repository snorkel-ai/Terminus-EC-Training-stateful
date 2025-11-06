import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import OverviewStats from './OverviewStats';
import UserStatsTable from './UserStatsTable';
import SectionStats from './SectionStats';
import './AdminDashboard.css';

function AdminDashboard() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [sections, setSections] = useState([]);
  
  // Check admin from session metadata (Supabase pattern)
  const isAdmin = user?.user_metadata?.is_admin || false;

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }

    fetchDashboardData();
  }, [isAdmin, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all users with their stats
      const { data: usersData, error: usersError } = await supabase
        .from('v_admin_user_stats')  // Changed to new admin view
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;
      setUsers(usersData || []);

      // Fetch section stats
      const { data: sectionsData, error: sectionsError } = await supabase
        .from('v_section_stats')
        .select('*')
        .order('display_order');

      if (sectionsError) throw sectionsError;
      setSections(sectionsData || []);

      // Calculate overview stats
      const activeUsers7d = usersData?.filter(
        u => u.status === 'active'
      ).length || 0;

      const activeUsers30d = usersData?.filter(
        u => u.status === 'active' || u.status === 'inactive'
      ).length || 0;

      const avgCompletion = usersData?.reduce((sum, u) => {
        return sum + (parseFloat(u.completion_percentage) || 0);
      }, 0) / (usersData?.length || 1);

      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const newUsers7d = usersData?.filter(
        u => new Date(u.created_at) > weekAgo
      ).length || 0;

      setStats({
        totalUsers: usersData?.length || 0,
        activeUsers7d,
        activeUsers30d,
        avgCompletion: Math.round(avgCompletion),
        newUsers7d,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Monitor EC progress and engagement</p>
        </div>
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
      </div>

      {stats && <OverviewStats stats={stats} />}

      <div className="admin-sections">
        <UserStatsTable users={users} />
        <SectionStats sections={sections} />
      </div>
    </div>
  );
}

export default AdminDashboard;

