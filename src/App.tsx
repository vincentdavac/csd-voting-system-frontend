import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import PageTitle from './components/PageTitle';
import Alerts from './pages/UiElements/Alerts';
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
import GlobalSettings from './pages/Administrator/GlobalSettings/GlobalSettings';
import ClientLayout from './layout/ClientLayout';
import ClientSignUp from './pages/Client/Authentication/SignUp';
import ClientSignIn from './pages/Client/Authentication/SignIn';
import ClientForgetPassword from './pages/Client/Authentication/ForgetPassword';
import ClientDashBoard from './pages/Client/Dashboard/index';
import TopUpPoints from './pages/Client/TopUpPoints';
import QRCodeScanner from './pages/Client/QRCodeScanner';
import ClientTransactions from './pages/Client/Transactions/Transactions';
import { Navigate } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Routes>
      {/* 1. ROOT REDIRECT: Decide where to send users visiting "/" */}
      <Route path="/" element={<Navigate to="/client/signin" replace />} />

      {/* Guest-only routes */}
      <Route element={<ProtectedRoute guestOnly />}>
        {/* Admin Auth */}
        <Route
          path="/admin/signin"
          element={
            <>
              <PageTitle title="Sign In | CSD" />
              <AdminSignIn />
            </>
          }
        />
        <Route
          path="/admin/signup"
          element={
            <>
              <PageTitle title="Sign Up | CSD" />
              <AdminSignUp />
            </>
          }
        />
        <Route
          path="/admin/forget-password"
          element={
            <>
              <PageTitle title="Forget Password | CSD" />
              <AdminForgetPassword />
            </>
          }
        />

        {/* Client Auth */}
        <Route
          path="/client/signin"
          element={
            <>
              <PageTitle title="Sign In | CSD" />
              <ClientSignIn />
            </>
          }
        />
        <Route
          path="/client/signup"
          element={
            <>
              <PageTitle title="Sign Up | CSD" />
              <ClientSignUp />
            </>
          }
        />
        <Route
          path="/client/forget-password"
          element={
            <>
              <PageTitle title="Forget Password | CSD" />
              <ClientForgetPassword />
            </>
          }
        />
      </Route>

      {/* Admin-only routes */}
      <Route element={<ProtectedRoute role="admin" />}>
        <Route element={<DefaultLayout />}>
          <Route path="admin/dashboard" element={<Dashboard />} />
          <Route path="admin/user-management/voters" element={<Voters />} />
          <Route element={<ProtectedRoute superAdminOnly />}>
            <Route
              path="admin/user-management/administrators"
              element={<Administrators />}
            />
            <Route path="admin/global-settings" element={<GlobalSettings />} />
            <Route path="admin/exhibitors" element={<Exhibitors />} />
            <Route path="admin/voting-results" element={<VotingResult />} />
            <Route path="admin/booth-rating" element={<BoothRating />} />
          </Route>
          <Route path="admin/transactions" element={<Transactions />} />
          <Route path="admin/programs" element={<ProgramTable />} />
          <Route path="admin/voters" element={<Voters />} />
        </Route>
      </Route>

      {/* Client-only routes */}
      <Route element={<ProtectedRoute role="client" />}>
        <Route element={<ClientLayout />}>
          <Route path="client/dashboard" element={<ClientDashBoard />} />
          <Route path="client/top-up-points" element={<TopUpPoints />} />
          <Route path="client/qr-code-scanner" element={<QRCodeScanner />} />
          <Route path="client/transactions" element={<ClientTransactions />} />
        </Route>
      </Route>

      {/* Catch-all */}
      <Route
        path="*"
        element={
          <>
            <PageTitle title="404 Not Found" />
            <PageNotFound />
          </>
        }
      />
      <Route path="/ui/alerts" element={<Alerts />} />
    </Routes>
  );
}

export default App;
