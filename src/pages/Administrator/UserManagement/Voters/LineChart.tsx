import { ApexOptions } from 'apexcharts';
import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useAuth } from '../../../../context/AuthContext';
import API_BASE_URL from '../../../../config/api';

interface ChartSeries {
  name: string;
  data: number[];
}

const LineChart: React.FC = () => {
  const { authUser } = useAuth();
  const token = authUser?.token;

  const [series, setSeries] = useState<ChartSeries[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const options: ApexOptions = {
    legend: { show: false, position: 'top', horizontalAlign: 'left' },
    colors: ['#3C50E0', '#80CAEE'],
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      height: 335,
      type: 'area',
      dropShadow: { enabled: true, color: '#623CEA14', top: 10, blur: 4, left: 0, opacity: 0.1 },
      toolbar: { show: false },
    },
    stroke: { width: [2, 2], curve: 'straight' },
    grid: { xaxis: { lines: { show: true } }, yaxis: { lines: { show: true } } },
    dataLabels: { enabled: false },
    markers: { size: 4, colors: '#fff', strokeColors: ['#3056D3', '#80CAEE'], strokeWidth: 3, fillOpacity: 1 },
    xaxis: {
      type: 'category',
      categories: categories, // Dynamically set (e.g., Mon, Tue, Wed)
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
    },
  };

  useEffect(() => {
    const fetchLineData = async () => {
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
          const chartData = data.data.revenue_chart;
          
          setCategories(chartData.map((item: any) => item.day));
          setSeries([
            {
              name: 'Total Revenue',
              data: chartData.map((item: any) => item.total),
            },
            {
              name: 'Total Sales',
              data: chartData.map((item: any) => item.sales),
            },
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch line chart data', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchLineData();
  }, [token]);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-primary">Total Revenue</p>
            </div>
          </div>
          <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-secondary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-secondary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-secondary">Total Sales</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div id="chartOne" className="-ml-5 mt-4">
          {loading ? (
            <p className="pl-10">Loading chart...</p>
          ) : (
            <ReactApexChart options={options} series={series} type="area" height={350} />
          )}
        </div>
      </div>
    </div>
  );
};

export default LineChart;