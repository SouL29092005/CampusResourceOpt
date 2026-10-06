import express from "express";

import {
    createConversationController,
    getConversations,
    getConversation,
    removeConversation
} from "../controllers/conversation.controller.js";

import { protect } from "../../../middlewares/auth.middleware.js";

const router = express.Router();


// Create or get conversation with another user
router.post(
    "/",
    protect,
    createConversationController
);


// Get all conversations of logged-in user
router.get(
    "/",
    protect,
    getConversations
);


// Get a specific conversation
router.get(
    "/:conversationId",
    protect,
    getConversation
);


// Delete conversation
router.delete(
    "/:conversationId",
    protect,
    removeConversation
);


export default router;