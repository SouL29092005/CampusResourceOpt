import { useState } from "react";
import { LoaderCircle, Mail, MessageSquare, Plus, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { findUserByEmail } from "../../api/conversation.api";
import ConversationItem from "./ConversationItem";

export default function ConversationList({
  conversations,
  currentUserId,
  selectedId,
  onSelect,
  search,
  onSearch,
  onCreateConversation,
  onClearConversation,
  onDeleteConversation,
}) {
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [email, setEmail] = useState("");
  const [foundUser, setFoundUser] = useState(null);
  const [searching, setSearching] = useState(false);
  const [starting, setStarting] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [modalError, setModalError] = useState("");

  const handleClearConversation = async (conversation) => {
    setProcessingId(conversation._id);
    try {
      await onClearConversation(conversation);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteConversation = async (conversation) => {
    setProcessingId(conversation._id);
    try {
      await onDeleteConversation(conversation);
    } finally {
      setProcessingId(null);
    }
  };

  const handleSearchUser = async (event) => {
    event.preventDefault();
    setFoundUser(null);
    setModalError("");
    setSearching(true);

    try {
      const response = await findUserByEmail(email.trim());
      setFoundUser(response.user);
    } catch (error) {
      setModalError(error.response?.data?.message || "Unable to search for user");
    } finally {
      setSearching(false);
    }
  };

  const handleStartConversation = async () => {
    if (!foundUser) return;

    setStarting(true);
    setModalError("");
    try {
      await onCreateConversation(foundUser._id);
      setShowNewConversation(false);
      setEmail("");
      setFoundUser(null);
    } catch (error) {
      setModalError(error.response?.data?.message || "Unable to start conversation");
    } finally {
      setStarting(false);
    }
  };

  const handleModalOpenChange = (open) => {
    setShowNewConversation(open);
    if (!open) {
      setEmail("");
      setFoundUser(null);
      setModalError("");
    }
  };

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
            onClick={() => handleModalOpenChange(true)}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm transition hover:bg-blue-700"
            title="New conversation"
            aria-label="New conversation"
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
              onClear={() => handleClearConversation(conversation)}
              onDelete={() => handleDeleteConversation(conversation)}
              processing={processingId === conversation._id}
            />
          ))
        )}
      </div>


      <Dialog open={showNewConversation} onOpenChange={handleModalOpenChange}>
        <DialogContent
          className="
      bg-white text-slate-900
      border border-slate-200
      shadow-2xl
      rounded-2xl
      sm:max-w-md
      data-[state=open]:animate-in
      data-[state=open]:fade-in-0
      data-[state=open]:zoom-in-95
      data-[state=closed]:animate-out
      data-[state=closed]:fade-out-0
      data-[state=closed]:zoom-out-95
      duration-200
    "
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-slate-900">
              New conversation
            </DialogTitle>

            <DialogDescription className="text-slate-600">
              Search for a campus user by their email address.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSearchUser} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative min-w-0 flex-1">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setFoundUser(null);
                    setModalError("");
                  }}
                  placeholder="name@campus.edu"
                  className="h-11 bg-white pl-9"
                />
              </div>
              <Button
                type="submit"
                size="icon"
                aria-label="Search user"
                title="Search user"
                disabled={searching || starting}
                className="h-11 w-11 shrink-0 rounded-full"
              >
                {searching ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>

            {modalError && (
              <p role="alert" className="text-sm text-red-600">
                {modalError}
              </p>
            )}

            {foundUser && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">
                  {foundUser.name}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {foundUser.email}
                </p>
                <p className="mt-1 text-xs capitalize text-slate-500">
                  {foundUser.role?.replace("_", " ")}
                </p>
              </div>
            )}

            <DialogFooter>
              {foundUser && (
                <Button
                  type="button"
                  onClick={handleStartConversation}
                  disabled={starting || searching}
                  className="rounded-xl bg-green-600 text-white hover:bg-green-700"
                >
                  {starting && (
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Open conversation
                </Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </aside>
  );
}
