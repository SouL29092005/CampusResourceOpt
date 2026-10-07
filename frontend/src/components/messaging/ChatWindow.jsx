import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, MoreVertical, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getMessages, markMessageAsRead } from "../../api/message.api";
import { deleteMessage } from "../../api/message.api";
import {
  emitMessageDeleted,
  emitMessageRead,
  emitNewMessage,
  joinConversation,
  leaveConversation,
  onMessageDeleted,
  onMessageRead,
  onNewMessage,
  offMessageDeleted,
  offMessageRead,
  offNewMessage,
} from "../../socket/commsSocket";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

function getOtherParticipant(conversation, currentUserId) {
  return conversation?.participants?.find(
    (participant) => String(participant?._id) !== String(currentUserId),
  ) || conversation?.participants?.[0];
}

export default function ChatWindow({ conversation, currentUserId, onBack }) {
  const [messages, setMessages] = useState([]);
  const [loadedConversationId, setLoadedConversationId] = useState(null);
  const [error, setError] = useState("");
  const other = useMemo(
    () => getOtherParticipant(conversation, currentUserId),
    [conversation, currentUserId],
  );
  const name = other?.name || other?.email || "Campus User";
  const loading = Boolean(conversation?._id) &&
    String(loadedConversationId) !== String(conversation._id);

  useEffect(() => {
    if (!conversation?._id) return undefined;

    let mounted = true;

    getMessages(conversation._id)
      .then((res) => {
        if (mounted) {
          setError("");
          setMessages(Array.isArray(res?.data) ? res.data : []);
        }
      })
      .catch((err) => {
        if (mounted) setError(err.response?.data?.message || "Unable to load messages");
      })
      .finally(() => {
        if (mounted) setLoadedConversationId(conversation._id);
      });

    joinConversation(conversation._id);

    const handleNew = (message) => {
      if (String(message?.conversation) !== String(conversation._id)) return;
      setMessages((current) =>
        current.some((item) => item._id === message._id) ? current : [...current, message],
      );
    };

    const handleDeleted = (message) => {
      if (String(message?.conversation) !== String(conversation._id)) return;
      setMessages((current) => current.map((item) => (item._id === message._id ? message : item)));
    };

    const handleRead = (message) => {
      if (String(message?.conversation) !== String(conversation._id)) return;
      setMessages((current) => current.map((item) => (item._id === message._id ? { ...item, readAt: message.readAt } : item)));
    };

    onNewMessage(handleNew);
    onMessageDeleted(handleDeleted);
    onMessageRead(handleRead);

    return () => {
      mounted = false;
      leaveConversation(conversation._id);
      offNewMessage(handleNew);
      offMessageDeleted(handleDeleted);
      offMessageRead(handleRead);
    };
  }, [conversation?._id]);

  useEffect(() => {
    const unread = messages.filter(
      (message) =>
        String(message?.sender?._id || message?.sender) !== String(currentUserId) &&
        !message.readAt &&
        !message.deletedAt,
    );

    unread.forEach((message) => {
      markMessageAsRead(message._id)
        .then(() => {
          setMessages((current) =>
            current.map((item) =>
              item._id === message._id
                ? { ...item, readAt: new Date().toISOString() }
                : item,
            ),
          );
        })
        .catch(() => {});
      emitMessageRead(message);
    });
  }, [messages, currentUserId]);

  const send = async (content) => {
    if (!conversation?._id) return;

    await new Promise((resolve, reject) => {
      emitNewMessage(
        { conversation: conversation._id, content },
        (response) => {
          if (!response?.success) {
            reject(new Error(response?.message || "Failed to send message"));
            return;
          }
          if (response.data) {
            setMessages((current) => [...current, response.data]);
          }
          resolve();
        },
      );
    });
  };

  const remove = async (message) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      const response = await deleteMessage(message._id);
      const deleted = { ...message, deletedAt: new Date().toISOString() };
      setMessages((current) => current.map((item) => (item._id === message._id ? deleted : item)));
      emitMessageDeleted(response?.data || deleted);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete message");
    }
  };

  if (!conversation) {
    return (
      <section className="hidden min-h-0 flex-1 items-center justify-center bg-slate-50 md:flex">
        <div className="max-w-sm px-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-blue-600 shadow-sm ring-1 ring-slate-200">
            <UserRound className="h-7 w-7" />
          </div>
          <h2 className="mt-5 text-xl font-bold text-slate-900">Choose a conversation</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">Select a person from the inbox to view your messages.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex min-h-0 flex-1 flex-col bg-white">
      <header className="flex h-[76px] shrink-0 items-center justify-between border-b border-slate-200 px-4 md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-blue-100 font-semibold text-blue-700">{name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h2 className="truncate font-semibold text-slate-900">{name}</h2>
            <p className="truncate text-xs text-slate-500">{other?.role?.replace("_", " ") || "Campus user"}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" title="Conversation options">
          <MoreVertical className="h-5 w-5 text-slate-500" />
        </Button>
      </header>

      {error && <div className="border-b border-red-100 bg-red-50 px-6 py-2 text-xs text-red-600">{error}</div>}

      {loading ? (
        <div className="flex flex-1 items-center justify-center text-sm text-slate-500">Loading messages…</div>
      ) : (
        <MessageList messages={messages} currentUserId={currentUserId} onDelete={remove} />
      )}

      <MessageInput onSend={send} disabled={loading} />
    </section>
  );
}
