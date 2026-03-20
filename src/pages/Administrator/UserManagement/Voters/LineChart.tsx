import { ApexOptions } from 'apexcharts';
import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useAuth } from '../../../../context/AuthContext';
import API_BASE_URL from '../../../../config/api';
import {
  TrendingUp,
  CreditCard,
  DollarSign,
  Loader2,
  ArrowUpRight,
} from 'lucide-react';

interface ChartSeries {
  name: string;
  data: number[];
}

const RevenueLineChart: React.FC = () => {
  const { authUser } = useAuth();
  const token = authUser?.token;

  const [series, setSeries] = useState<ChartSeries[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const options: ApexOptions = {
    legend: { show: false },
    colors: ['#3C50E0', '#80CAEE'],
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'area',
      toolbar: { show: false },
      dropShadow: {
        enabled: true,
        color: '#3C50E0',
        top: 10,
        blur: 4,
        left: 0,
        opacity: 0.1,
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.05,
        stops: [0, 90, 100],
      },
    },
    stroke: {
      width: [3, 3],
      curve: 'smooth', // Changed to smooth for a more modern "S.U.N.O.D." look
    },
    grid: {
      borderColor: '#E2E8F0',
      strokeDashArray: 5,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: true } },
    },
    dataLabels: { enabled: false },
    markers: {
      size: 5,
      colors: '#fff',
      strokeColors: ['#3C50E0', '#80CAEE'],
      strokeWidth: 3,
      hover: { size: 7 },
    },
    xaxis: {
      categories: categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: '#64748b',
          fontWeight: 700,
          fontSize: '10px',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#64748b',
          fontWeight: 700,
          fontSize: '10px',
        },
        formatter: (val) => `₱${val.toLocaleString()}`,
      },
    },
    tooltip: {
      theme: 'dark',
      x: { show: true },
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
              name: 'Total Transactions',
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

  // Calculate totals for the summary display
  const totalRev = series[0]?.data.reduce((a, b) => a + b, 0) || 0;

  return (
    <div className="col-span-12 rounded-[32px] border border-stroke bg-white p-8 shadow-2xl dark:border-strokedark dark:bg-boxdark xl:col-span-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="text-primary" size={16} />
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">
              Financial Intelligence
            </span>
          </div>
          <h5 className="text-3xl font-black text-black dark:text-white uppercase italic tracking-tighter">
            Revenue Flow
          </h5>
        </div>

        <div className="flex gap-4">
          <LegendCard
            icon={DollarSign}
            label="Total Revenue"
            value={`₱${totalRev.toLocaleString()}`}
            color="bg-primary"
          />
          <LegendCard
            icon={CreditCard}
            label="Transaction Vol"
            value={series[1]?.data.reduce((a, b) => a + b, 0) || 0}
            color="bg-secondary"
          />
        </div>
      </div>

      {/* CHART CONTAINER */}
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/50 dark:bg-boxdark/50 backdrop-blur-sm rounded-2xl">
            <Loader2 className="animate-spin text-primary mb-2" size={32} />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Querying Ledger...
            </span>
          </div>
        )}

        <div id="revenueChart" className="-ml-4 h-[350px]">
          {!loading && categories.length > 0 ? (
            <ReactApexChart
              options={options}
              series={series}
              type="area"
              height={350}
            />
          ) : (
            !loading && (
              <div className="h-full flex items-center justify-center border-2 border-dashed border-stroke dark:border-strokedark rounded-3xl">
                <p className="text-xs font-black text-gray-400 uppercase italic">
                  No Transaction Records Found
                </p>
              </div>
            )
          )}
        </div>
      </div>

      {/* FOOTER INSIGHT */}
      <div className="mt-8 flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-meta-4/20 border border-stroke dark:border-strokedark">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center">
            <ArrowUpRight size={18} />
          </div>
          <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase leading-tight">
            System performance is optimal. <br />
            <span className="text-black dark:text-white">
              Ledger synchronized with main server.
            </span>
          </p>
        </div>
        <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">
          View Detailed Logs
        </button>
      </div>
    </div>
  );
};

// Tactical Legend Helper
const LegendCard = ({ icon: Icon, label, value, color }: any) => (
  <div className="flex items-center gap-4 px-5 py-3 rounded-[20px] bg-gray-50 dark:bg-meta-4/30 border border-stroke dark:border-strokedark shadow-sm">
    <div
      className={`h-10 w-10 shrink-0 flex items-center justify-center rounded-xl text-white shadow-lg ${color}`}
    >
      <Icon size={20} />
    </div>
    <div className="min-w-[100px]">
      <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter leading-none mb-1">
        {label}
      </p>
      <p className="text-md font-black text-black dark:text-white italic leading-none truncate">
        {value}
      </p>
    </div>
  </div>
);

export default RevenueLineChart;
