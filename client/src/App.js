import React, { useEffect, useState } from "react";
import "./App.css";

const API_BASE = process.env.REACT_APP_API_BASE || "";

function useLocalTime() {
  try {
    const d = new Date();
    if (isNaN(d.getTime())) return null;
    return d.toISOString();
  } catch {
    return null;
  }
}

function isoFromInput(value) {
  if (!value) return null;
  const dt = new Date(value);
  return dt.toISOString();
}

export default function App() {
  const [punches, setPunches] = useState([]);
  const [manualInput, setManualInput] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [greeting, setGreeting] = useState("");
  const localIso = useLocalTime();
  const [useLocal, setUseLocal] = useState(!!localIso);

  async function fetchPunches() {
    setLoading(true);
    try {
      const r = await fetch(API_BASE + "/api/punches");
      const data = await r.json();
      setPunches(data);
    } catch (e) {
      console.error("Failed to fetch punches", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPunches();
  }, []);

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "🌞 Good morning! Have a productive day ahead.";
    if (hour < 17) return "🌤️ Good afternoon! Keep up the great work.";
    return "🌙 Good evening! Great job finishing strong today.";
  }

  async function submitPunch() {
    let timeIso = null;
    if (useLocal && localIso) timeIso = localIso;
    else timeIso = isoFromInput(manualInput);

    if (!timeIso) {
      alert("Please provide a valid time (local or manual).");
      return;
    }

    try {
      const res = await fetch(API_BASE + "/api/punch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ time: timeIso, note }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert("Failed to save: " + (err.error || res.statusText));
        return;
      }

      setNote("");
      setManualInput("");
      await fetchPunches();

      // ✅ Show greeting message
      const msg = getGreeting();
      setGreeting(msg);
      setTimeout(() => setGreeting(""), 4000);
    } catch (e) {
      console.error("Save failed", e);
      alert("Save failed");
    }
  }

  return (
    <div className="app-container">
      <h1>⏰ Punch In</h1>
      <h1>⏰ Punch In Application </h1>

      {greeting && <div className="greeting">{greeting}</div>}

@@ -159,55 +159,59 @@
              {punches.map((p, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{new Date(p.time).toLocaleString()}</td>
                  <td>{p.note || "—"}</td>
                  <td>
                  <td>{new Date(p.time).toLocaleString()}</td>
                  <td>{p.note || "—"}</td>
                  <td>
                    {p.createdAt
                      ? new Date(p.createdAt).toLocaleString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <footer>
        <small>
          Times stored in UTC (ISO). Displayed in your local time zone.
        </small>
      </footer>
    </div>
  );
}










// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// function App() {
//   const [punches, setPunches] = useState([]);
//   const [manualTime, setManualTime] = useState('');

//   const backendURL = process.env.REACT_APP_BACKEND_URL || window.location.origin;

//   const fetchPunches = async () => {
//     try {
//       const res = await axios.get(`${backendURL}/api/punches`);
//       setPunches(res.data);
//     } catch (err) {
//       console.error('Error fetching punches:', err);
//     }
//   };

//   const punchIn = async () => {
//     const now = new Date();
//     const localTime = now.toLocaleString();
//     const timeToSave = manualTime || localTime;

//     try {
//       await axios.post(`${backendURL}/api/punch`, { time: timeToSave });
//       setManualTime('');
//       fetchPunches();
//     } catch (err) {
//       console.error('Error punching in:', err);
//     }
//   };

//   useEffect(() => {
//     fetchPunches();
//   }, []);

//   return (
//     <div className="container">
//       <h2>⏰ Punch In App</h2>

//       <p><strong>Local Time:</strong> {new Date().toLocaleString()}</p>

//       <input
//         type="text"
//         placeholder="Enter time manually (optional)"
//         value={manualTime}
//         onChange={(e) => setManualTime(e.target.value)}
//       />

//       <div>
//         <button onClick={punchIn}>Punch In</button>
//       </div>

//       <h3>Recent Punches</h3>
//       <ul style={{ textAlign: 'left' }}>
//         {punches.map((p, i) => (
//           <li key={i}>{p.time}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default App;
