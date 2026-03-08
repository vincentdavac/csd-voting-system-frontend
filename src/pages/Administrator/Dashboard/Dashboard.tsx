import BarGraphTopExhibitors from './BarGraphTopExhibitors';
import DashboardCards from './DashboardCards';
import PieChartTotalVotesPerProgram from './PieChartTotalVotesPerProgram';
import TotalRevenuePerHour from './TotalRevenuePerHour';

const Dashboard = () => {
  return (
    <div>
      <DashboardCards />
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <BarGraphTopExhibitors />
        <PieChartTotalVotesPerProgram />
        <TotalRevenuePerHour />
      </div>
    </div>
  );
};
export default Dashboard;
