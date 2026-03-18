import { ApexOptions } from 'apexcharts';
import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

interface ExhibitorData {
  id: number;
  attributes: {
    project_title: string;
    votes_sum: number | null;
    program?: {
      name: string;
    };
  };
}

interface BarGraphPerProgramProps {
  programName: string;
  exhibitorsData: ExhibitorData[]; 
}

const BarGraphPerProgram: React.FC<BarGraphPerProgramProps> = ({ 
  programName, 
  exhibitorsData
}) => {
  const [filter, setFilter] = useState<'top5' | 'top10' | 'all'>('top5');

  const programExhibitors = exhibitorsData.filter((ex) => {
    const progName = ex.attributes?.program?.name || '';
    return progName.toUpperCase().includes(programName.toUpperCase());
  });

  const sortedExhibitors = [...programExhibitors].sort(
    (a, b) => (b.attributes?.votes_sum || 0) - (a.attributes?.votes_sum || 0)
  );

  let displayedExhibitors = sortedExhibitors;
  if (filter === 'top5') displayedExhibitors = sortedExhibitors.slice(0, 5);
  else if (filter === 'top10') displayedExhibitors = sortedExhibitors.slice(0, 10);

  const categories = displayedExhibitors.map((ex) => ex.attributes?.project_title);
  const data = displayedExhibitors.map((ex) => ex.attributes?.votes_sum || 0);

  const series = [
    {
      name: 'Votes',
      data: data,
    },
  ];

  const options: ApexOptions = {
    colors: ['#3C50E0'],
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'bar',
      height: 335,
      stacked: false,
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 0,
        columnWidth: '25%',
        borderRadiusApplication: 'end',
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: categories.length > 0 ? categories : ['No Data'],
    },
    legend: { show: false },
    fill: { opacity: 1 },
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-6">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-semibold text-black dark:text-white uppercase">
            {programName} Ranking
          </h4>
        </div>
        <div>
          <div className="relative z-20 inline-block">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="relative z-20 inline-flex appearance-none bg-transparent py-1 pl-3 pr-8 text-sm font-medium outline-none"
            >
              <option value="top5" className="dark:bg-boxdark">Top 5</option>
              <option value="top10" className="dark:bg-boxdark">Top 10</option>
              <option value="all" className="dark:bg-boxdark">All Exhibitors</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <div id={`chartTwo-${programName}`} className="-ml-5 -mb-9">
          <ReactApexChart options={options} series={series} type="bar" height={350} />
        </div>
      </div>
    </div>
  );
};

export default BarGraphPerProgram;