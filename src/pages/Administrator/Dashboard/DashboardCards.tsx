import { FingerprintPattern, HandCoins, QrCode, Vote } from 'lucide-react';
import CardDataStats from '../../../components/CardDataStats';

const DashboardCards = () => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      <CardDataStats title="Total Voters" total="1500" rate="">
        <FingerprintPattern />
      </CardDataStats>
      <CardDataStats title="Total Exhibitors" total="31" rate="">
        <QrCode />
      </CardDataStats>
      <CardDataStats title="Total Votes Cast" total="1500" rate="">
        <Vote />
      </CardDataStats>
      <CardDataStats title=" Total Revenue" total="25,000" rate="">
        <HandCoins />
      </CardDataStats>
    </div>
  );
};

export default DashboardCards;
