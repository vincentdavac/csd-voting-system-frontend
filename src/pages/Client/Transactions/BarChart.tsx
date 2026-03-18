import { ApexOptions } from 'apexcharts';
import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { TRANSACTION } from './Transactions';

interface BarChartProps {
  transactions: TRANSACTION[];
}

const BarChart: React.FC<BarChartProps> = ({ transactions }) => {
  const [series, setSeries] = useState<{ name: string; data: number[] }[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    // Aggregate revenue by year level
    const revenueMap: Record<string, number> = {};

    transactions.forEach((t) => {
      const label = t.yearLevel === null ? 'Visitor' : `Year ${t.yearLevel}`;
      if (!revenueMap[label]) revenueMap[label] = 0;
      revenueMap[label] += t.amountPaid;
    });

    // Sort labels: Year 1, Year 2..., then Visitor
    const sortedLabels = Object.keys(revenueMap).sort((a, b) => {
      if (a === 'Visitor') return 1;
      if (b === 'Visitor') return -1;
      return a.localeCompare(b);
    });

    const revenueSeries = sortedLabels.map((label) => revenueMap[label]);

    setCategories(sortedLabels);
    setSeries([{ name: 'Revenue', data: revenueSeries }]);
  }, [transactions]);

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
    },
    plotOptions: {
      bar: { horizontal: false, columnWidth: '50%' },
    },
    dataLabels: { enabled: false },
    xaxis: { categories: categories },
    colors: ['#3C50E0'],
    legend: { position: 'top', horizontalAlign: 'left' },
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-8">
      <h4 className="text-xl font-semibold text-black dark:text-white mb-4">
        Revenue Per Year Level
      </h4>
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default BarChart;
