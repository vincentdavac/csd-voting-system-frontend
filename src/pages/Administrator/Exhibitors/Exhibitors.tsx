import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import BarGraph from './BarGraph';
import ExhibitorsTable from './ExhibitorsTable';
import PieChart from './PieChart';

const Exhibitors = () => {
  return (
    <div>
      <Breadcrumb pageName="Exhibitors" />

      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5 mb-4">
        <BarGraph />
        <PieChart />
      </div>

      <ExhibitorsTable />
    </div>
  );
};

export default Exhibitors;
