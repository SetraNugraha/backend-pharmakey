import Auth from '../models/Auth.js'
import Users from '../models/Users.js'
import { validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const register = async (req, res) => {
  const { username, email, password, confirmPassword, role, profile_image, refresh_token } = req.body

  // Check validation input user
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'validation error',
      errors: errors.array(),
    })
  }

  // match password & confirm password
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Password do not match' })
  }

  try {
    const result = await Auth.register({
      username,
      email,
      password,
      role,
      profile_image,
      refresh_token,
    })

    return res.status(201).json({
      success: true,
      message: 'Register success',
      data: result,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

const login = async (req, res) => {
  // Validate req.body
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'validate login error',
      errors: errors.array(),
    })
  }

  try {
    // check email
    const user = await Users.getUserByEmail(req.body.email)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Email not found',
      })
    }

    // match password use bcrypt
    const matchPassword = await bcrypt.compare(req.body.password, user.password)
    if (!matchPassword) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect password',
      })
    }

    // destructuring user data
    const { id: userId, username, email, role } = user

    // set payload
    const payload = { userId, username, email, role }

    // sign access token with jwt.sign
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '20m', // expired 20 minutes
    })

    // sign refresh token with jwt.sign
    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '1d', // expired 1 day
    })

    // update refresh token on db
    await Auth.updateUserToken(userId, refreshToken)

    // send refresh token to cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'Strict',
      maxAge: 24 * 60 * 60 * 1000, // Hour * minute * second * mili second = 1 Day
    })

    // send access token if user success login
    return res.status(200).json({
      success: true,
      message: 'Login Success',
      accessToken,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

const logout = async (req, res) => {
  try {
    // Get token from cookies
    const token = req.cookies.refreshToken

    // check cookies
    if (!token || token === '') {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized, token not provided',
      })
    }

    // find user with token
    const user = await Auth.getUserByToken(token)
    if (!user) {
      return res.status(403).json({
        success: false,
        message: 'Access denied, invalid or expired token',
      }) // Forbindden
    }

    // delete token on db
    const userId = user.id
    await Auth.deleteUserToken(userId)

    // remove cookies
    res.clearCookie('refreshToken')

    // return response
    return res.status(204).send()
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

const refreshToken = async (req, res) => {
  try {
    // Get token from cookies
    const token = req.cookies.refreshToken

    // check cookies
    if (!token || token === '') {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized, token not provided',
      }) // Unauthorized
    }

    // find user with token
    const user = await Auth.getUserByToken(token)
    if (!user) {
      return res.status(403).json({
        success: false,
        message: 'Access denied, invalid or expired token',
      }) // Forbindden
    }

    // compare refresh token from cookie with refresh token in .env use jwt.verify
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decode) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: 'Access denied, invalid or expired token',
        })
      }
    })

    // destructuring user data
    const { id: userId, username, email, role } = user

    // set payload with user data
    const payload = { userId, username, email, role }

    // set accessToken sign access token with jwt.sign
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '20m', // 20 minute
    })

    // return access token
    return res.status(200).json({ success: true, accessToken })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

export default {
  register,
  login,
  logout,
  refreshToken,
}
