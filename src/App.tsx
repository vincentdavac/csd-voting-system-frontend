import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
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
    </Routes>
  );
}

export default App;
