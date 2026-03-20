import { ApexOptions } from 'apexcharts';
import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useAuth } from '../../../context/AuthContext';
import API_BASE_URL from '../../../config/api';

interface ChartDataState {
  series: number[];
  labels: string[];
}

// Higher contrast, premium palette
const PREDEFINED_COLORS = [
  '#3C50E0',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
  '#F472B6',
  '#0EA5E9',
  '#64748B',
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
        const res = await fetch(
          `${API_BASE_URL}/exhibitors/grouped-by-program`,
          {
            headers: {
              Authorization: `Bearer ${authUser.token}`,
              Accept: 'application/json',
            },
          },
        );
        const json = await res.json();

        if (json.data) {
          const activePrograms = json.data.filter(
            (item: any) => item.exhibitors.length > 0,
          );
          const labels = activePrograms.map((item: any) => item.program.name);
          const series = activePrograms.map(
            (item: any) => item.exhibitors.length,
          );
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

  const total = chartData.series.reduce((acc, val) => acc + val, 0);
  const chartColors = PREDEFINED_COLORS.slice(0, chartData.labels.length || 4);

  const options: ApexOptions = {
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'donut',
      dropShadow: {
        enabled: true,
        color: '#000',
        top: 10,
        left: 0,
        blur: 10,
        opacity: 0.1,
      },
    },
    colors: chartColors,
    labels: chartData.labels,
    legend: { show: false },
    stroke: { width: 0 }, // Removes the white gaps between slices for a smoother look
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
          background: 'transparent',
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,
              label: 'TOTAL',
              fontSize: '12px',
              fontWeight: 900,
              color: '#64748B',
              formatter: function () {
                return total.toString();
              },
            },
            value: {
              show: true,
              fontSize: '24px',
              fontWeight: 900,
              color: '#1C2434', // Update based on dark mode if needed
              offsetY: 5,
            },
          },
        },
      },
    },
    dataLabels: { enabled: false },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        shadeIntensity: 0.5,
        opacityFrom: 1,
        opacityTo: 0.8,
        stops: [0, 100],
      },
    },
    tooltip: { theme: 'dark' },
    responsive: [
      { breakpoint: 2600, options: { chart: { width: 340 } } },
      { breakpoint: 640, options: { chart: { width: 240 } } },
    ],
  };

  return (
    <div className="col-span-12 rounded-[32px] border border-stroke bg-white p-8 shadow-2xl dark:border-strokedark dark:bg-boxdark xl:col-span-6 transition-all hover:shadow-primary/5">
      <div className="mb-6 flex items-center justify-between border-b border-stroke pb-6 dark:border-strokedark">
        <div>
          <h5 className="text-xl font-black text-black dark:text-white tracking-tight uppercase italic">
            Program Mix
          </h5>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
            Departmental share
          </p>
        </div>
        <div className="rounded-full bg-primary/10 px-4 py-1 text-[10px] font-black text-primary">
          LIVE STATS
        </div>
      </div>

      <div className="mb-2">
        <div id="chartThree" className="mx-auto flex justify-center py-4">
          {loading ? (
            <div className="flex h-[280px] flex-col items-center justify-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="text-[10px] font-black text-gray-400 uppercase">
                Loading Data
              </p>
            </div>
          ) : chartData.series.length === 0 ? (
            <div className="flex h-[280px] items-center justify-center text-xs font-black text-gray-300 uppercase italic">
              No exhibitors registered
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

      {/* LEGEND GRID */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        {chartData.labels.map((label, index) => {
          const value = chartData.series[index];
          const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
          const color = chartColors[index % chartColors.length];

          return (
            <div
              className="group flex flex-col gap-1 rounded-2xl border border-transparent p-3 transition-all hover:bg-gray-50 dark:hover:bg-meta-4"
              key={label}
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full ring-4 ring-opacity-20"
                  style={{
                    backgroundColor: color,
                    boxShadow: `0 0 10px ${color}66`,
                  }}
                ></span>
                <span className="text-[11px] font-black uppercase text-gray-500 dark:text-gray-400">
                  {label}
                </span>
              </div>
              <div className="flex items-end justify-between px-4">
                <span className="text-lg font-black text-black dark:text-white leading-none">
                  {value}
                </span>
                <span className="text-[10px] font-bold text-primary dark:text-blue-400">
                  {percentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PieChart;
