import { MessageSquare, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import ConversationItem from "./ConversationItem";

export default function ConversationList({
  conversations,
  currentUserId,
  selectedId,
  onSelect,
  search,
  onSearch,
}) {
  const filtered = conversations.filter((conversation) => {
    const other = conversation?.participants?.find(
      (participant) => String(participant?._id) !== String(currentUserId),
    );
    const text = `${other?.name || ""} ${other?.email || ""}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  return (
    <aside className="flex h-full min-h-0 w-full flex-col border-r border-slate-200 bg-white md:w-[340px]">
      <div className="border-b border-slate-100 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">Inbox</p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">Messages</h2>
          </div>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm transition hover:bg-blue-700"
            title="New conversation"
            disabled
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Search conversations"
            className="h-10 rounded-xl border-slate-200 bg-slate-50 pl-9"
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {filtered.length === 0 ? (
          <div className="flex h-full min-h-56 flex-col items-center justify-center px-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <MessageSquare className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-800">No conversations</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Conversations will appear here when you start messaging another campus user.
            </p>
          </div>
        ) : (
          filtered.map((conversation) => (
            <ConversationItem
              key={conversation._id}
              conversation={conversation}
              currentUserId={currentUserId}
              active={conversation._id === selectedId}
              onClick={() => onSelect(conversation)}
            />
          ))
        )}
      </div>
    </aside>
  );
}
