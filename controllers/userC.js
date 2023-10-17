import { userModel } from "../models/userM.js";
import bcrypt from 'bcrypt';

export const register = async (req, res, next)=>{

    try {
        const {username, email, password} = req.body;

    const checkUsername = await userModel.findOne({ username })
        if(checkUsername) return res.status(409).json({msg:"Username already exist", stat:false})

    const checkemail = await userModel.findOne({ email })
        if(checkemail) return res.status(409).json({msg:"email already exist", stat:false})

    
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = userModel.create({username, email, password: hashedPassword})
    res.status(201).json({
        _id:newUser._id,
        username: newUser.username,
        email:newUser.email, 
        isAvatarSet:newUser.isAvatarSet,
        avatarImage:newUser.avatarImage, 
         stat:true})
    } catch (error) {
        next(error);
    }

    
}
export const login = async (req, res, next)=>{
    console.log(req.body);
    try {
        const {username, password} = req.body;

    const user = await userModel.findOne({ username })
    console.log(user);
        if(!user) return res.status(404).json({msg:"User not found!", stat:false})

    const isPasswordCorret = await bcrypt.compare(req.body.password, user.password)
        if(!isPasswordCorret) return res.status(400).json({msg:"Wrong password", stat:false})

    res.status(200).json({
        _id:user._id,
        username: user.username,
        email:user.email, 
        isAvatarSet:user.isAvatarSet,
        avatarImage:user.avatarImage,
        stat:true})
    } catch (error) {
        next(error);
    }
}

export const setAvatar =async (req, res, next)=>{
    try {
        const userID = req.params.id
        const avatarImage = req.body.image

        const userData = await userModel.findByIdAndUpdate({_id:userID},{
            isAvatarSet:true,
            avatarImage:avatarImage,
        }, { new:true })
        return res.status(200).json({isSet:userData.isAvatarSet, avatarImage:userData.avatarImage})
    } catch (error) {
        next(error)
    }
}

export const getAllUsers = async(req, res, next)=>{
    try {
        const userID = req.params.id;
        const allUsers = await userModel.find({_id:{$ne: userID}}).select([
            "username", "email", "avatarImage", "_id"
        ])
        return res.status(200).json(allUsers)
    } catch (error) {
        res.status(500).json(error)
    }
}