import Message from "../models/Message.model.js";
import Conversation from "../models/Conversation.model.js";


// Send a message
export const sendMessage = async (conversationId, senderId, content) => {
    if (!content || !content.trim()) {
        throw new Error("Message content is required");
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
        throw new Error("Conversation not found");
    }

    // Check whether sender is a participant
    const isParticipant = conversation.participants.some(
        participant => participant.toString() === senderId.toString()
    );

    if (!isParticipant) {
        throw new Error("You are not a participant of this conversation");
    }

    // Create message
    const message = await Message.create({
        conversation: conversationId,
        sender: senderId,
        content: content.trim()
    });

    // Update last message
    conversation.lastMessage = message._id;
    await conversation.save();

    // Populate sender information
    await message.populate("sender", "name email role");

    return message;
};


// Get all messages in a conversation
export const getMessages = async (conversationId, userId) => {
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
        throw new Error("Conversation not found");
    }

    // Check whether user is a participant
    const isParticipant = conversation.participants.some(
        participant => participant.toString() === userId.toString()
    );

    if (!isParticipant) {
        throw new Error("You are not a participant of this conversation");
    }

    const messages = await Message.find({
        conversation: conversationId
    })
        .populate("sender", "name email role")
        .sort({ createdAt: 1 });

    return messages;
};


// Delete a message
export const deleteMessage = async (messageId, userId) => {
    const message = await Message.findById(messageId);

    if (!message) {
        throw new Error("Message not found");
    }

    // Only sender can delete the message
    if (message.sender.toString() !== userId.toString()) {
        throw new Error("You can only delete your own messages");
    }

    // Soft delete
    message.deletedAt = new Date();

    await message.save();

    return message;
};


// Mark a message as read
export const markMessageAsRead = async (messageId, userId) => {
    const message = await Message.findById(messageId);

    if (!message) {
        throw new Error("Message not found");
    }

    const conversation = await Conversation.findById(message.conversation);

    if (!conversation) {
        throw new Error("Conversation not found");
    }

    // Check whether user is a participant
    const isParticipant = conversation.participants.some(
        participant => participant.toString() === userId.toString()
    );

    if (!isParticipant) {
        throw new Error("You are not a participant of this conversation");
    }

    // Sender doesn't need to mark their own message as read
    if (message.sender.toString() === userId.toString()) {
        throw new Error("You cannot mark your own message as read");
    }

    message.readAt = new Date();

    await message.save();

    return message;
};