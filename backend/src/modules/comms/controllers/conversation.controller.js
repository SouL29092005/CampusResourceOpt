import {
    createConversation,
    getUserConversations,
    getConversationById,
    deleteConversation
} from "../services/conversation.service";


export const createConversationController = async (req, res) => {
    try {
        const currentUserId = req.user._id || req.user.id;
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        const conversation = await createConversation(
            currentUserId,
            userId
        );

        return res.status(201).json({
            success: true,
            message: "Conversation created successfully",
            conversation
        });

    } catch (error) {
        console.error(
            "Create conversation error:",
            error
        );

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


export const getConversations = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;

        const conversations = await getUserConversations(
            userId
        );

        return res.status(200).json({
            success: true,
            conversations
        });

    } catch (error) {
        console.error(
            "Get conversations error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch conversations"
        });
    }
};


export const getConversation = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const { conversationId } = req.params;

        const conversation = await getConversationById(
            conversationId,
            userId
        );

        return res.status(200).json({
            success: true,
            conversation
        });

    } catch (error) {
        console.error(
            "Get conversation error:",
            error
        );

        return res.status(404).json({
            success: false,
            message: error.message
        });
    }
};


export const removeConversation = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const { conversationId } = req.params;

        await deleteConversation(
            conversationId,
            userId
        );

        return res.status(200).json({
            success: true,
            message: "Conversation deleted successfully"
        });

    } catch (error) {
        console.error(
            "Delete conversation error:",
            error
        );

        return res.status(404).json({
            success: false,
            message: error.message
        });
    }
};