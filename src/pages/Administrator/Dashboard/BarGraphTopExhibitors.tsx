import { ApexOptions } from 'apexcharts';
import React from 'react';
import ReactApexChart from 'react-apexcharts';

interface Props {
  data: { project_title: string; total_votes: number }[];
}

const BarGraphTopExhibitors: React.FC<Props> = ({ data }) => {
  const categories = data.map((item) => {
    // Truncate long titles so they fit on the X-axis
    return item.project_title.length > 15 
      ? item.project_title.substring(0, 15) + '...' 
      : item.project_title;
  });
  
  const seriesData = data.map((item) => item.total_votes);

  const options: ApexOptions = {
    colors: ['#3C50E0'],
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'bar',
      height: 335,
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 4,
        columnWidth: '45%',
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: categories,
      tooltip: { enabled: false }
    },
    legend: { show: false },
    fill: { opacity: 1 },
    tooltip: {
      y: { formatter: (val) => `${val} Votes` }
    }
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Top 5 Exhibitors
          </h4>
        </div>
      </div>
      <div>
        <div id="chartTwo" className="-ml-5 -mb-9">
          {data.length === 0 ? (
            <div className="flex h-[350px] items-center justify-center text-gray-500">No votes cast yet</div>
          ) : (
            <ReactApexChart options={options} series={[{ name: 'Total Votes', data: seriesData }]} type="bar" height={350} />
          )}
        </div>
      </div>
    </div>
  );
};

export default BarGraphTopExhibitors;