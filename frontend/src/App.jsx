import React, { useState } from 'react';
import ProcessForm from './components/ProcessForm';
import GanttChart from './components/GanttChart';
import ResultTable from './components/ResultTable';
import MetricsChart from './components/MetricsChart';




export default function App() {
  const [data, setData] = useState({ gantt: [], table: [], averages: {} });
  const [darkMode, setDarkMode] = useState(false);

  const styles = {
    container: {
      minHeight: '100vh',
      padding: '16px',
      fontFamily: 'Segoe UI, sans-serif',
      backgroundColor: darkMode ? '#121212' : '#f0f2f5',
      color: darkMode ? '#eee' : '#333'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '30px'
    },
    title: {
      margin: 0
    },
    /* Slider switch CSS */
    switch: {
      position: 'relative',
      display: 'inline-block',
      width: '50px',
      height: '24px'
    },
    switchInput: {
      opacity: 0,
      width: 0,
      height: 0
    },
    slider: {
      position: 'absolute',
      cursor: 'pointer',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: darkMode ? '#4d4d4d' : '#ccc',
      transition: '.4s',
      borderRadius: '24px'
    },
    sliderBefore: {
      position: 'absolute',
      content: '""',
      height: '18px',
      width: '18px',
      left: darkMode ? '26px' : '4px',
      bottom: '3px',
      backgroundColor: '#fff',
      transition: '.4s',
      borderRadius: '50%'
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>🧠 CPU Scheduler Visualizer</h1>
        <label style={styles.switch}>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            style={styles.switchInput}
          />
          <span style={styles.slider}>
            <span style={styles.sliderBefore}></span>
          </span>
        </label>
      </header>

      <ProcessForm
        darkMode={darkMode}
        onResult={result =>
          setData({
            gantt: result.gantt || [],
            table: result.table || [],
            averages: result.averages || {}
          })
        }
      />

      <GanttChart data={data.gantt} darkMode={darkMode} tickInterval={600} />
     {data.table.length > 0 && (
  <div style={{ margin: '20px 60px' }}>
    <ResultTable
      table={data.table}
      averages={data.averages}
      darkMode={darkMode}
    />
    <MetricsChart table={data.table} darkMode={darkMode} />
  </div>
)}


    </div>
  );
}
