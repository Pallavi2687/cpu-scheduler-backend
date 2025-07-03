import React, { useState, useEffect } from 'react';

const GanttChart = ({ data, darkMode, tickInterval = 800 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const maxTime = data.length ? Math.max(...data.map(b => b.end)) : 1;
  const done = currentIndex >= data.length;

  useEffect(() => {
    setCurrentIndex(0);
    setProgress(0);
  }, [data]);

  useEffect(() => {
    if (currentIndex >= data.length) return;

    setProgress(0);
    const block = data[currentIndex];
    const duration = block.end - block.start;
    if (duration <= 0) {
      setCurrentIndex(ci => ci + 1);
      return;
    }
    const interval = tickInterval / duration;
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 1) {
          clearInterval(timer);
          setCurrentIndex(ci => ci + 1);
          return 1;
        }
        return p + 1 / duration;
      });
    }, interval);
    return () => clearInterval(timer);
  }, [currentIndex, data, tickInterval]);

  const getColor = pid => [
    '#1abc9c','#3498db','#9b59b6','#e67e22',
    '#e74c3c','#34495e','#f39c12','#2ecc71'
  ][pid % 8];

  const container = {
    position: 'relative',
    height: '60px',
    marginTop: '20px',
    border: `1px solid ${darkMode ? '#555' : '#888'}`,
    borderRadius: '6px',
    background: darkMode ? '#222' : '#f9f9f9',
    overflow: 'hidden',
    display: 'flex',
    width: '100%'
  };

  const labelContainer = {
    position: 'relative',
    height: '30px',
    marginTop: '4px'
  };

  const boxBase = {
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '14px',
    borderRadius: '4px',
    transition: `width ${tickInterval / 1000}s linear`,
    position: 'relative'
  };

  return (
    <div style={{ paddingBottom: '40px' }}>
      <h3 style={{ color: darkMode ? '#eee' : '#333', margin: '10px 0' }}>
        🧮 Gantt Chart
      </h3>

      {/* Gantt chart bar */}
      <div style={container}>
        {data.map((b, i) => {
          const totalWidth = 100;
          const leftPct = (b.start / maxTime) * totalWidth;
          const fullWidthPct = ((b.end - b.start) / maxTime) * totalWidth;
          let widthPct = 0;
          if (i < currentIndex) widthPct = fullWidthPct;
          else if (i === currentIndex) widthPct = fullWidthPct * progress;
          const isActive = i === currentIndex;

          return (
            <div
              key={i}
              style={{
                ...boxBase,
                width: `${widthPct}%`,
                backgroundColor: getColor(b.pid),
                border: isActive ? `2px solid ${darkMode ? '#ff0' : '#fa0'}` : 'none',
                marginLeft: `${leftPct - (i > 0 ? (data[i - 1].end / maxTime) * 100 : 0)}%`,
              }}
            >
              P{b.pid}
              {/* Completion Time inside only when block is done */}
              {i < currentIndex && (
                <div style={{
                  position: 'absolute',
                  bottom: '-18px',
                  fontSize: '11px',
                  color: darkMode ? '#ccc' : '#222'
                }}>
                  {b.start} - {b.end}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Time marks below */}
      <div style={labelContainer}>
        {data.map((b, i) => {
          const leftPct = (b.start / maxTime) * 100;
          const fullPct = ((b.end - b.start) / maxTime) * 100;
          const showEnd = i < currentIndex;
          return (
            <React.Fragment key={i}>
              {/* Start Time */}
              <div
                style={{
                  position: 'absolute',
                  left: `${leftPct}%`,
                  transform: 'translateX(-50%)',
                  fontSize: '12px',
                  color: darkMode ? '#ccc' : '#333'
                }}
              >
                {b.start}
              </div>
              {/* End Time */}
              {showEnd && (
                <div
                  style={{
                    position: 'absolute',
                    left: `${leftPct + fullPct}%`,
                    transform: 'translateX(-50%)',
                    fontSize: '12px',
                    color: darkMode ? '#ccc' : '#333'
                  }}
                >
                  {b.end}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Summary once animation is complete */}
      {done && data.length > 0 && (
        <div style={{ marginTop: '20px', color: darkMode ? '#eee' : '#333' }}>
          <h4>✅ Completion Times</h4>
          <ul>
            {data.map(b => (
              <li key={b.pid}>
                Process P{b.pid}: Completion at t = {b.end}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GanttChart;
