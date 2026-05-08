import React from "react";
import ReactDOM from "react-dom/client";
import AppProviders from "@/providers/AppProviders";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AppProviders>
    <App />
  </AppProviders>,
);
