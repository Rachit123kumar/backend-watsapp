import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
    try {
        const { senderId, receiverId, text, image } = req.body;
        if (!senderId || !receiverId) {
            return res.status(404).json({
                message: "please give me senderId and receiverId"
            })
        }

        if (!text && !image) {
            return res.status(404).json({
                message: "please give us text or image"
            })
        }
        const message = await Message.create({
            senderId,
            receiverId,
            text,
            image
        })


        res.status(200).json(message)

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "internal server error"
        })
    }
}

export const getMessage = async (req, res) => {
    const { senderId, receiverId } = req.query;
  
    if (!senderId || !receiverId) {
      return res.status(400).json({
        message: "Please provide both senderId and receiverId",
      });
    }
  
    try {
      const messages = await Message.find({
        $or: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      }).sort({ createdAt: 1 }); // sort by time if needed
  
      res.status(200).json(messages);
    } catch (err) {
      console.error("Error fetching messages:", err);
      res.status(500).json({ message: "Server error while fetching messages" });
    }
  };
  