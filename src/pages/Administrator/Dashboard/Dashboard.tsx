import { useEffect, useState } from 'react';
import BarGraphTopExhibitors from './BarGraphTopExhibitors';
import DashboardCards from './DashboardCards';
import PieChartTotalVotesPerProgram from './PieChartTotalVotesPerProgram';
import TotalRevenuePerHour from './TotalRevenuePerHour';
import { useAuth } from '../../../context/AuthContext';
import API_BASE_URL from '../../../config/api';
import VotingLoader from '../../../common/Loader/VotingLoader';

const Dashboard = () => {
  const { authUser } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!authUser?.token) return;
      try {
        const res = await fetch(`${API_BASE_URL}/dashboard/stats`, {
          headers: {
            Authorization: `Bearer ${authUser.token}`,
            Accept: 'application/json',
          },
        });
        const json = await res.json();
        if (json.data) {
          setStats(json.data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [authUser?.token]);

  if (loading || !stats) {
    return (
      <VotingLoader
        title="Loading Dashboard"
        description="Fetching dashboard records..."
      />
    );
  }

  return (
    <div>
      <DashboardCards totals={stats.totals} />
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <BarGraphTopExhibitors data={stats.top_exhibitors} />
        <PieChartTotalVotesPerProgram data={stats.votes_per_program} />
        <TotalRevenuePerHour data={stats.revenue_chart} />
      </div>
    </div>
  );
};

export default Dashboard;
