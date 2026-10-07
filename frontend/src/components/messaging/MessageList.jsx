import { useEffect, useRef } from "react";
import { MessageCircle } from "lucide-react";
import MessageBubble from "./MessageBubble";

export default function MessageList({ messages, currentUserId, onDelete }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50/70 px-4 py-6 md:px-8">
      {messages.length === 0 ? (
        <div className="flex h-full items-center justify-center text-center">
          <div>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm ring-1 ring-slate-200">
              <MessageCircle className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-semibold text-slate-900">Start the conversation</h3>
            <p className="mt-1 text-sm text-slate-500">Send a message to get things moving.</p>
          </div>
        </div>
      ) : (
        <div className="mx-auto flex max-w-4xl flex-col gap-3">
          {messages.map((message) => (
            <MessageBubble
              key={message._id}
              message={message}
              currentUserId={currentUserId}
              mine={String(message?.sender?._id || message?.sender) === String(currentUserId)}
              onDelete={onDelete}
            />
          ))}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
}
