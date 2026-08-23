import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
    {
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            }
        ],

        participantKey: {
            type: String,
            required: true,
            unique: true,
            index: true
        },

        lastMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
            default: null
        }
    },
    {
        timestamps: true
    }
);

conversationSchema.path("participants").validate(function (value) {
    return value.length === 2;
}, "A conversation must have exactly two participants.");

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;