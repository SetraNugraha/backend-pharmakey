import express from "express"
import TransactionsController from "../controllers/TransactionsController.js"

// Middleware
import { verifyToken, validateAdmin, validateCustomer } from "../middleware/auth.js"

const router = express.Router()

router.post("/transactions/checkout", verifyToken, validateCustomer, TransactionsController.checkout)

export default router
