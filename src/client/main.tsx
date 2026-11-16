import { StrictMode, useEffect } from "react";
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

// Owner pages before sign-in (ADR-003) lived at /o/<key>.
function OldOwnerLink() {
  useEffect(() => {
    window.location.replace("/links");
  }, []);
  return null;
}

function App() {
  const { path, search } = useLocation();
  const parts = path.split("/").filter(Boolean).map(decodeURIComponent);

  if (parts.length === 0) return <Home />;
  if (parts[0] === "new" && parts.length === 1) return <Setup key={search} search={search} />;
  if (parts[0] === "s" && parts.length === 2) return <Respondent key={parts[1]} token={parts[1]} />;
  if (parts[0] === "links" && parts.length === 1) return <OwnerLinks />;
  if (parts[0] === "links" && parts.length === 2) return <OwnerDocument key={parts[1]} id={parts[1]} />;
  if (parts[0] === "o") return <OldOwnerLink />;
  return <NotFound />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
