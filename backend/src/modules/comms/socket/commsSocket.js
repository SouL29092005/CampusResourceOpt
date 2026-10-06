import jwt from "jsonwebtoken";
import User from "../../users/user.model.js";
import {
    deleteMessage,
    markMessageAsRead,
    sendMessage
} from "../services/message.service.js";
import { getConversationById } from "../services/conversation.service.js";

export const initializeCommsSocket = (io) => {

    // =========================
    // Socket authentication
    // =========================

    io.use(async (socket, next) => {

        try {

            const token = socket.handshake.auth?.token;

            if (!token) {
                return next(
                    new Error("Not authorized")
                );
            }

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            const user = await User.findById(
                decoded.id
            );

            if (!user || !user.isActive) {
                return next(
                    new Error("User not authorized")
                );
            }

            // Store authenticated user
            // on the socket
            socket.user = user;

            next();

        } catch (error) {

            return next(
                new Error("Invalid or expired token")
            );

        }

    });


    // =========================
    // Connection
    // =========================

    io.on("connection", (socket) => {

        console.log(
            `Communication socket connected: ${socket.id}`
        );

        console.log(
            `User connected: ${socket.user._id}`
        );


        // =========================
        // Join conversation
        // =========================

        socket.on(
            "conversation:join",
            async (conversationId) => {

                if (!conversationId) {
                    socket.emit("conversation:error", {
                        message: "Conversation ID is required"
                    });
                    return;
                }

                try {
                    await getConversationById(
                        conversationId,
                        socket.user._id
                    );

                    await socket.join(
                        `conversation:${conversationId}`
                    );

                    console.log(
                        `${socket.user._id} joined conversation:${conversationId}`
                    );
                } catch (error) {
                    console.error("Socket conversation join error:", error);
                    socket.emit("conversation:error", {
                        conversationId,
                        message: error.message
                    });
                }

            }
        );


        // =========================
        // Leave conversation
        // =========================

        socket.on(
            "conversation:leave",
            (conversationId) => {

                if (!conversationId) {
                    return;
                }

                socket.leave(
                    `conversation:${conversationId}`
                );

            }
        );


        // =========================
        // New message
        // =========================

        socket.on(
            "message:send",
            async (message, acknowledge) => {

                if (!message?.conversation) {
                    const response = {
                        success: false,
                        message: "Conversation ID is required"
                    };

                    if (typeof acknowledge === "function") {
                        acknowledge(response);
                    } else {
                        socket.emit("message:error", response);
                    }
                    return;
                }

                try {
                    const savedMessage = await sendMessage(
                        message.conversation,
                        socket.user._id,
                        message.content
                    );

                    socket.to(`conversation:${message.conversation}`).emit(
                        "message:new",
                        savedMessage
                    );

                    if (typeof acknowledge === "function") {
                        acknowledge({
                            success: true,
                            data: savedMessage
                        });
                    }
                } catch (error) {
                    console.error("Socket message send error:", error);
                    const response = {
                        success: false,
                        message: error.message
                    };

                    if (typeof acknowledge === "function") {
                        acknowledge(response);
                    } else {
                        socket.emit("message:error", response);
                    }
                }

            }
        );


        // =========================
        // Message deleted
        // =========================

        socket.on(
            "message:delete",
            async (message) => {

                const messageId = message?._id || message?.id;
                if (!messageId) {
                    socket.emit("message:error", {
                        success: false,
                        message: "Message ID is required"
                    });
                    return;
                }

                try {
                    const deletedMessage = await deleteMessage(
                        messageId,
                        socket.user._id
                    );

                    socket.to(`conversation:${deletedMessage.conversation}`).emit(
                        "message:deleted",
                        deletedMessage
                    );
                } catch (error) {
                    console.error("Socket message delete error:", error);
                    socket.emit("message:error", {
                        success: false,
                        message: error.message
                    });
                }

            }
        );


        // =========================
        // Message read
        // =========================

        socket.on(
            "message:read",
            async (message) => {

                const messageId = message?._id || message?.id;
                if (!messageId) {
                    socket.emit("message:error", {
                        success: false,
                        message: "Message ID is required"
                    });
                    return;
                }

                try {
                    const readMessage = await markMessageAsRead(
                        messageId,
                        socket.user._id
                    );

                    socket.to(`conversation:${readMessage.conversation}`).emit(
                        "message:read",
                        readMessage
                    );
                } catch (error) {
                    console.error("Socket message read error:", error);
                    socket.emit("message:error", {
                        success: false,
                        message: error.message
                    });
                }

            }
        );


        // =========================
        // Disconnect
        // =========================

        socket.on(
            "disconnect",
            () => {

                console.log(
                    `Communication socket disconnected: ${socket.id}`
                );

            }
        );

    });

};