import React from "react";
import "./styles.css";
import firebaseConfig from "./firebase";

function App() {
  return (
    <div className="app">
      <header>
        <h1>CashMtaani</h1>
        <p className="tag">Money Moves for Campus Hustlers</p>
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

        <section className="info">
          <h4>Firebase config</h4>
          <pre>{JSON.stringify(firebaseConfig, null, 2)}</pre>
          <p className="small">Fill the real Firebase values in <code>.env</code>.</p>
        </section>
      </main>

      <footer>
        <small>Built for campus — MVP</small>
      </footer>
    </div>
  );
}

export default App;
