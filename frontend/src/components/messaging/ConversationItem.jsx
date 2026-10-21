import { useState } from "react";
import { Ellipsis, Eraser, LoaderCircle, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  onClear,
  onDelete,
  processing,
}) {
  const [confirmAction, setConfirmAction] = useState(null);
  const other = getOtherParticipant(conversation, currentUserId);
  const name = other?.name || other?.email || "Campus User";
  const initial = name.charAt(0).toUpperCase();
  const lastMessage = conversation?.lastMessage?.content || "Start a conversation";
  const confirmingClear = confirmAction === "clear";

  const confirmConversationAction = async () => {
    if (confirmingClear) {
      await onClear();
    } else if (confirmAction === "delete") {
      await onDelete();
    }

    setConfirmAction(null);
  };

  return (
    <div
      className={`group flex w-full items-center gap-1 rounded-2xl px-2 transition ${
        active
          ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
          : "hover:bg-slate-100"
      }`}
    >
      <button
        type="button"
        onClick={onClick}
        className="flex min-w-0 flex-1 items-center gap-3 py-3 pl-1 text-left"
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
      </button>

      {processing ? (
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center ${active ? "text-blue-100" : "text-slate-400"}`}>
          <LoaderCircle className="h-4 w-4 animate-spin" />
        </span>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              title={`Conversation options for ${name}`}
              aria-label={`Conversation options for ${name}`}
              className={`h-9 w-9 shrink-0 rounded-xl ${
                active
                  ? "text-blue-100 hover:bg-blue-700 hover:text-white"
                  : "text-slate-400 hover:bg-slate-200 hover:text-slate-700"
              }`}
            >
              <Ellipsis className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 border-slate-200 bg-white text-slate-900 shadow-lg">
            <DropdownMenuItem className="bg-white" onSelect={() => setConfirmAction("clear")}>
              <Eraser className="h-4 w-4" />
              Clear chat
            </DropdownMenuItem>
            <DropdownMenuItem className="bg-white" variant="destructive" onSelect={() => setConfirmAction("delete")}>
              <Trash2 className="h-4 w-4" />
              Delete chat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <Dialog open={Boolean(confirmAction)} onOpenChange={(open) => !open && setConfirmAction(null)}>
        <DialogContent className="border-slate-200 bg-white text-slate-900">
          <DialogHeader>
            <DialogTitle>{confirmingClear ? "Clear chat messages?" : "Delete this chat?"}</DialogTitle>
            <DialogDescription>
              {confirmingClear
                ? "All messages in this chat will be removed for both participants. This cannot be undone."
                : "This chat and all its messages will be deleted for both participants. This cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setConfirmAction(null)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmConversationAction}
              disabled={processing}
              className="bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600"
            >
              {confirmingClear ? "Clear messages" : "Delete chat"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
