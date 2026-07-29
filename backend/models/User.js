
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
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
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHVyb1aBwW0cL5bV2o4hY9bWXgzz_QvXxzbw1c_mQamw&s=10"
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
    }
},{timestamps:true})

const User = mongoose.model('User',userSchema)

export default User;