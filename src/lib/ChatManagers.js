export class ChatManager {
    userOnline = []
    users = []


    constructor(userId) {


    }

    addUser(ws, userId) {
        const userO=this.userOnline.find((el)=>el==userId)
        if(!userO){

            ws.userId = userId
            this.userOnline.push(userId)
            this.users.push(ws)
        }

    }

    removeUser(ws) {
        this.userOnline = this.userOnline.filter((user) => user !== ws.userId)
        this.users = this.users.filter((user) => user != ws)
        console.log(this.userOnline)

    }
    sendMessage(ws, data) {
        console.log(data)


        if (data.type == "private") {
            // check the user he is trying to sending is exists on online users or not
            // if not then leave 
            // if he is online then send the message to him
            const checkUserExists = this.userOnline.find((user) => user === data.receiverId)
            console.log(checkUserExists)
            if (checkUserExists) {
                // find the websocket whose userId is the receiverId
                const userId = this.users.find((user) => user.userId === checkUserExists)
                userId.send(JSON.stringify({
                    type:"private",
                    text: data.text,
                    senderId: data.senderId,
                    receiverId: data.receiverId,
                    image: data.image
                }))
                // send the message

            } else {

                // ws.send("Sorry user is not online")
            }


        }
        if (data.type == "broadcast") {


        }
        if(data.type=="typing"){
            const checkUserExists=this.userOnline.find((el)=>el==data.receiverId)
            // now find the corresponding socket
            const ws=this.users.find((el)=>el.userId==data.receiverId)
            if(checkUserExists && ws){
                ws.send(JSON.stringify({
                    type:"typing",
                    senderId:data.senderId,
                    receiverId:data.receiverId,
                    isTyping:data.isTyping
                }))

            }
        }

    }


}