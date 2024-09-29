import express from 'express'
import ProductsController from '../controllers/ProductsController.js'

// Middleware
import { verifyToken, validateAdmin } from '../middleware/auth.js'

const router = express.Router()

// Get data
router.get('/products', ProductsController.getAllProducts)
router.get('/products/:productId', ProductsController.getProductById)

// Admin Only
// Create
router.post('/products', verifyToken, validateAdmin, ProductsController.createProduct)

// Update, Delete
router
  .route('/products/:productId')
  .all(verifyToken, validateAdmin) // Middleware make sure token & role admin
  .patch(ProductsController.updateProduct)
  .delete(ProductsController.updateProduct)

export default router
