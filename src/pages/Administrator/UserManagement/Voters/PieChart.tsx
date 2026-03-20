import { ApexOptions } from 'apexcharts';
import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useAuth } from '../../../../context/AuthContext';
import API_BASE_URL from '../../../../config/api';
import { PieChart as PieIcon, Activity, Loader2 } from 'lucide-react';

const ProgramPieChart: React.FC = () => {
  const { authUser } = useAuth();
  const token = authUser?.token;

  const [series, setSeries] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Updated color palette: High-contrast professional blues and purples
  const chartColors = [
    '#3C50E0',
    '#80CAEE',
    '#6577F3',
    '#0FADCF',
    '#5E3BEE',
    '#213BB7',
  ];

  const options: ApexOptions = {
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'donut',
      toolbar: { show: false },
    },
    colors: chartColors,
    labels: labels,
    legend: { show: false },
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
              label: 'TOTAL VOTES',
              fontSize: '10px',
              fontWeight: '900',
              color: '#64748b',
              formatter: function (w) {
                return w.globals.seriesTotals
                  .reduce((a: number, b: number) => a + b, 0)
                  .toLocaleString();
              },
            },
            value: {
              show: true,
              fontSize: '24px',
              fontWeight: '900',
              color: '#1c2434', // Will adjust via CSS for dark mode
              offsetY: 5,
            },
          },
        },
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: false },
    states: {
      hover: { filter: { type: 'none' } },
    },
    tooltip: {
      enabled: true,
      theme: 'dark',
      y: {
        formatter: (val) => `${val} Votes`,
      },
    },
    responsive: [
      { breakpoint: 2600, options: { chart: { width: 340 } } },
      { breakpoint: 640, options: { chart: { width: 280 } } },
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
          const activePrograms = chartData.filter(
            (item: any) => item.votes > 0,
          );
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
    <div className="col-span-12 rounded-[32px] border border-stroke bg-white p-7.5 shadow-2xl dark:border-strokedark dark:bg-boxdark xl:col-span-4 flex flex-col">
      {/* HEADER WITH STATUS INDICATOR */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="text-primary animate-pulse" size={14} />
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
              Real-time Metrics
            </span>
          </div>
          <h5 className="text-xl font-black text-black dark:text-white uppercase italic tracking-tighter">
            Program Distribution
          </h5>
        </div>
        <div className="p-2 rounded-xl bg-gray-50 dark:bg-meta-4">
          <PieIcon className="text-gray-400" size={20} />
        </div>
      </div>

      {/* CHART AREA */}
      <div className="mb-6 flex-1 flex items-center justify-center min-h-[300px]">
        {loading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="animate-spin text-primary/20" size={40} />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Compiling Data...
            </p>
          </div>
        ) : series.length > 0 ? (
          <div id="chartThree" className="mx-auto">
            <ReactApexChart options={options} series={series} type="donut" />
          </div>
        ) : (
          <div className="text-center p-8 border-2 border-dashed border-stroke dark:border-strokedark rounded-[24px]">
            <p className="text-sm font-bold text-gray-400 uppercase italic">
              Zero Data Found in Registry
            </p>
          </div>
        )}
      </div>

      {/* CUSTOM TACTICAL LEGEND */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-3 pt-6 border-t border-stroke dark:border-strokedark">
        {!loading &&
          labels.map((label, index) => {
            const total = series.reduce((a, b) => a + b, 0);
            const percentage =
              total > 0 ? Math.round((series[index] / total) * 100) : 0;

            return (
              <div key={index} className="flex items-center gap-3 group">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0 shadow-sm transition-transform group-hover:scale-125"
                  style={{
                    backgroundColor: chartColors[index % chartColors.length],
                  }}
                ></span>
                <div className="flex flex-col min-w-0">
                  <span className="text-[9px] font-black text-gray-400 uppercase truncate tracking-tight group-hover:text-primary transition-colors">
                    {label}
                  </span>
                  <span className="text-sm font-black text-black dark:text-white italic leading-none">
                    {percentage}%
                  </span>
                </div>
              </div>
            );
          })}
      </div>

      {/* FOOTER METRIC */}
      {!loading && series.length > 0 && (
        <div className="mt-8 py-3 px-4 rounded-2xl bg-gray-50 dark:bg-meta-4/20 flex items-center justify-between border border-stroke dark:border-strokedark">
          <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">
            Integrity Verified
          </span>
          <span className="text-[8px] font-black text-primary uppercase italic tracking-tighter">
            Secure Link Active
          </span>
        </div>
      )}

      {/* DARK MODE CENTER TEXT FIX */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .dark .apexcharts-datalabel-value { fill: #ffffff !important; }
        .apexcharts-datalabel-label { fill: #64748b !important; }
      `,
        }}
      />
    </div>
  );
};

export default ProgramPieChart;
