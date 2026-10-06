import { useEffect, useState } from "react";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { getConversations } from "../api/conversation.api";
import { getMyProfile } from "../api/profile.api";
import { connectSocket, disconnectSocket } from "../socket/commsSocket";
import ConversationList from "../components/messaging/ConversationList";
import ChatWindow from "../components/messaging/ChatWindow";

export default function Messages() {
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentUserId, setCurrentUserId] = useState(localStorage.getItem("userId") || "");

  useEffect(() => {
    connectSocket();

    const load = async () => {
      try {
        setLoading(true);
        const [profileResponse, conversationsResponse] = await Promise.all([
          getMyProfile(),
          getConversations(),
        ]);

        const id = profileResponse?.data?.user?._id || profileResponse?.data?.user?.id || localStorage.getItem("userId") || "";
        setCurrentUserId(id);
        if (id) localStorage.setItem("userId", id);

        const response = conversationsResponse;
        const data = Array.isArray(response?.conversations) ? response.conversations : [];
        setConversations(data);
        setSelected(data[0] || null);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load conversations");
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => disconnectSocket();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-0 md:p-6">
      <div className="mx-auto flex h-screen max-h-[920px] max-w-7xl overflow-hidden bg-white shadow-xl md:h-[calc(100vh-48px)] md:rounded-3xl md:border md:border-slate-200">
        <div className={`${selected ? "hidden md:flex" : "flex"} min-w-0 flex-1 md:flex-none`}>
          <ConversationList
            conversations={conversations}
            currentUserId={currentUserId}
            selectedId={selected?._id}
            onSelect={setSelected}
            search={search}
            onSearch={setSearch}
          />
        </div>

        <ChatWindow
          conversation={selected}
          currentUserId={currentUserId}
          onBack={() => setSelected(null)}
        />

        {!loading && conversations.length === 0 && !error && (
          <div className="hidden md:flex" />
        )}
      </div>

      {error && (
        <div className="fixed bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm text-red-600 shadow-lg">
          <MessageSquare className="h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  );
}
