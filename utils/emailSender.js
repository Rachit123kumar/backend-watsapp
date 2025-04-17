    import nodemailer from "nodemailer";
    import 'dotenv/config'
    export const transporter=nodemailer.createTransport({
        host:"smtp.gmail.com",
        port:465,
        secure:true,
        auth:{
            user:process.env.GMAIL,
            pass:process.env.GMAIL_PASSWORD
        }
    })

    export async function sendMails(mail,otp){
        const info=await transporter.sendMail({
            from:process.env.GMAIL,
            to:mail,
            subject:"Please verify the otp",
            text:"67829",
            html:`<b>Very Nice welcome THis is your otp${otp} </b>`
        })

        console.log("message sent %s");

    }
    // sendMails.catch((err)=>console.error(err))

    