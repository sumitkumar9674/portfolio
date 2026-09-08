// Entry point for the React application.
// The URL decides which screen should be loaded.

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import CubeTest from "./pages/CubeTest/CubeTest";
import "./styles.css";

// Load the cube prototype only when /cube-test is opened.
// The normal portfolio continues to use App.tsx unchanged.
const isCubeTest = window.location.pathname === "/cube-test";

createRoot(document.getElementById("root")!).render(
  <StrictMode>{isCubeTest ? <CubeTest /> : <App />}</StrictMode>,
);
