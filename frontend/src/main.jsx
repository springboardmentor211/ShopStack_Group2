
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { initDevAuth } from "./warehouse/services/devAuth.js";
import "./index.css";

async function bootstrap() {
  if (import.meta.env.DEV) {
    await initDevAuth();
  }

  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

bootstrap();
