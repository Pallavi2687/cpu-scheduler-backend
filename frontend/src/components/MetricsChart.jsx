import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const MetricsChart = ({ table, darkMode }) => {
  const labels = table.map(p => `P${p.pid}`);
  const completion = table.map(p => p.completion);
  const turnaround = table.map(p => p.turnaround);
  const waiting = table.map(p => p.waiting);

  const data = {
    labels,
    datasets: [
      {
        label: 'Completion Time',
        data: completion,
        backgroundColor: 'rgba(52, 152, 219, 0.7)',
        barThickness: 20
      },
      {
        label: 'Turnaround Time',
        data: turnaround,
        backgroundColor: 'rgba(46, 204, 113, 0.7)',
        barThickness: 20
      },
      {
        label: 'Waiting Time',
        data: waiting,
        backgroundColor: 'rgba(231, 76, 60, 0.7)',
        barThickness: 20
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: darkMode ? '#fff' : '#000',
          font: {
            size: 12
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: darkMode ? '#fff' : '#000',
          font: {
            size: 11
          }
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: darkMode ? '#fff' : '#000',
          font: {
            size: 11
          }
        }
      }
    }
  };
return (
  <div
    style={{
      margin: '20px 60px',        // Top/bottom = 40px, Left/right = 60px
      padding: '20px 30px',
      backgroundColor: darkMode ? '#1a1a1a' : '#fff',
      borderRadius: '12px',
      boxShadow: darkMode
        ? '0 0 10px rgba(255, 255, 255, 0.1)'
        : '0 0 10px rgba(0, 0, 0, 0.1)',
      width: 'auto',
    }}
  >
    <h3
      style={{
        color: darkMode ? '#fff' : '#000',
        textAlign: 'center',
        marginBottom: '25px',
      }}
    >
      📊 Process Time Metrics
    </h3>
    <div style={{ width: '100%', height: '400px' }}>
      <Bar data={data} options={options} />
    </div>
  </div>
);

};

export default MetricsChart;
