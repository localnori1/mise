import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { buttonClass } from "./components/Button";
import { Home } from "./pages/Home";
import { OwnerDocument } from "./pages/OwnerDocument";
import { OwnerLinks } from "./pages/OwnerLinks";
import { Respondent } from "./pages/Respondent";
import { Setup } from "./pages/Setup";
import { Link, useLocation } from "./router";
import "./styles.css";

function NotFound() {
  return (
    <main className="mx-auto flex max-w-[480px] flex-col gap-4 px-5 py-16">
      <h1 className="font-display text-2xl font-semibold">This page doesn't exist</h1>
      <p className="text-[15px] text-muted">The link may be mistyped or no longer active.</p>
      <Link href="/" className={buttonClass("secondary", "self-start")}>
        Go to Mise
      </Link>
    </main>
  );
}

function App() {
  const { path, search } = useLocation();
  const parts = path.split("/").filter(Boolean).map(decodeURIComponent);

  if (parts.length === 0) return <Home />;
  if (parts[0] === "new" && parts.length === 1) return <Setup key={search} search={search} />;
  if (parts[0] === "s" && parts.length === 2) return <Respondent key={parts[1]} token={parts[1]} />;
  if (parts[0] === "o" && parts.length === 2) return <OwnerLinks key={parts[1]} ownerKey={parts[1]} />;
  if (parts[0] === "o" && parts.length === 3) return <OwnerDocument key={path} ownerKey={parts[1]} id={parts[2]} />;
  return <NotFound />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
