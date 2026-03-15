import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/ClientHeader/index';

const ClientLayout: React.FC = () => {
  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark h-screen flex flex-col">
      {/* Header stays fixed */}
      <Header />

      {/* Main content scrolls only */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ClientLayout;