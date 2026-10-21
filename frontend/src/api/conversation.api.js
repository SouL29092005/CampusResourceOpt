import api from "./axios";

// Create or get conversation with another user
export const createConversation = async (userId) => {
    const response = await api.post("/conversations", {
        userId
    });

    return response.data;
};

// Get all conversations of logged-in user
export const getConversations = async () => {
    const response = await api.get("/conversations");

    return response.data;
};

// Get a specific conversation
export const getConversation = async (conversationId) => {
    const response = await api.get(
        `/conversations/${conversationId}`
    );

    return response.data;
};

// Delete a conversation
export const deleteConversation = async (conversationId) => {
    const response = await api.delete(
        `/conversations/${conversationId}`
    );

    return response.data;
};

export const findUserByEmail = async (email) => {
    const response = await api.get("/users/search", {
        params: { email }
    });

    return response.data;
};

export const clearConversation = async (conversationId) => {
    const response = await api.delete(
        `/conversations/${conversationId}/messages`
    );

    return response.data;
};