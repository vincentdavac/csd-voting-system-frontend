import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import BarChart from './BarChart';
import PieChart from './PieChart';
import TransactionsTable from './TransactionsTable';

const Transactions = () => {
  return (
    <div>
      <Breadcrumb pageName="Transactions" />
      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5 mb-4">
        <BarChart />
        <PieChart />
      </div>

      <TransactionsTable />
    </div>
  );
};

export default Transactions;
