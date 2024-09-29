import prisma from "../config/database.js"

const checkout = async (userId, reqData) => {
  try {
    // Make sure user exists
    const existsUser = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        address: true,
        city: true,
        post_code: true,
        phone_number: true,
      },
    })

    if (!existsUser) {
      throw new Error("User not found or not logged in")
    }

    // Detail Address
    const address = reqData.address || existsUser.address
    const city = reqData.city || existsUser.city
    const post_code = reqData.post_code || existsUser.post_code
    const phone_number = reqData.phone_number || existsUser.phone_number

    // Get Carts Items User
    const userCart = await prisma.carts.findMany({
      where: { user_id: userId },
      include: {
        product: {
          select: {
            price: true,
          },
        },
      },
    })

    if (userCart.length === 0) {
      throw new Error("No items in cart")
    }

    // Sub Total
    const subTotal = userCart.reduce((currValue, cart) => currValue + cart.product.price * cart.quantity, 0)
    // Tax 10%
    const tax = (10 / 100) * subTotal
    // Delivery Fee 5%
    const deliveryFee = (5 / 100) * subTotal
    // Grand Total
    const grandTotal = subTotal + tax + deliveryFee

    // Create New Transaction
    const newTransaction = await prisma.transactions.create({
      data: {
        user_id: userId,
        total_amount: grandTotal,
        is_paid: "PENDING",
        notes: reqData.notes || null,
        proof: null,
        address: address,
        city: city,
        post_code: post_code,
        phone_number: phone_number,
      },
    })

    //  Create Transaction Details
    await prisma.transaction_Details.createMany({
      // Mapping Cart Items
      data: userCart.map((cart) => ({
        transaction_id: newTransaction.id,
        product_id: cart.product_id,
        price: cart.product.price,
        quantity: cart.quantity,
      })),
    })

    // Delete Cart Items
    await prisma.carts.deleteMany({
      where: { user_id: userId },
    })

    return newTransaction
  } catch (error) {
    throw new Error("Checkout error: " + error.message)
  }
}

export default {
  checkout,
}
