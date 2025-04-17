
import mongoose from "mongoose"

const UserSchema=mongoose.Schema({
    fullName:{
        type:String,
        required:[true,"a user must have a name"]
    },
    email:{
        type:String,
        required:[true,"a user must have email"],
        unique:true
    },
    profileImage:{
        type:String,
        default:''
    },
    password:{
        type:String,
        required:[true," a user must have a passord"]
    }
   
    

},{timeStamps:true})

const User=mongoose.model("User",UserSchema)

export default User;