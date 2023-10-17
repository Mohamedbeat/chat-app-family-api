import mongoose from "mongoose";
const msgSchema =new mongoose.Schema({
    message:{
        text:{
            type:String,
            required:true,
        },
    },
        users:Array,
        sender:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
        
    },
        {
            timestamps:true,
        }
    )

export const msgModel = mongoose.model('Msg', msgSchema)