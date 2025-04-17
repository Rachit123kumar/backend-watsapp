

import cors from "cors";
import { WebSocketServer } from "ws"
import { createServer } from "node:http";
import dotenv from "dotenv"



import express from "express"

import { getAllUser, login, signup } from "./routers/user.route.js";
import mongoose from "mongoose";
import { getMessage, sendMessage } from "./routers/message.route.js";
import { ChatManager } from "./lib/ChatManagers.js";
import { URL } from "node:url";


dotenv.config()
const app = express();
const httpServer = app.listen(process.env.PORT)
const wss = new WebSocketServer({ server: httpServer })
const chatManager = new ChatManager()

app.use(express.json())
app.use(cors())


app.post('/user/login', login)

// app.post("/user-signup", async (req, res) => {

//     try {
//         const { email, firstName, surName, dateOfBirth, gender, password } = req.body.data;
//         console.log(email, firstName, surName, dateOfBirth, gender, password)

//         if (!email || !firstName || !surName || !dateOfBirth || !gender || !password) {
//             return res.status(200).json(
//                 {
//                     message: "please give all the fields"
//                 }
//             )
//         }

//         const user = await prisma.user.findUnique({
//             where: {

//                 email: email
//             }
//         })
//         if (user) {
//             return res.status(203).json({
//                 message: "There is already an account linked with this email"
//             })


//         }
//         const otp=Math.floor(Math.random()*1000000)
//         const newUser = await prisma.user.create({
//             data: {

//                 email,
//                 firstName,
//                 surName,
//                 // profileImage,
//                 // dateOfBirth:format(dateOfBirth,"yyyy-MM-dd"),
//                 password,
//                 otp,
//                 dateOfBirth,
//                 Gender: gender.toUpperCase(),
//                 password,
//             }



//         })
//     const mailSender=    await sendMails(email,otp);
//     console.log(mailSender)


//         res.status(201).json({
//             message: "sucessfully account created please verify your otp",
//             userEmail:newUser.email,

//         })



//     } catch (err) {
//         console.log(err)
//         res.status(400).json({
//             message: "sorry error while signup"
//         })

//     }
// })

app.post('/user/signup', signup)

// app.post("/verify-otp",async(req,res)=>{
//     try{

//         const {email,otp}=req.body;
//         console.log('Email',email,"otp",otp)
//         if(!email || !otp){
//             return res.status(502).json({
//                 message:"please send the otp  ."
//             })
//         }
//         const user=await prisma.user.findUnique({
//             where:{
//                 email
//             }
//         })
//         if(user.otp==otp){
//             console.log("otp matched")
//             // Now set the verified to true 
//             await prisma.user.update({
//                 where:{
//                     email
//                 },
//                 data:{
//                     verified:true
//                 }

//             })



//           return  res.status(200).json({
//                 message:"otp verified"
//             })

//         }
//         console.log(otp)
//         res.status(303).json({
//             message:"Invalid OTP"
//         })

//     }catch(err){
// console.error(err)
// res.status(404).json({
//     message:"error while fetching the data.."
// })
//     }
// })

// app.get('/user/message',)

app.post('/message/send', sendMessage)
app.get('/message/get', getMessage)


app.get('/user/all', getAllUser)


wss.on('connection', (ws,req) => {

    const url=new URL(req.url,`http://${req.headers.host}`);
    const userId=url.searchParams.get("userId")
    console.log(url,userId)

    ws.on('error', (err) => console.error(err))

    chatManager.addUser(ws,userId)

    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {

            
            client.send(JSON.stringify({user:chatManager.userOnline,type:"userOnline"}))
        }
    })

  




    ws.on('message', function message(data) {


        try {

            const message = JSON.parse(data.toString())
            // ws.send('You have sucessfully sended a message')
            // console.log(data.type)
            console.log(message)




            chatManager.sendMessage(ws,message)
        }
        catch (err) {
            console.error(err)
            ws.send("Error json")
        }

    })



    ws.on('close', function close() {


        chatManager.removeUser(ws)
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {

                
                client.send(JSON.stringify({user:chatManager.userOnline,type:"userOnline"}))
            }
        })


    })

 





})
wss.on('close', () => {
    console.log('A user has been disconnected')
})
mongoose.connect(process.env.MONGOOSE_URL)
// server.listen(3001, () => console.log("Your server is listening on port 3000"))