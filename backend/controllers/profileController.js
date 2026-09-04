import {
    getUserProfile,
    updateUserProfile,
    changeUserPassword,
    getPublicAuthorProfile,
} from "../services/profileServices.js";

export const getAuthorProfile = async (req, res) => {
    try {
        const data = await getPublicAuthorProfile(req.params.id);
        res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};

export const getMe = async(req,res)=>{
    try {
        const user = await getUserProfile(req.id)
        res.status(200).json({
            success:true,
            message:"user profile fetching successful",
            user
        })
    } catch (error) {
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}
export const updateProfile = async(req,res)=>{
    try {
        const updatedUser = await updateUserProfile(req.id,req.body)
        res.status(200).json({
            success:true,
            message:"user profile updated successful",
            updatedUser
        })
    } catch (error) {
        res.status(401).json({
            success:false,
            message:error.message
        })
    }
}
export const changePassword = async(req,res)=>{
    try {
        const { oldPassword, newPassword } = req.body;
        const updatedUser = await changeUserPassword(req.id,oldPassword,newPassword)
        res.status(200).json({
            success:true,
            message:"Password Changed",
            updatedUser
        })
    } catch (error) {
        res.status(401).json({
            success:false,
            message:error.message
        })
    }
}