import { Fingerprint, Store, Vote, Coins } from 'lucide-react';
import CardDataStats from '../../../components/CardDataStats';

interface DashboardCardsProps {
  totals: {
    voters: number;
    exhibitors: number;
    votes_cast: number;
    revenue: number;
  };
}

const DashboardCards = ({ totals }: DashboardCardsProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      <CardDataStats
        title="Verified Voters"
        total={totals.voters.toLocaleString()}
        rate="Live Sync"
        levelUp
      >
        <Fingerprint size={24} strokeWidth={2.5} />
      </CardDataStats>

      <CardDataStats
        title="Active Exhibitors"
        total={totals.exhibitors.toLocaleString()}
        rate="100% Active"
      >
        <Store size={24} strokeWidth={2.5} />
      </CardDataStats>

      <CardDataStats
        title="Total Votes"
        total={totals.votes_cast.toLocaleString()}
        rate="+12.5%"
        levelUp
      >
        <Vote size={24} strokeWidth={2.5} />
      </CardDataStats>

      <CardDataStats
        title="System Revenue"
        total={`₱${totals.revenue.toLocaleString()}`}
        rate="Locked"
      >
        <Coins size={24} strokeWidth={2.5} />
      </CardDataStats>
    </div>
  );
};

export default DashboardCards;
