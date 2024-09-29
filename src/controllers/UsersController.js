import Users from '../models/Users.js'

const getAllUsers = async (req, res) => {
  try {
    const result = await Users.getAllUsers()

    return res.status(200).json({
      success: true,
      message: 'Get all users success',
      data: result,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

const getUserById = async (req, res) => {
  const userId = parseInt(req.params.userId)

  if (isNaN(userId)) {
    return res.status(400).json({ message: 'Invalid user id' })
  }

  try {
    const result = await Users.getUserById(userId)

    if (!result) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.status(200).json({
      success: true,
      message: 'Get user by id success',
      data: result,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

const updateProfileUser = async (req, res) => {
  try {
    // Get user id from verifyToken middleware
    const userId = req.user.userId

    if (!userId || isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user id',
      })
    }

    const { username, email, address, city, post_code, phone_number, profile_image } = req.body

    if (post_code && isNaN(post_code)) {
      return res.status(400).json({
        success: false,
        message: 'Post code must be a number',
      })
    }

    if (phone_number && isNaN(phone_number)) {
      return res.status(400).json({
        success: false,
        message: 'Phone number must be a number',
      })
    }

    const result = await Users.updateProfileUser(userId, {
      username,
      email,
      address,
      city,
      post_code,
      phone_number,
      profile_image,
    })

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: result,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

export default { getAllUsers, getUserById, updateProfileUser }
