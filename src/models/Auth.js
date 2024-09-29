import prisma from '../config/database.js'
import bcrypt from 'bcrypt'

const register = async (reqData) => {
  const { username, email, password, role = 'customer', profile_image = null, refresh_token = null } = reqData

  // Filter email to lower case & no spacing (trim)
  const normalizedEmail = email.toLowerCase().trim()

  // find email from db
  const existsEmail = await prisma.Users.findUnique({
    where: { email: normalizedEmail },
  })

  // check email exists or no
  if (existsEmail) {
    throw new Error('Email already exists')
  }

  // Hash Password
  const salt = await bcrypt.genSalt(10)
  const hashPassword = await bcrypt.hash(password, salt)

  // Store data new user on variable userFields
  const userFields = {
    username: username.trim(),
    email: normalizedEmail,
    password: hashPassword,
    role: role,
    profile_image: profile_image,
    refresh_token: refresh_token,
  }

  try {
    // Create new user
    const result = await prisma.Users.create({
      data: userFields,
    })

    return result
  } catch (error) {
    throw new Error('Error while register: ' + error.message)
  }
}

const getUserByToken = async (token) => {
  try {
    const result = await prisma.Users.findFirst({
      where: { refresh_token: token },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        refresh_token: true,
      },
    })

    return result
  } catch (error) {
    throw new Error('Error get user by token: ' + error.message)
  }
}

const updateUserToken = async (userId, token) => {
  try {
    const result = await prisma.Users.update({
      where: { id: userId },
      data: { refresh_token: token },
    })

    return result
  } catch (error) {
    throw new Error('Error update token: ' + error.message)
  }
}

const deleteUserToken = async (userId) => {
  try {
    const result = await prisma.Users.update({
      where: { id: userId },
      data: { refresh_token: null },
    })

    return result
  } catch (error) {
    throw new Error('Error delete token: ' + error.message)
  }
}

export default {
  register,
  getUserByToken,
  updateUserToken,
  deleteUserToken,
}
