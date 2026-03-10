import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/ECommerce';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import DefaultLayout from './layout/DefaultLayout';
import AdminSignIn from './pages/Administrator/Authentication/SignIn';
import AdminSignUp from './pages/Administrator/Authentication/SignUp';
import AdminForgetPassword from './pages/Administrator/Authentication/ForgetPassword';
import PageNotFound from './pages/404PageNotFound/404PageNotFound';
import Dashboard from './pages/Administrator/Dashboard/Dashboard';
import Voters from './pages/Administrator/UserManagement/Voters/Voters';
import Administrators from './pages/Administrator/UserManagement/Administrators/Administrators';
import Exhibitors from './pages/Administrator/Exhibitors/Exhibitors';
import Transactions from './pages/Administrator/Transactions/Transactions';
import ProgramTable from './pages/Administrator/Program/ProgramTable';
import VotingResult from './pages/Administrator/VotingResult/VotingResult';
import BoothRating from './pages/Administrator/BoothRating/BoothRating';
import ClientLayout from './layout/ClientLayout';
import ClientSignUp from './pages/Client/Authentication/SignUp';
import ClientSignIn from './pages/Client/Authentication/SignIn';
import ClientForgetPassword from './pages/Client/Authentication/ForgetPassword';
import ClientDashBoard from './pages/Client/Dashboard/index';
import TopUpPoints from './pages/Client/TopUpPoints';
import QRCodeScanner from './pages/Client/QRCodeScanner';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <Routes>
      {/* Admin Routes */}
      <Route
        path="/admin/signin"
        element={
          <>
            <PageTitle title="Sign In | CSD Voting System" />
            <AdminSignIn />
          </>
        }
      />
      <Route
        path="/admin/signup"
        element={
          <>
            <PageTitle title="Sign Up | CSD Voting System" />
            <AdminSignUp />
          </>
        }
      />
      <Route
        path="/admin/forget-password"
        element={
          <>
            <PageTitle title="Forget Password | CSD Voting System" />
            <AdminForgetPassword />
          </>
        }
      />
      <Route path="/" element={<DefaultLayout />}>
        <Route
          index
          element={
            <>
              <PageTitle title="Dashboard | CSD Voting System" />
              <Dashboard />
            </>
          }
        />
        <Route
          path="admin/dashboard"
          element={
            <>
              <PageTitle title="Dashboard | CSD Voting System" />
              <Dashboard />
            </>
          }
        />
        <Route
          path="admin/user-management/voters"
          element={
            <>
              <PageTitle title="Voters | CSD Voting System" />
              <Voters />
            </>
          }
        />
        <Route
          path="admin/user-management/administrators"
          element={
            <>
              <PageTitle title="Administrators | CSD Voting System" />
              <Administrators />
            </>
          }
        />
        <Route
          path="admin/transactions"
          element={
            <>
              <PageTitle title="Transactions | CSD Voting System" />
              <Transactions />
            </>
          }
        />

        <Route
          path="admin/exhibitors"
          element={
            <>
              <PageTitle title="Exhibitors | CSD Voting System" />
              <Exhibitors />
            </>
          }
        />

        <Route
          path="admin/voting-results"
          element={
            <>
              <PageTitle title="Voting Results | CSD Voting System" />
              <VotingResult />
            </>
          }
        />

        <Route
          path="admin/booth-rating"
          element={
            <>
              <PageTitle title="Booth Rating | CSD Voting System" />
              <BoothRating />
            </>
          }
        />

        <Route
          path="admin/programs"
          element={
            <>
              <PageTitle title="Programs | CSD Voting System" />
              <ProgramTable />
            </>
          }
        />

        <Route
          path="admin/voters"
          element={
            <>
              <PageTitle title="Voters | CSD Voting System" />
              <Voters />
            </>
          }
        />

        <Route
          index
          element={
            <>
              <PageTitle title="Dashboard" />
              <ECommerce />
            </>
          }
        />

        <Route path="/calendar" element={<Calendar />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/forms/form-elements" element={<FormElements />} />
        <Route path="/forms/form-layout" element={<FormLayout />} />
        <Route path="/tables" element={<Tables />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/chart" element={<Chart />} />
        <Route path="/ui/alerts" element={<Alerts />} />
        <Route path="/ui/buttons" element={<Buttons />} />
      </Route>

      <Route path="/" element={<ClientLayout />}>
        <Route
          index
          element={
            <>
              <PageTitle title="Dashboard | CSD Voting System" />
              <Dashboard />
            </>
          }
        />

        {/* Client Routes */}
        <Route
          path="client/dashboard"
          element={
            <>
              <PageTitle title="Dashboard | CSD Voting System" />
              <ClientDashBoard />
            </>
          }
        />

        <Route
          path="client/top-up-points"
          element={
            <>
              <PageTitle title="Top Up Points | CSD Voting System" />
              <TopUpPoints />
            </>
          }
        />

        <Route
          path="client/qr-code-scanner"
          element={
            <>
              <PageTitle title="QR Code Scanner | CSD Voting System" />
              <QRCodeScanner />
            </>
          }
        />
      </Route>

      <Route
        path="/client/signup"
        element={
          <>
            <PageTitle title="Sign Up | CSD Voting System" />
            <ClientSignUp />
          </>
        }
      />
      <Route
        path="/client/signin"
        element={
          <>
            <PageTitle title="Sign In | CSD Voting System" />
            <ClientSignIn />
          </>
        }
      />
      <Route
        path="/client/forget-password"
        element={
          <>
            <PageTitle title="Forget Password | CSD Voting System" />
            <ClientForgetPassword />
          </>
        }
      />

      {/* 404 Not Found - Catch All */}
      <Route
        path="*"
        element={
          <>
            <PageTitle title="404 Not Found | CSD Voting System" />
            <PageNotFound />
          </>
        }
      />
    </Routes>
  );
}

export default App;
