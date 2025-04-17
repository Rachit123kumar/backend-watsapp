export class Chat{
// online User {userID,userId}
   createdAt=new Date()
    constructor(text,image,status,senderId,receiverId){
        this.text=text;
        this.image=image;
        
        this.status=status;
        this.senderId=senderId,
        this.receiverId=receiverId

    }
}

