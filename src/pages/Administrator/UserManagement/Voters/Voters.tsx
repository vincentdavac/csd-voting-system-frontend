import Breadcrumb from '../../../../components/Breadcrumbs/Breadcrumb';
import LineChart from './LineChart';
import PieChart from './PieChart';
import VotersTable from './VotersTable';

const Voters = () => {
  return (
    <div>
      <Breadcrumb pageName="Voters" />
      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5 mb-4">
        <LineChart />
        <PieChart />
      </div>

      <VotersTable />
    </div>
  );
};

export default Voters;
