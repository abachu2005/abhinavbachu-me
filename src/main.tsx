import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/theme.css";

// GH Pages SPA shim: unpack /?/path&search#hash back into a normal URL.
(() => {
  const search = window.location.search;
  if (search.startsWith("?/")) {
    const rest = search.slice(2).split("&");
    const path = "/" + rest.shift();
    const newSearch = rest.length ? "?" + rest.join("&") : "";
    window.history.replaceState(
      null,
      "",
      path + newSearch + window.location.hash,
    );
  }
})();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
