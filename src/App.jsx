import React from "react";
import "./styles.css";
import { db, auth } from "./firebase"; // keep this
import Transactions from "./Transactions"; // 👈 import our new Firestore component
import Login from "./Login"; // 👈 make sure this is here

function App() {
  return (
    <div className="app">
      <header>
  <h1>CashMtaani</h1>
  <p className="tag">Money Moves for Campus Hustlers</p>
  <Login /> {/* 👈 added here */}
      </header>

      <main>
        <section className="cards">
          <div className="card">
            <h3>Spend</h3>
            <p>Track your daily spend — coming soon</p>
          </div>
          <div className="card">
            <h3>Save</h3>
            <p>Smart chamas & goals</p>
          </div>
          <div className="card">
            <h3>Hustle</h3>
            <p>Log side hustle income</p>
          </div>
          <div className="card">
            <h3>SOS</h3>
            <p>Emergency backup feature</p>
          </div>
        </section>

        {/* 🔥 Add Transactions section */}
        <Transactions />
      </main>

      <footer>
        <small>Built for campus — MVP</small>
      </footer>
    </div>
  );
}

export default App;
