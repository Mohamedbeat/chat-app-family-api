import { msgModel } from "../models/msgM.js"



export const addMsg = async(req, res, next)=>{

    try {
        
        const {from, to, message} = req.body

        const data = await msgModel.create({
            message:{text: message},
            users:[from, to],
            sender:from,
        }) 

        if(data){
            return res.status(200).json({msg: "message added successfully to database"})
        }else{
            return res.status(500).json({msg: "failed to add message to database"})
        }

    } catch (error) {
        next(error)
    }
} 



export const getAllMsgs = async (req, res, next)=>{
    try {
        
        const {from, to} = req.body

        const msgs = await msgModel.find({
            users:{
                $all:[from, to]
            }
        }).sort({updatedAt:1})

        const projectMsgs = msgs.map((msg)=>{
            return{
                fromSelf : msg.sender.toString() === from,
                message: msg.message.text,
            }
        })
        res.status(200).json(projectMsgs)

    } catch (error) {
        next(error)
    }
} 