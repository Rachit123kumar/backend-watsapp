
import mongoose from "mongoose"


const messageSchema = mongoose.Schema({
    senderId: {
        type: String,
        required: [true, "a message must have a sender Id"]
    },
    receiverId: {
        type: String,
        required: [true, "a message must have a receiver Id"]
    },
    image: {
        type: String,
        default: ""
    },
    text: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: ["sent", "delievered", "seen"],
        default: "sent"
    },
    replyToContent: {
        senderId:String,
        content:String,
        image:String

    }
}, { timestamps: true })

const Message = mongoose.model('Message', messageSchema)

export default Message