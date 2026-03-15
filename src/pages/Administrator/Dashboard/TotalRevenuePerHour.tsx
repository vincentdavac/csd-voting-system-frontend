import { ApexOptions } from 'apexcharts';
import React from 'react';
import ReactApexChart from 'react-apexcharts';

interface Props {
  data: { day: string; total: number }[];
}

const TotalRevenuePerHour: React.FC<Props> = ({ data }) => {
  const categories = data.map(item => item.day); // e.g., 'Mon', 'Tue'
  const seriesData = data.map(item => item.total);

  const options: ApexOptions = {
    colors: ['#10B981'], // A nice green for revenue
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'area', // Area charts look great for timeline revenue
      height: 335,
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    xaxis: {
      categories: categories,
    },
    yaxis: {
      labels: { formatter: (val) => `₱${val}` }
    },
    legend: { show: false },
    fill: { opacity: 0.2, type: 'solid' },
    tooltip: {
      y: { formatter: (val) => `₱${val}` }
    }
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Revenue (Last 7 Days)
          </h4>
        </div>
      </div>

      <div>
        <div id="chartRevenue" className="-ml-5 -mb-9">
          <ReactApexChart
            options={options}
            series={[{ name: 'Revenue', data: seriesData }]}
            type="area"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default TotalRevenuePerHour;