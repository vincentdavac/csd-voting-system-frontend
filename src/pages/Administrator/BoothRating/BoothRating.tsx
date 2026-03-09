import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import BarGraphOverRanking from './BarGraphOverAllRanking';
import BarGraphPerProgram from './BarGraphPerProgram';
import BoothTable from './BoothTable';

const BoothRating = () => {
  return (
    <div>
      <Breadcrumb pageName="Booth Rating" />

      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5 mb-4">
        <BarGraphOverRanking />
        <BarGraphPerProgram />
        <BarGraphPerProgram />
        <BarGraphPerProgram />
        <BarGraphPerProgram />
      </div>
      <BoothTable />
    </div>
  );
};

export default BoothRating;
