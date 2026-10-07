import { Check, CheckCheck, MoreVertical } from "lucide-react";

export default function MessageBubble({ message, mine, onDelete }) {
  const deleted = Boolean(message?.deletedAt);

  return (
    <div className={`group flex ${mine ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[78%] md:max-w-[65%] ${mine ? "items-end" : "items-start"} flex flex-col`}>
        <div
          className={`relative rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
            deleted
              ? "border border-dashed border-slate-300 bg-slate-50 italic text-slate-400"
              : mine
                ? "rounded-br-md bg-blue-600 text-white"
                : "rounded-bl-md border border-slate-200 bg-white text-slate-800"
          }`}
        >
          {deleted ? "Message deleted" : message.content}

          {mine && !deleted && (
            <button
              type="button"
              onClick={() => onDelete(message)}
              className="absolute -right-8 top-1 hidden rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-red-500 group-hover:block"
              title="Delete message"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className={`mt-1 flex items-center gap-1 text-[10px] text-slate-400 ${mine ? "pr-1" : "pl-1"}`}>
          <span>
            {message?.createdAt
              ? new Date(message.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : ""}
          </span>
          {mine && !deleted && (message.readAt ? <CheckCheck className="h-3 w-3 text-blue-500" /> : <Check className="h-3 w-3" />)}
        </div>
      </div>
    </div>
  );
}
