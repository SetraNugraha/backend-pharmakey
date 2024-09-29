import express from 'express'
import AuthController from '../controllers/AuthController.js'
import UsersController from '../controllers/UsersController.js'

// Middleware
import { validateRegister, validateLogin, verifyToken, validateCustomer } from '../middleware/auth.js'

const router = express.Router()

router.post('/register', validateRegister, AuthController.register)
router.post('/login', validateLogin, AuthController.login)
router.delete('/logout', AuthController.logout)
router.get('/token', AuthController.refreshToken)

// GET Users
router.get('/users', UsersController.getAllUsers)
router.get('/users/:userId', UsersController.getUserById)
router.patch('/users', verifyToken, validateCustomer, UsersController.updateProfileUser)

export default router
