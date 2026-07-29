import { createUser, findUserByEmail } from "../repositories/userRepositories.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const signupUser = async ({ name, email, password }) => {
  const existingUser = await findUserByEmail(email)
  if (existingUser) {
    throw new Error("User already exists with this email")
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const newUser = await createUser({ name, email, password: hashedPassword })

  // Return shape consistent with loginUser so AppContext can handle both
  return {
    userId: newUser._id,
    name: newUser.name,
    email: newUser.email,
  }
}

export const loginUser = async ({ email, password }) => {
  const user = await findUserByEmail(email)
  if (!user) {
    throw new Error("Invalid email or password")
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    throw new Error("Invalid email or password")
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '48h' })

  // Return user shape that matches what frontend expects:
  // user.name, user.email, user._id, user.profileImage
  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      bio: user.bio,
    },
  }
}