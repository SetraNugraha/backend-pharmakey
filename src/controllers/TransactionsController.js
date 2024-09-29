import Transactions from "../models/Transactions.js"

const checkout = async (req, res) => {
  try {
    // GET user id from middleware verifyToken
    const userId = parseInt(req.user.userId)
    const { address, city, post_code, phone_number, notes = null } = req.body

    if (!address || !city || !post_code || !phone_number) {
      return res.status(400).json({
        success: false,
        message: "Incomplete address information",
      })
    }

    if (post_code && isNaN(post_code)) {
      return res.status(400).json({
        success: false,
        message: "Post code must be a number",
      })
    }

    const result = await Transactions.checkout(userId, {
      address,
      city,
      post_code,
      phone_number,
      notes,
    })

    return res.status(201).json({
      success: true,
      message: "Checkout success",
      data: result,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

export default {
  checkout,
}
