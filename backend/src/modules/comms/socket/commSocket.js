import jwt from "jsonwebtoken";
import User from "../modules/users/user.model.js";

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
            (conversationId) => {

                if (!conversationId) {
                    return;
                }

                socket.join(
                    `conversation:${conversationId}`
                );

                console.log(
                    `${socket.user._id} joined conversation:${conversationId}`
                );

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
            (message) => {

                if (!message?.conversation) {
                    return;
                }

                const room =
                    `conversation:${message.conversation}`;

                socket.to(room).emit(
                    "message:new",
                    message
                );

            }
        );


        // =========================
        // Message deleted
        // =========================

        socket.on(
            "message:delete",
            (message) => {

                if (!message?.conversation) {
                    return;
                }

                const room =
                    `conversation:${message.conversation}`;

                socket.to(room).emit(
                    "message:deleted",
                    message
                );

            }
        );


        // =========================
        // Message read
        // =========================

        socket.on(
            "message:read",
            (message) => {

                if (!message?.conversation) {
                    return;
                }

                const room =
                    `conversation:${message.conversation}`;

                socket.to(room).emit(
                    "message:read",
                    message
                );

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