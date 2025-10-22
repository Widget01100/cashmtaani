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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) loadTransactions(currentUser.uid);
      else setTransactions([]);
    });
    return unsubscribe;
  }, []);

  const loadTransactions = async (uid) => {
    const ref = collection(db, "transactions");
    const q = query(ref, where("uid", "==", uid));
    const snapshot = await getDocs(q);
    setTransactions(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const addTransaction = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in first.");
      return;
    }
    if (!form.title || !form.amount) return;
    await addDoc(collection(db, "transactions"), {
      title: form.title,
      amount: parseFloat(form.amount),
      category: form.category,
      date: new Date().toISOString(),
      uid: user.uid,
    });
    setForm({ title: "", amount: "", category: "" });
    loadTransactions(user.uid);
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
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          required
        />
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option value="">Select Category</option>
          <option value="spend">Spend</option>
          <option value="save">Save</option>
          <option value="hustle">Hustle</option>
        </select>
        <button type="submit">Add</button>
      </form>

      <ul className="tx-list">
        {transactions.map((t) => (
          <li key={t.id}>
            <strong>{t.title}</strong> — {t.amount} ({t.category})
            <button onClick={() => deleteTransaction(t.id)}>🗑️</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Transactions;
