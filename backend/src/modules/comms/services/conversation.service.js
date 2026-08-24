import Conversation from "../models/Conversation.model.js";
import User from "../../users/user.model.js";

export const createConversation = async (currentUserId, otherUserId) => {
    if (!otherUserId) {
        throw new Error("Other user ID is required");
    }

    if (currentUserId.toString() === otherUserId.toString()) {
        throw new Error("You cannot create a conversation with yourself");
    }

    const otherUser = await User.findById(otherUserId);

    if (!otherUser) {
        throw new Error("User not found");
    }

    let conversation = await Conversation.findOne({
        participants: {
            $all: [currentUserId, otherUserId]
        }
    }).populate(
        "participants",
        "fullname email role profile"
    );

    if (conversation) {
        return conversation;
    }

    conversation = await Conversation.create({
        participants: [currentUserId, otherUserId]
    });

    conversation = await Conversation.findById(conversation._id)
        .populate(
            "participants",
            "fullname email role profile"
        );

    return conversation;
};


export const getUserConversations = async (userId) => {
    const conversations = await Conversation.find({
        participants: userId
    })
        .populate(
            "participants",
            "fullname email role profile"
        )
        .sort({
            lastMessageAt: -1,
            updatedAt: -1
        });

    return conversations;
};


export const getConversationById = async (
    conversationId,
    userId
) => {
    const conversation = await Conversation.findOne({
        _id: conversationId,
        participants: userId
    }).populate(
        "participants",
        "fullname email role profile"
    );

    if (!conversation) {
        throw new Error("Conversation not found");
    }

    return conversation;
};


export const updateLastMessage = async (
    conversationId,
    message,
    messageAt = new Date()
) => {
    const conversation = await Conversation.findByIdAndUpdate(
        conversationId,
        {
            lastMessage: message,
            lastMessageAt: messageAt
        },
        {
            new: true
        }
    ).populate(
        "participants",
        "fullname email role profile"
    );

    if (!conversation) {
        throw new Error("Conversation not found");
    }

    return conversation;
};


export const deleteConversation = async (
    conversationId,
    userId
) => {
    const conversation = await Conversation.findOneAndDelete({
        _id: conversationId,
        participants: userId
    });

    if (!conversation) {
        throw new Error("Conversation not found");
    }

    return conversation;
};