import api from "./axios";

// Get all messages of a conversation
export const getMessages = async (conversationId) => {
    const response = await api.get(
        `/messages/conversation/${conversationId}`
    );

    return response.data;
};

// Send a message
export const sendMessage = async (conversationId, content) => {
    const response = await api.post(
        `/messages/conversation/${conversationId}`,
        {
            content
        }
    );

    return response.data;
};

// Delete a message
export const deleteMessage = async (messageId) => {
    const response = await api.delete(
        `/messages/${messageId}`
    );

    return response.data;
};

// Mark a message as read
export const markMessageAsRead = async (messageId) => {
    const response = await api.patch(
        `/messages/${messageId}/read`
    );

    return response.data;
};