import { FingerprintPattern, HandCoins, QrCode, Vote } from 'lucide-react';
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
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      <CardDataStats title="Total Voters" total={totals.voters.toLocaleString()} rate="">
        <FingerprintPattern />
      </CardDataStats>
      <CardDataStats title="Total Exhibitors" total={totals.exhibitors.toLocaleString()} rate="">
        <QrCode />
      </CardDataStats>
      <CardDataStats title="Total Votes Cast" total={totals.votes_cast.toLocaleString()} rate="">
        <Vote />
      </CardDataStats>
      <CardDataStats title="Total Revenue" total={`₱${totals.revenue.toLocaleString()}`} rate="">
        <HandCoins />
      </CardDataStats>
    </div>
  );
};

export default DashboardCards;