import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

function Summary() {
  const [data, setData] = useState([]);
  const COLORS = ["#ff4d4d", "#4caf50", "#ffcc00"]; // Spend, Save, Hustle

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const ref = collection(db, "transactions");
        const q = query(ref, where("uid", "==", user.uid));
        const snapshot = await getDocs(q);
        const txs = snapshot.docs.map((doc) => doc.data());

        const spend = txs.filter((t) => t.category === "spend").reduce((a, b) => a + b.amount, 0);
        const save = txs.filter((t) => t.category === "save").reduce((a, b) => a + b.amount, 0);
        const hustle = txs.filter((t) => t.category === "hustle").reduce((a, b) => a + b.amount, 0);

        setData([
          { name: "Spend", value: spend },
          { name: "Save", value: save },
          { name: "Hustle", value: hustle },
        ]);
      } else {
        setData([]);
      }
    });
    return unsubscribe;
  }, []);

  if (!data.length) {
    return (
      <div className="card" style={{ marginTop: "20px" }}>
        <h3>Summary</h3>
        <p>Log in and add transactions to see your stats.</p>
      </div>
    );
  }

  return (
    <div className="card" style={{ marginTop: "20px" }}>
      <h3>Your Summary</h3>
      <PieChart width={320} height={250}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>

      <div style={{ textAlign: "center", marginTop: "10px" }}>
        <p><strong>Total:</strong> {data.reduce((a, b) => a + b.value, 0)}</p>
      </div>
    </div>
  );
}

export default Summary;
