import Carts from '../models/Carts.js'

const getAllCarts = async (req, res) => {
  try {
    const result = await Carts.getAllCarts()

    return res.status(200).json({
      success: true,
      message: 'Success get all item carts',
      data: result,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

const getCartByUserId = async (req, res) => {
  const userId = parseInt(req.params.userId)

  if (!userId || isNaN(userId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user id',
    })
  }

  try {
    const result = await Carts.getCartByUserId(userId)

    return res.status(200).json({
      success: true,
      message: 'Get carts by user id success',
      data: result,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

const addItemToCart = async (req, res) => {
  const userId = parseInt(req.user.userId)
  const productId = parseInt(req.params.productId)

  if (!productId || isNaN(productId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid product id',
    })
  }

  try {
    const result = await Carts.addItemToCart(userId, productId)

    return res.status(201).json({
      success: true,
      message: 'Add item to cart success',
      data: result,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

const deleteItemCart = async (req, res) => {
  const userId = parseInt(req.user.userId)
  const productId = parseInt(req.params.productId)

  if (!productId || isNaN(productId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid product id',
    })
  }

  try {
    await Carts.deleteItemCart(userId, productId)

    return res.status(200).json({
      success: true,
      message: 'Remove item success',
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

export default {
  getAllCarts,
  getCartByUserId,
  addItemToCart,
  deleteItemCart,
}
