import { loginUser, signupUser } from "../services/authServices.js"

export const signup = async(req,res)=>{
    try {
        const user = await signupUser(req.body)

        res.status(201).json({
            success: true,
            message:'User Registered Successfully',
            ...user
        })
    } catch (error) {
        console.log('Error  while signup: ',error)
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}

export const login = async(req,res)=>{
    try {
        const userData = await loginUser(req.body)

        res.status(200).json({
            success: true,
            message:'User Login Successfully',
            ...userData
        })
    } catch (error) {
        res.status(401).json({
            success:false,
            message:error.message
        })
    }
}