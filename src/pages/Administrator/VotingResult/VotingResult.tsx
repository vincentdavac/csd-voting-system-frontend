import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import BarGraphOverRanking from './BarGraphOverRanking';
import BarGraphPerProgram from './BarGraphPerProgram';
import VotingTable from './VotingTable';

const VotingResult = () => {
  return (
    <div>
      <Breadcrumb pageName="Voting Result" />

      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5 mb-4">
        <BarGraphOverRanking />
        <BarGraphPerProgram />
        <BarGraphPerProgram />
        <BarGraphPerProgram />
        <BarGraphPerProgram />
      </div>

      <VotingTable />
    </div>
  );
};

export default VotingResult;
