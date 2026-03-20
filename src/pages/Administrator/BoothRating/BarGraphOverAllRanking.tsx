import { ApexOptions } from 'apexcharts';
import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useAuth } from '../../../context/AuthContext';
import API_BASE_URL from '../../../config/api';
import { BarChart3, ChevronDown, Filter } from 'lucide-react';

interface BoothRatingData {
  id: number;
  attributes: {
    project_title: string;
    ratings_sum: number | null;
    program?: {
      name: string;
    };
  };
}

const BarGraphOverAllRanking: React.FC = () => {
  const { authUser } = useAuth();
  const [filter, setFilter] = useState<'top5' | 'top10' | 'all'>('top5');
  const [exhibitors, setExhibitors] = useState<BoothRatingData[]>([]);

  useEffect(() => {
    const fetchExhibitors = async () => {
      if (!authUser?.token) return;
      try {
        const res = await fetch(`${API_BASE_URL}/booth-ratings/summary`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authUser.token}`,
            Accept: 'application/json',
          },
        });
        if (res.ok) {
          const responseData = await res.json();
          setExhibitors(responseData.data || []);
        }
      } catch (error) {
        console.error('Error fetching summary:', error);
      }
    };
    fetchExhibitors();
  }, [authUser]);

  const sortedExhibitors = [...exhibitors].sort(
    (a, b) => (b.attributes.ratings_sum || 0) - (a.attributes.ratings_sum || 0),
  );

  let displayedExhibitors = sortedExhibitors;
  if (filter === 'top5') displayedExhibitors = sortedExhibitors.slice(0, 5);
  else if (filter === 'top10')
    displayedExhibitors = sortedExhibitors.slice(0, 10);

  const categories = displayedExhibitors.map(
    (ex) => ex.attributes.project_title,
  );
  const programsList = ['IT', 'CS', 'IS', 'EMC'];

  const series = programsList.map((prog) => ({
    name: prog,
    data: displayedExhibitors.map((ex) => {
      const programName = ex.attributes.program?.name || '';
      return programName.toUpperCase().includes(prog.toUpperCase())
        ? ex.attributes.ratings_sum || 0
        : 0;
    }),
  }));

  const options: ApexOptions = {
    colors: ['#3C50E0', '#80CAEE', '#10B981', '#F59E0B'],
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
        borderRadius: 6,
        columnWidth: '22%',
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'last',
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: categories.length > 0 ? categories : ['No Data'],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { fontSize: '12px', fontWeight: 600 },
      },
    },
    yaxis: {
      title: { text: 'Total Rating Sum', style: { fontWeight: 600 } },
    },
    grid: {
      strokeDashArray: 5,
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      fontFamily: 'Satoshi',
      fontWeight: 700,
      fontSize: '12px',
      markers: { radius: 6, width: 12, height: 12 },
      itemMargin: { horizontal: 10 },
    },
    fill: { opacity: 1 },
    tooltip: {
      theme: 'dark',
      y: { formatter: (val) => `${val} Points` },
    },
  };

  return (
    <div className="col-span-12 rounded-[32px] border border-stroke bg-white p-8 shadow-2xl dark:border-strokedark dark:bg-boxdark">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-meta-2 text-primary dark:bg-meta-4">
            <BarChart3 size={24} />
          </div>
          <div>
            <h4 className="text-xl font-black text-black dark:text-white tracking-tight">
              Overall Project Ranking
            </h4>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Exhibitor Performance
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-stroke bg-gray-50 px-3 py-2 dark:border-strokedark dark:bg-meta-4">
            <Filter size={14} className="text-gray-400" />
            <select
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value as 'top5' | 'top10' | 'all')
              }
              className="bg-transparent text-sm font-bold text-black outline-none dark:text-white"
            >
              <option value="top5">Top 5 Only</option>
              <option value="top10">Top 10 Only</option>
              <option value="all">View All</option>
            </select>
          </div>
        </div>
      </div>

      <div className="relative">
        <div id="boothChartOverall" className="-ml-4">
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

export default BarGraphOverAllRanking;
