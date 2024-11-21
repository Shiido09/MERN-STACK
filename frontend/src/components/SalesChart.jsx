// src/components/SalesChart.jsx
import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { format, subDays } from 'date-fns';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SalesChart = () => {
  const [startDate, setStartDate] = useState(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState(new Date());

  const salesData = [
    { date: subDays(new Date(), 30), sales: 100 },
    { date: subDays(new Date(), 25), sales: 200 },
    { date: subDays(new Date(), 20), sales: 150 },
    { date: subDays(new Date(), 15), sales: 300 },
    { date: subDays(new Date(), 10), sales: 250 },
    { date: subDays(new Date(), 5), sales: 400 },
    { date: new Date(), sales: 350 },
  ];

  const filteredData = salesData.filter(
    (data) => data.date >= startDate && data.date <= endDate
  );

  const chartData = {
    labels: filteredData.map((data) => format(data.date, 'MM/dd/yyyy')),
    datasets: [
      {
        label: 'Sales',
        data: filteredData.map((data) => data.sales),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Sales Chart</h2>
      <div className="mb-4">
        <label className="mr-2">Start Date:</label>
        <input
          type="date"
          value={format(startDate, 'yyyy-MM-dd')}
          onChange={(e) => setStartDate(new Date(e.target.value))}
          className="border p-2 rounded"
        />
        <label className="ml-4 mr-2">End Date:</label>
        <input
          type="date"
          value={format(endDate, 'yyyy-MM-dd')}
          onChange={(e) => setEndDate(new Date(e.target.value))}
          className="border p-2 rounded"
        />
      </div>
      <Line data={chartData} />
    </div>
  );
};

export default SalesChart;