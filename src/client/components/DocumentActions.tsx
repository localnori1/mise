import { Download, FileText } from "lucide-react";
import { createPortal } from "react-dom";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "./Button";
import { CopyButton } from "./CopyButton";

export const fileSlug = (topic: string) =>
  topic.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "mise";

export function DocumentView({ markdown, className = "" }: { markdown: string; className?: string }) {
  return (
    <article className={`doc ${className}`}>
      <Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown>
    </article>
  );
}

// PDF: the browser's own "Save as PDF" keeps the formatting and selectable
// text, with no PDF library or server. Only the document prints (styles.css),
// and the page title becomes the suggested file name.
function savePdf(name: string) {
  const title = document.title;
  document.title = name;
  window.addEventListener("afterprint", () => (document.title = title), { once: true });
  window.print();
}

function downloadMarkdown(markdown: string, name: string) {
  const url = URL.createObjectURL(new Blob([markdown], { type: "text/markdown;charset=utf-8" }));
  const link = Object.assign(document.createElement("a"), { href: url, download: `${name}.md` });
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Save as PDF, Markdown and Copy for a finished document, plus the print-only
// copy of it that "Save as PDF" prints.
export function DocumentActions({ markdown, name, hint = false }: { markdown: string; name: string; hint?: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={() => savePdf(name)}>
          <FileText size={18} aria-hidden="true" />
          Save as PDF
        </Button>
        <Button size="sm" variant="secondary" onClick={() => downloadMarkdown(markdown, name)}>
          <Download size={18} aria-hidden="true" />
          Markdown
        </Button>
        <CopyButton text={markdown} label="Copy" size="sm" />
      </div>
      {hint && (
        <p className="text-[13px] leading-normal text-muted">For a PDF, choose "Save as PDF" in the print window.</p>
      )}
      {createPortal(<DocumentView markdown={markdown} className="print-doc" />, document.body)}
    </div>
  );
}
