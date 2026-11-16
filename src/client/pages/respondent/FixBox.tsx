import { useState } from "react";
import { Button } from "../../components/Button";
import { TextField } from "../../components/TextField";

// "Fix something" on R5 and R7: the text stays in the box if sending fails.
export function FixBox({ busy, onSend, onCancel }: { busy: boolean; onSend: (text: string) => Promise<boolean>; onCancel: () => void }) {
  const [text, setText] = useState("");
  const send = async () => {
    if (await onSend(text.trim())) setText("");
  };
  return (
    <div className="flex flex-col gap-2 rounded-card border border-border bg-surface p-4">
      <TextField
        label="What should we fix?"
        labelClassName="text-sm font-semibold"
        rows={3}
        value={text}
        onChange={setText}
        disabled={busy}
      />
      <div className="flex gap-2">
        <Button variant="secondary" className="flex-1" onClick={onCancel} disabled={busy}>
          Cancel
        </Button>
        <Button className="flex-1" onClick={send} loading={busy} disabled={!text.trim()}>
          Send
        </Button>
      </div>
    </div>
  );
}
