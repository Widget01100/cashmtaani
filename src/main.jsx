import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
window.addEventListener("error", (e) => {
  const div = document.createElement("div");
  div.style.cssText = "color:white;background:red;padding:5px;";
  div.innerText = "JS Error: " + e.message;
  document.body.appendChild(div);
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
