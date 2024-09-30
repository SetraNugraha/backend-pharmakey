import express from "express"
import TransactionsController from "../controllers/TransactionsController.js"

// Middleware
import { verifyToken, validateAdmin, validateCustomer } from "../middleware/auth.js"

const router = express.Router()

// CUSTOMER only
// Create Transaction
router.post("/transactions/checkout", verifyToken, validateCustomer, TransactionsController.checkout)

//  ADMIN only
router.get("/transactions", verifyToken, validateAdmin, TransactionsController.getAllTransactions)

// Update Status
// SUCCESS
router.put("/transactions/:transactionId/success", verifyToken, validateAdmin, TransactionsController.checkoutSuccess)

// CANCELLED
router.put("/transactions/:transactionId/cancelled", verifyToken, validateAdmin, TransactionsController.checkoutCancelled)

export default router
