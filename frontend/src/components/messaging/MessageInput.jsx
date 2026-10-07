import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function MessageInput({ onSend, disabled = false }) {
  const [value, setValue] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    const content = value.trim();
    if (!content || sending || disabled) return;

    try {
      setSending(true);
      await onSend(content);
      setValue("");
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={submit} className="border-t border-slate-200 bg-white p-3 md:p-4">
      <div className="mx-auto flex max-w-4xl items-end gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-2 shadow-sm">
        <Textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              submit(event);
            }
          }}
          placeholder={disabled ? "Select a conversation" : "Write a message..."}
          disabled={disabled || sending}
          className="min-h-[44px] max-h-32 resize-none border-0 bg-transparent px-3 py-2 shadow-none focus-visible:ring-0"
        />
        <Button
          type="submit"
          disabled={disabled || sending || !value.trim()}
          className="h-10 w-10 shrink-0 rounded-xl bg-blue-600 p-0 hover:bg-blue-700"
        >
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
      <p className="mx-auto mt-2 max-w-4xl px-2 text-[11px] text-slate-400">Press Enter to send · Shift + Enter for a new line</p>
    </form>
  );
}
