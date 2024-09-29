import prisma from '../config/database.js'

const getAllCarts = async () => {
  try {
    const result = await prisma.carts.findMany()

    return result
  } catch (error) {
    throw new Error('Error get all data carts: ' + error.message)
  }
}

const getCartByUserId = async (userId) => {
  try {
    // make sure user exists
    const user = await prisma.users.findFirst({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        address: true,
        city: true,
        post_code: true,
        phone_number: true,
      },
    })

    if (!user) {
      throw new Error('User not found')
    }

    const cartItems = await prisma.carts.findMany({
      where: { user_id: user.id },
      select: {
        product_id: true,
        quantity: true,
        created_at: true,
        updated_at: true,
      },
    })

    return { user, cartItems }
  } catch (error) {
    throw new Error('Error get data cart by user id: ' + error.message)
  }
}

const addItemToCart = async (userId, productId) => {
  try {
    // make sure user exists
    const user = await prisma.users.findFirst({
      where: { id: userId },
    })

    if (!user) {
      throw new Error('User not found')
    }

    const existsCartItem = await prisma.carts.findFirst({
      where: {
        user_id: user.id,
        product_id: productId,
      },
    })

    if (existsCartItem) {
      const updateQuantity = await prisma.carts.update({
        where: {
          // composite key, if where > 1 on update & delete
          user_id_product_id: {
            user_id: user.id,
            product_id: productId,
          },
        },
        data: {
          quantity: existsCartItem.quantity + 1,
        },
      })

      return updateQuantity
    } else {
      const newCartItem = await prisma.carts.create({
        data: {
          user_id: user.id,
          product_id: productId,
          quantity: 1,
        },
      })

      return newCartItem
    }
  } catch (error) {
    throw new Error('Error add product to cart: ' + error.message)
  }
}

const deleteItemCart = async (userId, productId) => {
  try {
    // make sure user exists
    const user = await prisma.users.findFirst({
      where: { id: userId },
    })

    if (!user) {
      throw new Error('User not found')
    }

    const existsCartItem = await prisma.carts.findFirst({
      where: {
        user_id: user.id,
        product_id: productId,
      },
    })

    if (!existsCartItem) {
      throw new Error('Product not found')
    }

    if (existsCartItem.quantity > 1) {
      const updateQuantity = await prisma.carts.update({
        where: {
          user_id_product_id: {
            user_id: user.id,
            product_id: productId,
          },
        },
        data: {
          quantity: existsCartItem.quantity - 1,
        },
      })

      return updateQuantity
    } else {
      const deleteItem = await prisma.carts.delete({
        where: {
          user_id_product_id: {
            user_id: user.id,
            product_id: productId,
          },
        },
      })

      return deleteItem
    }
  } catch (error) {
    throw new Error('Error delete product from cart: ' + error.message)
  }
}

export default {
  getAllCarts,
  getCartByUserId,
  addItemToCart,
  deleteItemCart,
}
