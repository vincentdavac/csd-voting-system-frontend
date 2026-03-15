import { ApexOptions } from 'apexcharts';
import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useAuth } from '../../../context/AuthContext';
import API_BASE_URL from '../../../config/api';

interface ExhibitorData {
  id: number;
  attributes: {
    project_title: string;
    votes_sum: number | null;
    program?: {
      name: string;
    };
  };
}

const BarGraphOverRanking: React.FC = () => {
  const { authUser } = useAuth();
  const [filter, setFilter] = useState<'top5' | 'top10' | 'all'>('top5');
  const [exhibitors, setExhibitors] = useState<ExhibitorData[]>([]);

  useEffect(() => {
    const fetchExhibitors = async () => {
      if (!authUser?.token) return;

      try {
        const res = await fetch(`${API_BASE_URL}/exhibitors`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authUser.token}`,
            Accept: 'application/json',
          },
        });

        if (res.ok) {
          const responseData = await res.json();
          setExhibitors(responseData.data || []);
        } else {
          console.error('Failed to fetch exhibitors');
        }
      } catch (error) {
        console.error('Error fetching exhibitors:', error);
      }
    };

    fetchExhibitors();
  }, [authUser]);

  // Sort exhibitors by votes_sum in descending order
  const sortedExhibitors = [...exhibitors].sort(
    (a, b) => (b.attributes.votes_sum || 0) - (a.attributes.votes_sum || 0)
  );

  // Apply Selected Filter
  let displayedExhibitors = sortedExhibitors;
  if (filter === 'top5') displayedExhibitors = sortedExhibitors.slice(0, 5);
  else if (filter === 'top10') displayedExhibitors = sortedExhibitors.slice(0, 10);

  // Define categories (X-axis) dynamically
  const categories = displayedExhibitors.map((ex) => ex.attributes.project_title);

  // Define Series ('IT', 'CS', 'IS', 'EMC') mapping dynamically
  const programsList = ['IT', 'CS', 'IS', 'EMC'];
  
  const series = programsList.map((prog) => {
    return {
      name: prog,
      data: displayedExhibitors.map((ex) => {
        const programName = ex.attributes.program?.name || '';
        // If the exhibitor belongs to this program, plot their votes. Otherwise, 0.
        const isMatch = programName.toUpperCase().includes(prog.toUpperCase());
        return isMatch ? (ex.attributes.votes_sum || 0) : 0;
      }),
    };
  });

  const options: ApexOptions = {
    colors: ['#3C50E0', '#80CAEE', '#10B981', '#F59E0B'], // Colors for the 4 programs
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'bar',
      height: 335,
      stacked: true,
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 0,
        columnWidth: '25%',
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'last',
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: categories.length > 0 ? categories : ['No Data'],
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      fontFamily: 'Satoshi',
      fontWeight: 500,
      fontSize: '14px',
      markers: { radius: 99 },
    },
    fill: { opacity: 1 },
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-12">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Overall Ranking
          </h4>
        </div>
        <div>
          <div className="relative z-20 inline-block">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="relative z-20 inline-flex appearance-none bg-transparent py-1 pl-3 pr-8 text-sm font-medium outline-none"
            >
              <option value="top5" className="dark:bg-boxdark">Top 5</option>
              <option value="top10" className="dark:bg-boxdark">Top 10</option>
              <option value="all" className="dark:bg-boxdark">All Exhibitors</option>
            </select>
            <span className="absolute top-1/2 right-3 z-10 -translate-y-1/2">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M0.47072 1.08816C0.47072 1.02932 0.500141 0.955772 0.54427 0.911642C0.647241 0.808672 0.809051 0.808672 0.912022 0.896932L4.85431 4.60386C4.92785 4.67741 5.06025 4.67741 5.14851 4.60386L9.09079 0.896932C9.19376 0.793962 9.35557 0.808672 9.45854 0.911642C9.56151 1.01461 9.5468 1.17642 9.44383 1.27939L5.50155 4.98632C5.22206 5.23639 4.78076 5.23639 4.51598 4.98632L0.558981 1.27939C0.50014 1.22055 0.47072 1.16171 0.47072 1.08816Z"
                  fill="#637381"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>

      <div>
        <div id="chartTwo" className="-ml-5 -mb-9">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default BarGraphOverRanking;