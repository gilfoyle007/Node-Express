import Chat from '../models/chat'
import Message from '../models/message'

export default {
    getSpecificUserChat: async(req, res) => {
        res.json({ message: "chat route" });
    },
    chats: async(req, res) => {
        try {
            var chat = new Chats(req.body)
            await chat.save()
            res.sendStatus(200)
                //Emit the event
            io.emit("chat", req.body)
        } catch (error) {
            res.sendStatus(500)
            console.error(error)
        }
    }
};