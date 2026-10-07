import { MessageCircle, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function getOtherParticipant(conversation, currentUserId) {
  return conversation?.participants?.find(
    (participant) => String(participant?._id) !== String(currentUserId),
  ) || conversation?.participants?.[0];
}

export default function ConversationItem({
  conversation,
  currentUserId,
  active,
  onClick,
}) {
  const other = getOtherParticipant(conversation, currentUserId);
  const name = other?.name || other?.email || "Campus User";
  const initial = name.charAt(0).toUpperCase();
  const lastMessage = conversation?.lastMessage?.content || "Start a conversation";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${
        active
          ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
          : "hover:bg-slate-100"
      }`}
    >
      <Avatar className="h-11 w-11 shrink-0 border border-white/50">
        <AvatarFallback
          className={active ? "bg-white/20 text-white" : "bg-blue-100 text-blue-700"}
        >
          {initial}
        </AvatarFallback>
      </Avatar>

      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="truncate font-semibold">{name}</span>
          <span className={`text-[11px] ${active ? "text-blue-100" : "text-slate-400"}`}>
            {conversation?.updatedAt
              ? new Date(conversation.updatedAt).toLocaleDateString([], {
                  month: "short",
                  day: "numeric",
                })
              : ""}
          </span>
        </span>
        <span className={`mt-1 block truncate text-xs ${active ? "text-blue-100" : "text-slate-500"}`}>
          {lastMessage}
        </span>
      </span>

      <MoreHorizontal className={`hidden h-4 w-4 shrink-0 sm:block ${active ? "text-blue-100" : "text-slate-400"}`} />
    </button>
  );
}
