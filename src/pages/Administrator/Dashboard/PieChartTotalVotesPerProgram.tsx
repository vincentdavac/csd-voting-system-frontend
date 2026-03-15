import { ApexOptions } from 'apexcharts';
import React from 'react';
import ReactApexChart from 'react-apexcharts';

interface Props {
  data: { program: string; votes: number }[];
}

const PREDEFINED_COLORS = ['#3C50E0', '#6577F3', '#8FD0EF', '#0FADCF', '#14B8A6', '#F59E0B'];

const PieChartTotalVotesPerProgram: React.FC<Props> = ({ data }) => {
  // Filter out programs with 0 votes for a cleaner pie chart
  const activeData = data.filter(item => item.votes > 0);
  
  const labels = activeData.map((item) => item.program);
  const series = activeData.map((item) => item.votes);
  const chartColors = PREDEFINED_COLORS.slice(0, labels.length || 4);
  const totalVotes = series.reduce((a, b) => a + b, 0);

  const options: ApexOptions = {
    chart: { fontFamily: 'Satoshi, sans-serif', type: 'donut' },
    colors: chartColors,
    labels: labels,
    legend: { show: false },
    plotOptions: {
      pie: { donut: { size: '65%', background: 'transparent' } },
    },
    dataLabels: { enabled: false },
    tooltip: {
      y: { formatter: (val) => `${val} Votes` }
    }
  };

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
          {series.length === 0 ? (
            <div className="flex h-[250px] items-center justify-center text-gray-500">No votes cast yet</div>
          ) : (
            <ReactApexChart options={options} series={series} type="donut" height={280} />
          )}
        </div>
      </div>

      <div className="-mx-8 flex flex-wrap items-center justify-center gap-y-3 mt-4">
        {labels.map((label, index) => {
          const value = series[index];
          const percentage = totalVotes > 0 ? Math.round((value / totalVotes) * 100) : 0;
          return (
            <div className="sm:w-1/2 w-full px-8" key={label}>
              <div className="flex w-full items-center">
                <span className="mr-2 block h-3 w-full max-w-3 rounded-full" style={{ backgroundColor: chartColors[index % chartColors.length] }}></span>
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

export default PieChartTotalVotesPerProgram;