import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
export const login = async (req, res) => {
    try {


        const { email, password } = req.body;
        console.log(email, password)
        if (!email || !password) {
            return res.status(404).json({
                message: "Please give me email and password"
            })
        }
        const user = await User.findOne({
            email
        })
        console.log(user)

        if (!user) {
            return res.status(404).json({
                message: "no account exists for this email"
            })
        }
        const isCorrectPassword = await bcrypt.compare(password, user.password);

        if (!isCorrectPassword) {
            return res.status(404).json({
                message: "invalid Credentials"
            })
        }



        return res.status(200).json({
            fullName: user.fullName,
            email: user.email,
            profileImage: user.profileImage,
            userId: user._id

        })

    } catch (err) {



        console.error(err)
        res.status(500).json({
            message: "Internall server error "
        })
    } finally {

    }




}



export const signup = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        console.log(fullName, email, password)
        if (!fullName || !email || !password) {
            return res.status(404).json({
                message: "please provide all the details"
            })
        }



        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(200).json({
                message: "You already have an account"

            })
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "password lenght must me greater than 6 character"
            })
        }
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            email,
            fullName,
            password: hash
        })

        res.status(201).json({
            email: newUser.email,
            // password:newUser.password
            fullName: newUser.fullName,

        })
    } catch (err) {
        console.error(err)
        res.status(500).json({
            message: "internal server Error "
        })
    }

}

export const getAllUser = async (req, res) => {
    const {userId}=req.query;
    try {
        const allUsers = await User.find({
          _id:{$ne:userId}
        }).select('-password')


        res.status(200).json(allUsers)
    } catch (err) {
        console.error(err)
        res.status(500).json({
            message:"internal server error"
        })

    }

}