import { createUser, findUserByEmail, findUserByIdAndUpdate } from "../repositories/userRepositories.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

export const generateRecoveryKey = () => {
  const bytes = crypto.randomBytes(6).toString('hex').toUpperCase()
  return `BZ-${bytes.slice(0, 4)}-${bytes.slice(4, 8)}-${bytes.slice(8, 12)}`
}

export const signupUser = async ({ name, email, password }) => {
  const existingUser = await findUserByEmail(email)
  if (existingUser) {
    throw new Error("User already exists with this email")
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const recoveryKey = generateRecoveryKey()
  const newUser = await createUser({
    name,
    email,
    password: hashedPassword,
    recoveryKey,
  })

  const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '48h' })

  // Return shape matching loginUser for instant authentication + recoveryKey for display
  return {
    token,
    recoveryKey,
    user: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      profileImage: newUser.profileImage,
      bio: newUser.bio,
      recoveryKey: newUser.recoveryKey,
    },
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
  // user.name, user.email, user._id, user.profileImage, user.recoveryKey
  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      bio: user.bio,
      recoveryKey: user.recoveryKey,
    },
  }
}

export const resetPasswordWithRecoveryKey = async ({ email, recoveryKey, newPassword }) => {
  if (!email || !recoveryKey || !newPassword) {
    throw new Error("Email, recovery key, and new password are all required.")
  }

  if (newPassword.length < 6) {
    throw new Error("New password must be at least 6 characters.")
  }

  const user = await findUserByEmail(email.trim().toLowerCase())
  if (!user) {
    throw new Error("Invalid email address or recovery key.")
  }

  const storedKey = (user.recoveryKey || "").trim().toUpperCase()
  const providedKey = recoveryKey.trim().toUpperCase()

  if (!storedKey || storedKey !== providedKey) {
    throw new Error("Invalid email address or recovery key.")
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10)
  await findUserByIdAndUpdate(user._id, { password: hashedPassword })

  return {
    success: true,
    message: "Password reset successful. You can now log in with your new password.",
  }
}