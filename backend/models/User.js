
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password:{
        type: String,
        required: true
    },
    gender:{
        type:String,
        enum:['female','male',null],
        default:null
    },
    profileImage:{
        type:String,
        default:"https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0="
    },
    bio:{
        type: String,
        default:""
    },
    description:{
        type:String,
        default:""
    },
    writingCategory:{
    type: [String],
    default: []
    },
    recoveryKey:{
        type: String,
        default: null
    }
},{timestamps:true})

const User = mongoose.model('User',userSchema)

export default User;