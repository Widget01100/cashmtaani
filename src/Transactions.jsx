import React, { useEffect, useState } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ title: "", amount: "", category: "" });

  const ref = collection(db, "transactions");

  // Fetch transactions from Firestore
  const loadTransactions = async () => {
    const snapshot = await getDocs(ref);
    setTransactions(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  // Add new transaction
  const addTransaction = async (e) => {
    e.preventDefault();
    if (!form.title || !form.amount) return;
    await addDoc(ref, {
      title: form.title,
      amount: parseFloat(form.amount),
      category: form.category,
      date: new Date().toISOString(),
    });
    setForm({ title: "", amount: "", category: "" });
    loadTransactions();
  };

  // Delete a transaction
  const deleteTransaction = async (id) => {
    await deleteDoc(doc(db, "transactions", id));
    loadTransactions();
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  return (
    <div className="card" style={{ marginTop: "20px" }}>
      <h3>Transactions</h3>
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
