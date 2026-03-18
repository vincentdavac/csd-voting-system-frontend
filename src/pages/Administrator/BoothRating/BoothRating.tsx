import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import BarGraphOverAllRanking from './BarGraphOverAllRanking';
import BarGraphPerProgram from './BarGraphPerProgram';
import BoothTable from './BoothTable';
import { useAuth } from '../../../context/AuthContext';
import API_BASE_URL from '../../../config/api';

const BoothRating = () => {
  const { authUser } = useAuth();
  const [programs, setPrograms] = useState<string[]>([]);
  const [exhibitorsData, setExhibitorsData] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!authUser?.token) return;

      try {
        const [programsRes, exhibitorsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/programs`, {
            method: 'GET',
            headers: { Accept: 'application/json' },
          }),
          fetch(`${API_BASE_URL}/booth-ratings/summary`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${authUser.token}`,
              Accept: 'application/json',
            },
          }),
        ]);

        if (programsRes.ok && exhibitorsRes.ok) {
          const programsJson = await programsRes.json();
          const exhibitorsJson = await exhibitorsRes.json();

          const programNames = programsJson.data
            .map((prog: any) => prog.name || prog.attributes?.name)
            .filter(Boolean);
          setPrograms(programNames);

          setExhibitorsData(exhibitorsJson.data || []);
        } else {
          console.error('Failed to fetch dashboard data for Booth Rating');
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, [authUser]);

  return (
    <div>
      <Breadcrumb pageName="Booth Rating" />

      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5 mb-4">
        <BarGraphOverAllRanking />
        
        {programs.map((program) => (
          <BarGraphPerProgram 
            key={program} 
            programName={program} 
            exhibitorsData={exhibitorsData} 
          />
        ))}
      </div>

      <BoothTable />
    </div>
  );
};

export default BoothRating;