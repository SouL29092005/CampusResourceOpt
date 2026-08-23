import {
    sendMessage,
    getMessages,
    deleteMessage,
    markMessageAsRead
} from "../services/message.service.js";


// Send a message
export const sendMessageController = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { content } = req.body;
        const senderId = req.user._id;

        const message = await sendMessage(
            conversationId,
            senderId,
            content
        );

        return res.status(201).json({
            message: "Message sent successfully",
            data: message
        });

    } catch (error) {
        console.error("sendMessageController error:", error);

        return res.status(500).json({
            message: error.message
        });
    }
};


// Get all messages of a conversation
export const getMessagesController = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.user._id;

        const messages = await getMessages(
            conversationId,
            userId
        );

        return res.status(200).json({
            data: messages
        });

    } catch (error) {
        console.error("getMessagesController error:", error);

        return res.status(500).json({
            message: error.message
        });
    }
};


// Delete a message
export const deleteMessageController = async (req, res) => {
    try {
        const { messageId } = req.params;
        const userId = req.user._id;

        await deleteMessage(
            messageId,
            userId
        );

        return res.status(200).json({
            message: "Message deleted successfully"
        });

    } catch (error) {
        console.error("deleteMessageController error:", error);

        return res.status(500).json({
            message: error.message
        });
    }
};


// Mark a message as read
export const markMessageAsReadController = async (req, res) => {
    try {
        const { messageId } = req.params;
        const userId = req.user._id;

        await markMessageAsRead(
            messageId,
            userId
        );

        return res.status(200).json({
            message: "Message marked as read"
        });

    } catch (error) {
        console.error("markMessageAsReadController error:", error);

        return res.status(500).json({
            message: error.message
        });
    }
};