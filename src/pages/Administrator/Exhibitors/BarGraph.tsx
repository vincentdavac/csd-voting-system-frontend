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
        const res = await fetch(`${API_BASE_URL}/exhibitors/grouped-by-program`, {
          headers: {
            Authorization: `Bearer ${authUser.token}`,
            Accept: 'application/json',
          },
        });
        const json = await res.json();

        if (json.data) {
          // Extract categories (Program Names)
          const categories = json.data.map((item: any) => item.program.name);
          
          // Extract Exhibitor Counts
          const exhibitorsCount = json.data.map((item: any) => item.exhibitors.length);
          
          // Extract Total Votes per program (FIXED: Added Number() to prevent string concatenation)
          const votesCount = json.data.map((item: any) =>
            item.exhibitors.reduce(
              (sum: number, ex: any) => sum + (Number(ex.attributes.votes_sum) || 0),
              0
            )
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
    colors: ['#3C50E0', '#80CAEE'],
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'bar',
      height: 335,
      stacked: true,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    responsive: [
      {
        breakpoint: 1536,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 0,
              columnWidth: '25%',
            },
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 0,
        columnWidth: '25%',
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'last',
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: chartData.categories, // Dynamically populated
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      fontFamily: 'Satoshi',
      fontWeight: 500,
      fontSize: '14px',
      markers: {
        radius: 99,
      },
    },
    fill: {
      opacity: 1,
    },
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-6">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Exhibitors per Program
          </h4>
        </div>
      </div>

      <div>
        <div id="chartTwo" className="-ml-5 -mb-9">
          {loading ? (
            <div className="flex h-[350px] items-center justify-center text-gray-500">
              Loading chart...
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