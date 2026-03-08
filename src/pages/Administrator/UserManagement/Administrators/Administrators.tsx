import Breadcrumb from '../../../../components/Breadcrumbs/Breadcrumb';
import AdminTable from './AdminTable';

const Administrators = () => {
  return (
    <div>
      <Breadcrumb pageName="Administrators" />

      <AdminTable />
    </div>
  );
};

export default Administrators;
