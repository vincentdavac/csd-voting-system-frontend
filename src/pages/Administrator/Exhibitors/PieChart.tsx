import { ApexOptions } from 'apexcharts';
import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useAuth } from '../../../context/AuthContext';
import API_BASE_URL from '../../../config/api';

interface ChartDataState {
  series: number[];
  labels: string[];
}

const PREDEFINED_COLORS = [
  '#3C50E0', '#6577F3', '#8FD0EF', '#0FADCF', 
  '#14B8A6', '#F59E0B', '#EF4444', '#8B5CF6'
];

const PieChart: React.FC = () => {
  const { authUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<ChartDataState>({
    series: [],
    labels: [],
  });

  useEffect(() => {
    const fetchGraphData = async () => {
      if (!authUser?.token) return;
      try {
        const res = await fetch(`${API_BASE_URL}/exhibitors/grouped-by-program`, {
          headers: {
            Authorization: `Bearer ${authUser.token}`,
            Accept: 'application/json',
          },
        });
        const json = await res.json();

        if (json.data) {
          const activePrograms = json.data.filter((item: any) => item.exhibitors.length > 0);

          const labels = activePrograms.map((item: any) => item.program.name);
          const series = activePrograms.map((item: any) => item.exhibitors.length);

          setChartData({ series, labels });
        }
      } catch (error) {
        console.error('Error fetching pie chart data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGraphData();
  }, [authUser?.token]);

  const chartColors = PREDEFINED_COLORS.slice(0, chartData.labels.length || 4);

  const options: ApexOptions = {
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'donut',
    },
    colors: chartColors,
    labels: chartData.labels,
    legend: {
      show: false,
      position: 'bottom',
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          background: 'transparent',
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 2600,
        options: {
          chart: {
            width: 380,
          },
        },
      },
      {
        breakpoint: 640,
        options: {
          chart: {
            width: 200,
          },
        },
      },
    ],
  };

  const total = chartData.series.reduce((acc, val) => acc + val, 0);

  return (
    <div className="sm:px-7.5 col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-6">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xl font-semibold text-black dark:text-white">
            Exhibitor Distribution
          </h5>
        </div>
      </div>

      <div className="mb-2">
        <div id="chartThree" className="mx-auto flex justify-center">
          {loading ? (
             <div className="flex h-[250px] items-center justify-center text-gray-500">
               Loading chart...
             </div>
          ) : chartData.series.length === 0 ? (
             <div className="flex h-[250px] items-center justify-center text-gray-500 italic">
               No data available
             </div>
          ) : (
            <ReactApexChart
              options={options}
              series={chartData.series}
              type="donut"
            />
          )}
        </div>
      </div>

      <div className="-mx-8 flex flex-wrap items-center justify-center gap-y-3 mt-4">
        {chartData.labels.map((label, index) => {
          const value = chartData.series[index];
          const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
          const dotColor = chartColors[index % chartColors.length];

          return (
            <div className="sm:w-1/2 w-full px-8" key={label}>
              <div className="flex w-full items-center">
                <span 
                  className="mr-2 block h-3 w-full max-w-3 rounded-full" 
                  style={{ backgroundColor: dotColor }}
                ></span>
                <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
                  <span> {label} </span>
                  <span> {percentage}% </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PieChart;