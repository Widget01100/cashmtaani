import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db, auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ title: "", amount: "", category: "" });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) loadTransactions(currentUser.uid);
      else setTransactions([]);
    });
    return unsubscribe;
  }, []);

  const loadTransactions = async (uid) => {
    try {
      const ref = collection(db, "transactions");
      const q = query(ref, where("uid", "==", uid));
      const snapshot = await getDocs(q);
      setTransactions(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error("Load error:", err);
    }
  };

  const addTransaction = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please log in first.");

    if (!form.title || !form.amount || !form.category) {
      setMessage("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);
      await addDoc(collection(db, "transactions"), {
        title: form.title.trim(),
        amount: Number(form.amount),
        category: form.category,
        date: new Date().toISOString(),
        uid: user.uid,
      });
      setMessage("✅ Transaction added!");
      setForm({ title: "", amount: "", category: "" });
      loadTransactions(user.uid);
    } catch (err) {
      console.error("Add error:", err);
      setMessage("❌ Failed to add transaction.");
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = async (id) => {
    await deleteDoc(doc(db, "transactions", id));
    if (user) loadTransactions(user.uid);
  };

  if (!user) {
    return (
      <div className="card" style={{ marginTop: "20px" }}>
        <h3>Transactions</h3>
        <p>Log in to view or add your transactions.</p>
      </div>
    );
  }

  return (
    <div className="card" style={{ marginTop: "20px" }}>
      <h3>Your Transactions</h3>

      <form onSubmit={addTransaction} className="form">
        <input
          placeholder="Title (e.g. Lunch, Matatu fare, Freelance job)"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Amount (e.g. 200)"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          required
        />
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          required
        >
          <option value="">Select Category</option>
          <option value="spend">Spend</option>
          <option value="save">Save</option>
          <option value="hustle">Hustle</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add"}
        </button>
      </form>

      {message && <p style={{ color: "#ff7a00" }}>{message}</p>}

      <ul className="tx-list">
        {transactions.map((t) => (
          <li key={t.id}>
            <strong>{t.title}</strong> — {t.amount} ({t.category})
            <button onClick={() => deleteTransaction(t.id)}>🗑️</button>
          </li>
        ))}
      </ul>

      <p style={{ fontSize: "12px", color: "#9aa3b2", marginTop: "8px" }}>
        💡 <b>Tip:</b> Title is what the money was for — e.g. <i>Lunch, Matatu fare, Freelance job</i>.
      </p>
    </div>
  );
}

export default Transactions;
