import express from "express";

import {
    sendMessageController,
    getMessagesController,
    deleteMessageController,
    markMessageAsReadController
} from "../controllers/message.controller.js";

import { protect } from "../../../middlewares/auth.middleware.js";

const router = express.Router();


// Get all messages of a conversation
router.get(
    "/conversation/:conversationId",
    protect,
    getMessagesController
);


// Send a message
router.post(
    "/conversation/:conversationId",
    protect,
    sendMessageController
);


// Delete a message
router.delete(
    "/:messageId",
    protect,
    deleteMessageController
);


// Mark message as read
router.patch(
    "/:messageId/read",
    protect,
    markMessageAsReadController
);


export default router;