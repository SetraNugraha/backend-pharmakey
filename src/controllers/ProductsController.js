import Products from '../models/Products.js'

const getAllProducts = async (req, res) => {
  try {
    const result = await Products.getAllProducts()

    return res.status(200).json({
      status: 'success',
      message: 'Get all data products success',
      data: result,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

const getProductById = async (req, res) => {
  try {
    const productId = parseInt(req.params.productId)

    if (isNaN(productId)) {
      return res.status(400).json({ message: 'Invalid Product ID' })
    }

    const result = await Products.getProductById(productId)

    if (!result) {
      return res.status(404).json({ message: 'Product Not Found' })
    }

    return res.status(200).json({
      success: true,
      message: 'Get product by id success',
      data: result,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

const createProduct = async (req, res) => {
  const { category_id, name, product_image, price, description } = req.body

  if (!category_id) {
    return res.status(400).json({ message: 'Category are required' })
  }

  if (!name) {
    return res.status(400).json({ message: 'Name are required' })
  }

  if (!price) {
    return res.status(400).json({ message: 'Price are required' })
  }

  if (isNaN(category_id)) {
    return res.status(400).json({ message: 'Invalid category id' })
  }

  if (isNaN(price)) {
    return res.status(400).json({ message: 'Price must be number' })
  }

  try {
    const result = await Products.createProduct({
      category_id,
      name,
      product_image,
      price,
      description,
    })

    return res.status(201).json({
      success: true,
      message: 'Create product success',
      data: result,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

const updateProduct = async (req, res) => {
  const productId = parseInt(req.params.productId)
  const { category_id, name, product_image, price, description } = req.body

  if (isNaN(productId)) {
    return res.status(400).json({ message: 'Invalid product id' })
  }

  if (category_id && isNaN(category_id)) {
    return res.status(400).json({ message: 'Invalid category id' })
  }

  if (price && isNaN(price)) {
    return res.status(400).json({ message: 'Price must be number' })
  }

  try {
    const result = await Products.updateProduct(productId, {
      category_id,
      name,
      product_image,
      price,
      description,
    })

    return res.status(200).json({
      success: true,
      message: 'Update product success',
      data: result,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

const deleteProduct = async (req, res) => {
  const productId = parseInt(req.params.productId)

  if (isNaN(productId)) {
    return res.status(400).json({ message: 'Invalid product id' })
  }

  try {
    await Products.deleteProduct(productId)

    return res.status(200).json({
      success: true,
      message: 'Delete product success',
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

export default {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
}
