import { ApexOptions } from 'apexcharts';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { TRANSACTION } from './Transactions';

interface PieChartProps {
  transactions: TRANSACTION[];
}

const PieChart: React.FC<PieChartProps> = ({ transactions }) => {
  const [series, setSeries] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  useEffect(() => {
    const revenueMap: Record<string, number> = {};

    transactions.forEach((t) => {
      const label = t.yearLevel === null ? 'Visitor' : `Year ${t.yearLevel}`;
      if (!revenueMap[label]) revenueMap[label] = 0;
      revenueMap[label] += t.amountPaid;
    });

    const sortedLabels = Object.keys(revenueMap).sort((a, b) => {
      if (a === 'Visitor') return 1;
      if (b === 'Visitor') return -1;
      return a.localeCompare(b);
    });

    const revenueSeries = sortedLabels.map((label) => revenueMap[label]);

    setLabels(sortedLabels);
    setSeries(revenueSeries);
  }, [transactions]);

  const totalRevenue = series.reduce((a, b) => a + b, 0);

  const options: ApexOptions = {
    colors: ['#3C50E0', '#6577F3', '#80CAEE', '#0FADCF', '#F97316', '#EF4444'],
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
    labels: labels,
    legend: { show: false },
    stroke: { width: 0 },
    plotOptions: {
      pie: {
        donut: {
          size: '80%',
          background: 'transparent',
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,
              label: 'TOTAL REVENUE',
              fontSize: '10px',
              fontWeight: 900,
              color: '#64748B',
              formatter: function () {
                return `₱${totalRevenue.toLocaleString()}`;
              },
            },
            value: {
              show: true,
              fontSize: '20px',
              fontWeight: 900,
              color: '#1C2434',
              offsetY: 5,
              formatter: (val) => `₱${Number(val).toLocaleString()}`,
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
    tooltip: {
      theme: 'dark',
      y: {
        formatter: (val) => `₱${val.toLocaleString()}`,
      },
    },
    responsive: [
      { breakpoint: 2600, options: { chart: { width: 320 } } },
      { breakpoint: 640, options: { chart: { width: 240 } } },
    ],
  };

  return (
    <div className="col-span-12 rounded-[32px] border border-stroke bg-white p-8 shadow-2xl dark:border-strokedark dark:bg-boxdark xl:col-span-4 transition-all hover:shadow-primary/5">
      <div className="mb-8 flex items-center justify-between border-b border-stroke pb-6 dark:border-strokedark">
        <div>
          <h5 className="text-xl font-black text-black dark:text-white tracking-tight uppercase italic">
            Revenue Source
          </h5>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
            Breakdown by Year Level
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gray-50 dark:bg-meta-4">
          <span className="text-lg font-black text-primary">₱</span>
        </div>
      </div>

      <div className="mb-2">
        <div id="chartThree" className="mx-auto flex justify-center py-2">
          {series.length === 0 ? (
            <div className="flex h-[280px] items-center justify-center text-xs font-black text-gray-300 uppercase italic">
              Waiting for transactions...
            </div>
          ) : (
            <ReactApexChart options={options} series={series} type="donut" />
          )}
        </div>
      </div>

      <div className="mt-8 space-y-3">
        {labels.map((label, idx) => {
          const color = options.colors?.[idx % options.colors.length] || '#000';
          const amount = series[idx];
          const percentage =
            totalRevenue > 0 ? Math.round((amount / totalRevenue) * 100) : 0;

          return (
            <div
              key={label}
              className="group flex items-center justify-between rounded-2xl border border-transparent p-3 transition-all hover:bg-gray-50 dark:hover:bg-meta-4"
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-4 w-4 rounded-lg shadow-sm"
                  style={{
                    backgroundColor: color,
                    boxShadow: `0 0 12px ${color}44`,
                  }}
                ></div>
                <span className="text-xs font-black uppercase text-gray-500 dark:text-gray-400">
                  {label}
                </span>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-sm font-black text-black dark:text-white">
                  ₱{amount.toLocaleString()}
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
