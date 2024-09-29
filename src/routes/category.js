import express from 'express'
import CategoryController from '../controllers/CategoryController.js'

// Middleware
import { verifyToken, validateAdmin } from '../middleware/auth.js'

const router = express.Router()

router.get('/category', CategoryController.getAllCategory)
router.get('/category/:categoryId', CategoryController.getCategoryById)

// Admin Only
// Create
router.post('/category', verifyToken, validateAdmin, CategoryController.createCategory)

// Update, Delete
router
  .route('/category/:categoryId')
  .all(verifyToken, validateAdmin) // Middleware make sure token & role admin
  .patch(CategoryController.updateCategory)
  .delete(CategoryController.deleteCategory)

export default router
