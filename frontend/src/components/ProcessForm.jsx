import React, { useState } from 'react';
import { sendScheduleRequest } from '../api/scheduleApi';

const ProcessForm = ({ onResult, onDebug, darkMode }) => {
  const [algo, setAlgo] = useState("FCFS");
  const [processes, setProcesses] = useState([
    { pid: 1, arrival: 0, burst: 5, priority: 1 }
  ]);
  const [quantum, setQuantum] = useState(4);
  const [loading, setLoading] = useState(false);       // ⬅️ NEW

  /* ---------- helpers ---------- */

  const handleAddRow = () => {
    setProcesses(ps => [
      ...ps,
      { pid: ps.length + 1, arrival: 0, burst: 5, priority: 1 }
    ]);
  };

  const handleDeleteRow = index => {
    if (processes.length === 1) {
      alert("⚠️ At least one process is required.");
      return;
    }
    setProcesses(ps => ps.filter((_, i) => i !== index));
  };

  const updateField = (i, key, e) => {
    const val = Number(e.target.value);
    setProcesses(ps => {
      const copy = [...ps];
      copy[i][key] = val;
      return copy;
    });
  };

  /* ---------- submit ---------- */

  const handleSubmit = async e => {
    e.preventDefault();

    /* validation */
    for (const p of processes) {
      if (isNaN(p.pid) || p.pid < 0)         { alert(`❌ PID for P${p.pid} must be ≥ 0`); return; }
      if (isNaN(p.arrival) || p.arrival < 0) { alert(`❌ Arrival for P${p.pid} must be ≥ 0`); return; }
      if (isNaN(p.burst) || p.burst <= 0)    { alert(`❌ Burst for P${p.pid} must be > 0`); return; }
      if (["PRIORITY","HRRN","LRTF"].includes(algo) &&
          (isNaN(p.priority) || p.priority < 0)) {
        alert(`❌ Priority for P${p.pid} must be ≥ 0`); return;
      }
    }
    if (algo === "RR" && (isNaN(quantum) || quantum <= 0)) {
      alert("❌ Quantum must be > 0"); return;
    }

    /* request */
    setLoading(true);                          // ⬅️ start loader
    try {
      const res = await sendScheduleRequest({ algorithm: algo, processes, quantum });
      onResult({ gantt: res.gantt, table: res.table, averages: res.averages });
      onDebug?.(res.debug);
    } catch (err) {
      onResult({ gantt: [], table: [], averages: {} });
      onDebug?.({ raw_output: err.message });
    } finally {
      setLoading(false);                       // ⬅️ stop loader
    }
  };

  /* ---------- styles ---------- */

  const styles = {
    form: {
      background: darkMode ? '#1e1e1e' : '#fff',
      color: darkMode ? '#eee'   : '#000',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '20px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    },
    label:  { display: 'block', marginBottom: 8, fontWeight: 'bold' },
    select: { padding: 6, borderRadius: 4, marginLeft: 10 },
    table:  { width: '100%', borderCollapse: 'collapse', marginTop: 10,
              background: darkMode ? '#2c2c2c' : '#f9f9f9' },
    th:     { border: '1px solid #ccc', padding: 8,
              background: darkMode ? '#444' : '#eee' },
    td:     { border: '1px solid #ccc', padding: 8 },
    input:  { width: 60, padding: 4, borderRadius: 4,
              background: darkMode ? '#333' : '#fff',
              color: darkMode ? '#eee' : '#000',
              border: '1px solid #aaa' },
    btn:    { padding: '6px 12px', marginRight: 8, border: 'none',
              borderRadius: 4, cursor: 'pointer',
              background: '#3498db', color: '#fff' },
    deleteBtn: { padding: '4px 8px', background: '#e74c3c',
                 border: 'none', borderRadius: 4, color: '#fff',
                 cursor: 'pointer' },
    /* spinner */
    spinnerWrap:{ display:'flex',alignItems:'center',gap:8,marginTop:15 },
    spinner:{
      width: 20,height:20,border:'3px solid #f3f3f3',
      borderTop:'3px solid #3498db',borderRadius:'50%',
      animation:'spin 0.8s linear infinite'
    }
  };

  /* ---------- render ---------- */

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      {/* Algorithm selector */}
      <div style={styles.label}>
        Algorithm:
        <select value={algo} onChange={e=>setAlgo(e.target.value)} style={styles.select}>
          {["FCFS","SJF","PRIORITY","RR","SRTF","LJF","HRRN","LRTF"]
            .map(a=> <option key={a}>{a}</option>)}
        </select>
      </div>

      {/* Process table */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>PID</th>
            <th style={styles.th}>Arrival</th>
            <th style={styles.th}>Burst</th>
            {["PRIORITY","HRRN","LRTF"].includes(algo) && <th style={styles.th}>Priority</th>}
            <th style={styles.th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {processes.map((p,i)=>(
            <tr key={i}>
              {["pid","arrival","burst"].map(col=>(
                <td key={col} style={styles.td}>
                  <input type="number" value={p[col]}
                         onChange={e=>updateField(i,col,e)} style={styles.input}/>
                </td>
              ))}
              {["PRIORITY","HRRN","LRTF"].includes(algo) && (
                <td style={styles.td}>
                  <input type="number" value={p.priority}
                         onChange={e=>updateField(i,"priority",e)} style={styles.input}/>
                </td>
              )}
              <td style={styles.td}>
                <button type="button" style={styles.deleteBtn}
                        onClick={()=>handleDeleteRow(i)} disabled={processes.length===1}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Quantum for RR */}
      {algo==="RR" && (
        <div style={{ marginTop: 10 }}>
          <label style={styles.label}>
            Quantum:
            <input type="number" value={quantum}
                   onChange={e=>setQuantum(Number(e.target.value))}
                   style={{ ...styles.input, marginLeft:10 }}/>
          </label>
        </div>
      )}

      {/* Buttons */}
      <div style={{ marginTop: 15 }}>
        <button type="button" onClick={handleAddRow} style={styles.btn}>Add Row</button>
        <button type="submit" style={styles.btn} disabled={loading}>
          {loading ? "Running..." : "Run"}
        </button>
      </div>

      {/* Loader */}
      {loading && (
        <div style={styles.spinnerWrap}>
          <div style={styles.spinner}/>
          <span>Running scheduler…</span>
        </div>
      )}

      {/* keyframes for spinner */}
      <style>{`@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}`}</style>
    </form>
  );
};

export default ProcessForm;
