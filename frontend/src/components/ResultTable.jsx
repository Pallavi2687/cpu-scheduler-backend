import React from 'react';

const ResultTable = ({ table = [], averages = {}, darkMode }) => {
  if (!table.length)
     return <p style={{ color: darkMode ? '#ccc' : '#333' }}>No Result table to display.</p>;

  const {
    completion = "N/A",
    turnaround = "N/A",
    waiting = "N/A"
  } = averages;

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    backgroundColor: darkMode ? '#1e1e1e' : '#fff'
  };
  const thStyle = {
    border: `1px solid ${darkMode ? '#555' : '#ccc'}`,
    padding: '8px',
    backgroundColor: darkMode ? '#333' : '#eee',
    color: darkMode ? '#eee' : '#000'
  };
  const tdStyle = {
    border: `1px solid ${darkMode ? '#555' : '#ccc'}`,
    padding: '8px',
    color: darkMode ? '#ddd' : '#000'
  };
  const headingStyle = {
    marginBottom: '10px',
    borderBottom: `2px solid ${darkMode ? '#555' : '#ddd'}`,
    paddingBottom: '5px',
    color: darkMode ? '#eee' : '#333'
  };

  // Bar chart styles
  const maxValue = Math.max(...table.map(p => Math.max(p.completion, p.turnaround, p.waiting)), 1);
  const chartContainer = {
    display: 'flex',
    gap: '20px',
    alignItems: 'flex-end',
    height: '50px',
    marginTop: '20px'
  };
  const barCommon = {
    width: '60px',
    transition: 'height 0.3s ease'
  };

  return (
    <div style={{ marginTop: '15px' }}>
      <h3 style={headingStyle}>📋 Result Table</h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>PID</th>
            <th style={thStyle}>Arrival</th>
            <th style={thStyle}>Burst</th>
            <th style={thStyle}>Completion</th>
            <th style={thStyle}>Turnaround</th>
            <th style={thStyle}>Waiting</th>
          </tr>
        </thead>
        <tbody>
          {table.map(row => (
            <tr key={row.pid}>
              <td style={tdStyle}>P{row.pid}</td>
              <td style={tdStyle}>{row.arrival}</td>
              <td style={tdStyle}>{row.burst}</td>
              <td style={tdStyle}>{row.completion}</td>
              <td style={tdStyle}>{row.turnaround}</td>
              <td style={tdStyle}>{row.waiting}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '10px' }}>
        <h3 style={headingStyle}>📊 Time Metrics</h3>
        <p style={{ color: darkMode ? '#eee' : '#000' }}>
          <strong>Average Completion Time:</strong> {completion}
        </p>
        <p style={{ color: darkMode ? '#eee' : '#000' }}>
          <strong>Average Turnaround Time:</strong> {turnaround}
        </p>
        <p style={{ color: darkMode ? '#eee' : '#000' }}>
          <strong>Average Waiting Time:</strong> {waiting}
        </p>
      </div>

      <div style={chartContainer}>
        {table.map(p => (
          <div key={p.pid} style={{ textAlign: 'center' }}>
            <div
              style={{
                ...barCommon,
                height: `${(p.completion / maxValue) * 100}%`,
                backgroundColor: '#3498db'
              }}
              title={`CT: ${p.completion}`}
            />
            <div
              style={{
                ...barCommon,
                height: `${(p.turnaround / maxValue) * 100}%`,
                backgroundColor: '#e67e22'
              }}
              title={`TAT: ${p.turnaround}`}
            />
            <div
              style={{
                ...barCommon,
                height: `${(p.waiting / maxValue) * 100}%`,
                backgroundColor: '#2ecc71'
              }}
              title={`WT: ${p.waiting}`}
            />
            {/* <div style={{ marginTop: '4px', color: darkMode ? '#eee' : '#000' }}>P{p.pid}</div> */}
          </div>
        ))}
      </div>

      {/* <p style={{ fontSize: '12px', marginTop: '10px', color: darkMode ? '#ccc' : '#666' }}>
        <span style={{ color: '#3498db' }}>■ CT</span> &nbsp;
        <span style={{ color: '#e67e22' }}>■ TAT</span> &nbsp;
        <span style={{ color: '#2ecc71' }}>■ WT</span>
      </p> */}
    </div>
  );
};

export default ResultTable;
