import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { format, subDays } from 'date-fns';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SalesChart = () => {
  const [startDate, setStartDate] = useState(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState(new Date());
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/orders/sales', {
          params: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
          withCredentials: true,
        });

        // Aggregate sales data by date
        const aggregatedData = response.data.reduce((acc, sale) => {
          const date = format(new Date(sale.date), 'yyyy-MM-dd');
          if (!acc[date]) {
            acc[date] = 0;
          }
          acc[date] += sale.total;
          return acc;
        }, {});

        // Convert aggregated data to an array
        const aggregatedArray = Object.keys(aggregatedData).map(date => ({
          date,
          total: aggregatedData[date],
        }));

        setSalesData(aggregatedArray);
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };

    fetchSalesData();
  }, [startDate, endDate]);

  const chartData = {
    labels: salesData.map((data) => format(new Date(data.date), 'MM/dd/yyyy')),
    datasets: [
      {
        label: 'Sales',
        data: salesData.map((data) => data.total),
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