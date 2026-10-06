import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

export const socket = io(SOCKET_URL, {
    autoConnect: false,

    auth: {
        token: localStorage.getItem("token")
    }
});


// Connect socket
export const connectSocket = () => {
    if (!socket.connected) {
        socket.connect();
    }
};


// Disconnect socket
export const disconnectSocket = () => {
    if (socket.connected) {
        socket.disconnect();
    }
};


// Join conversation
export const joinConversation = (conversationId) => {
    if (!conversationId) {
        return;
    }

    socket.emit(
        "conversation:join",
        conversationId
    );
};


// Leave conversation
export const leaveConversation = (conversationId) => {
    if (!conversationId) {
        return;
    }

    socket.emit(
        "conversation:leave",
        conversationId
    );
};


// Send message event
export const emitNewMessage = (message) => {
    socket.emit(
        "message:send",
        message
    );
};


// Delete message event
export const emitMessageDeleted = (message) => {
    socket.emit(
        "message:delete",
        message
    );
};


// Read message event
export const emitMessageRead = (message) => {
    socket.emit(
        "message:read",
        message
    );
};


// Listen for new messages
export const onNewMessage = (callback) => {
    socket.on(
        "message:new",
        callback
    );
};


// Listen for deleted messages
export const onMessageDeleted = (callback) => {
    socket.on(
        "message:deleted",
        callback
    );
};


// Listen for read messages
export const onMessageRead = (callback) => {
    socket.on(
        "message:read",
        callback
    );
};


// Remove listeners
export const offNewMessage = (callback) => {
    socket.off(
        "message:new",
        callback
    );
};

export const offMessageDeleted = (callback) => {
    socket.off(
        "message:deleted",
        callback
    );
};

export const offMessageRead = (callback) => {
    socket.off(
        "message:read",
        callback
    );
};