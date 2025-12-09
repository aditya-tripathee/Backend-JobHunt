import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phoneNumber:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        required:true,
        enum : ["Student","Recuriter"],
        default : 'Student',
        required:true
    },
    profile:{
        bio:{
            type:String
        },
        skills:{
            type: [String],
            default : []
        },
        resume:{
            type:String
        },
        resumeOriginalName:{
            type:String
        },
        company:{
            type:mongoose.Schema.Types.ObjectId,
            ref :"Company"
        },
        profilePhoto:{
            type:String,
            default:" "
        },
    }

},{timestamps:true});




const User = mongoose.model("User",userSchema);
export default User;




