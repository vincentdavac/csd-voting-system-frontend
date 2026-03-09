import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import ProgramTable from './ProgramTable';

const Progam = () => {
  return (
    <div>
      <Breadcrumb pageName="Programs" />

      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5 mb-4"></div>
      <ProgramTable />
    </div>
  );
};

export default Progam;
