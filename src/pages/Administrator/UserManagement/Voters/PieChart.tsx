import { ApexOptions } from 'apexcharts';
import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useAuth } from '../../../../context/AuthContext';
import API_BASE_URL from '../../../../config/api';

const PieChart: React.FC = () => {
  const { authUser } = useAuth();
  const token = authUser?.token;

  const [series, setSeries] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const chartColors = ['#3C50E0', '#6577F3', '#8FD0EF', '#0FADCF', '#3056D3', '#80CAEE'];

  const options: ApexOptions = {
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'donut',
    },
    colors: chartColors,
    labels: labels,
    legend: { show: false, position: 'bottom' },
    plotOptions: {
      pie: { donut: { size: '65%', background: 'transparent' } },
    },
    dataLabels: { enabled: false },
    responsive: [
      { breakpoint: 2600, options: { chart: { width: 380 } } },
      { breakpoint: 640, options: { chart: { width: 200 } } },
    ],
  };

  useEffect(() => {
    const fetchPieData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/dashboard/stats`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok && data.status === 'success') {
          const chartData = data.data.votes_per_program;
          
          const activePrograms = chartData.filter((item: any) => item.votes > 0);
          
          setLabels(activePrograms.map((item: any) => item.program));
          setSeries(activePrograms.map((item: any) => item.votes));
        }
      } catch (error) {
        console.error('Failed to fetch pie chart data', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchPieData();
  }, [token]);

  return (
    <div className="sm:px-7.5 col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xl font-semibold text-black dark:text-white">
            Total Votes per Program
          </h5>
        </div>
      </div>

      <div className="mb-2">
        <div id="chartThree" className="mx-auto flex justify-center">
          {loading ? (
            <p>Loading chart...</p>
          ) : series.length > 0 ? (
            <ReactApexChart options={options} series={series} type="donut" />
          ) : (
            <p>No votes found.</p>
          )}
        </div>
      </div>

      <div className="-mx-8 flex flex-wrap items-center justify-center gap-y-3 mt-4">
        {!loading && labels.map((label, index) => {
          const total = series.reduce((a, b) => a + b, 0);
          const percentage = total > 0 ? Math.round((series[index] / total) * 100) : 0;

          return (
            <div key={index} className="sm:w-1/2 w-full px-8">
              <div className="flex w-full items-center">
                <span 
                  className="mr-2 block h-3 w-full max-w-3 rounded-full"
                  style={{ backgroundColor: chartColors[index % chartColors.length] }}
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