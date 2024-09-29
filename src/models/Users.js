import prisma from '../config/database.js'

const getAllUsers = async () => {
  try {
    const result = await prisma.Users.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        profile_image: true,
        address: true,
        city: true,
        post_code: true,
        phone_number: true,
      },
      orderBy: { id: 'desc' },
    })

    return result
  } catch (error) {
    throw new Error('Error get all users: ' + error.message)
  }
}

const getUserById = async (userId) => {
  try {
    const result = await prisma.Users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        profile_image: true,
        address: true,
        city: true,
        post_code: true,
        phone_number: true,
      },
    })

    if (!result) {
      throw new Error('User not found')
    }

    return result
  } catch (error) {
    throw new Error('Error get user by id: ' + error.message)
  }
}

const getUserByEmail = async (email) => {
  try {
    const result = await prisma.Users.findUnique({
      where: { email: email },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        password: true,
      },
    })

    return result
  } catch (error) {
    throw new Error('Error get user by email: ' + error.message)
  }
}

const updateProfileUser = async (userId, reqData) => {
  // make sure user exists
  const existsUser = await prisma.Users.findUnique({
    where: { id: userId },
  })

  if (!existsUser) {
    throw new Error('User not found')
  }

  const { username, email, address, city, post_code, phone_number, profile_image } = reqData
  const updatedUser = {}

  // Username
  if (username) {
    updatedUser.username = username
  }

  // Email
  if (email) {
    const existsEmail = await prisma.Users.findUnique({
      where: { email: email },
    })

    if (existsEmail) {
      throw new Error('Email already exists')
    }

    updatedUser.email = email
  }

  // address
  if (address) {
    updatedUser.address = address
  }

  // city
  if (city) {
    updatedUser.city = city
  }

  // post_code
  if (post_code) {
    updatedUser.post_code = post_code
  }

  // Phone Number
  if (phone_number) {
    updatedUser.phone_number = phone_number
  }

  // Profile Image
  if (profile_image) {
    updatedUser.profile_image = profile_image
  }

  if (Object.keys(updatedUser).length === 0) {
    throw new Error('No changes detected. Please provide at least one field to update.')
  }

  try {
    const result = await prisma.Users.update({
      where: { id: userId },
      data: updatedUser,
      select: {
        id: true,
        username: true,
        email: true,
        address: true,
        city: true,
        post_code: true,
        phone_number: true,
        profile_image: true
      }
    })

    return result
  } catch (error) {
    throw new Error('Error update profile user: ' + error.message)
  }
}

export default {
  getAllUsers,
  getUserById,
  getUserByEmail,
  updateProfileUser,
}
