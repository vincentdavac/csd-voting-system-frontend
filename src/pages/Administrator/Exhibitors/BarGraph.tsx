import { ApexOptions } from 'apexcharts';
import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useAuth } from '../../../context/AuthContext';
import API_BASE_URL from '../../../config/api';

interface ChartDataState {
  series: {
    name: string;
    data: number[];
  }[];
  categories: string[];
}

const BarGraph: React.FC = () => {
  const { authUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<ChartDataState>({
    series: [
      { name: 'Exhibitors', data: [] },
      { name: 'Total Votes', data: [] },
    ],
    categories: [],
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
          const categories = json.data.map((item: any) => item.program.name);
          const exhibitorsCount = json.data.map(
            (item: any) => item.exhibitors.length,
          );
          const votesCount = json.data.map((item: any) =>
            item.exhibitors.reduce(
              (sum: number, ex: any) =>
                sum + (Number(ex.attributes.votes_sum) || 0),
              0,
            ),
          );

          setChartData({
            series: [
              { name: 'Exhibitors', data: exhibitorsCount },
              { name: 'Total Votes', data: votesCount },
            ],
            categories,
          });
        }
      } catch (error) {
        console.error('Error fetching bar graph data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGraphData();
  }, [authUser?.token]);

  const options: ApexOptions = {
    // Professional Gradient Palette (Primary Blue & Sky Blue)
    colors: ['#3C50E0', '#80CAEE'],
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'bar',
      height: 335,
      stacked: true,
      toolbar: { show: false },
      zoom: { enabled: false },
      dropShadow: {
        enabled: true,
        top: 10,
        left: 0,
        blur: 4,
        color: '#000',
        opacity: 0.1,
      },
    },
    responsive: [
      {
        breakpoint: 1536,
        options: {
          plotOptions: {
            bar: {
              columnWidth: '20%',
            },
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 8, // Softer, more modern rounded corners
        columnWidth: '25%',
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'last',
      },
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      strokeDashArray: 5,
      borderColor: '#E2E8F0',
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    xaxis: {
      categories: chartData.categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          fontWeight: 700,
          fontSize: '12px',
          colors: '#64748B',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontWeight: 600,
          colors: '#64748B',
        },
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      fontFamily: 'Satoshi',
      fontWeight: 800,
      fontSize: '12px',
      itemMargin: { horizontal: 15, vertical: 5 },
      markers: {
        // Change 'size: 6' to width and height
        width: 10,
        height: 10,
        strokeWidth: 0,
        radius: 4, // This keeps the slightly rounded "squircle" look
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.25,
        gradientToColors: undefined,
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 0.85,
        stops: [0, 90, 100],
      },
    },
    tooltip: {
      theme: 'dark',
      style: {
        fontSize: '12px',
        fontFamily: 'Satoshi',
      },
    },
  };

  return (
    <div className="col-span-12 rounded-[32px] border border-stroke bg-white p-8 shadow-2xl dark:border-strokedark dark:bg-boxdark xl:col-span-6 transition-all hover:shadow-primary/5">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="text-xl font-black text-black dark:text-white tracking-tight uppercase italic">
            Program Engagement
          </h4>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
            Exhibitor distribution & active votes
          </p>
        </div>

        {/* Decorative dynamic badge */}
        <div className="rounded-xl bg-gray-50 px-4 py-2 dark:bg-meta-4">
          <span className="text-xs font-black text-primary uppercase">
            Analytics Mode
          </span>
        </div>
      </div>

      <div className="relative">
        <div id="chartTwo" className="-ml-5">
          {loading ? (
            <div className="flex h-[350px] flex-col items-center justify-center gap-3">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="text-xs font-black uppercase tracking-widest text-gray-400">
                Syncing Data...
              </p>
            </div>
          ) : (
            <ReactApexChart
              options={options}
              series={chartData.series}
              type="bar"
              height={350}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BarGraph;
