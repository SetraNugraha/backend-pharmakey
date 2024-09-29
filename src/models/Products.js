import prisma from '../config/database.js'
import generateSlug from '../utils/generateSlug.js'

const getAllProducts = async () => {
  try {
    const result = await prisma.products.findMany({
      orderBy: { id: 'desc' },
    })

    return result
  } catch (error) {
    throw new Error('Error fetching all data products: ' + error.message)
  }
}

const getProductById = async (productId) => {
  try {
    const result = await prisma.Products.findUnique({
      where: { id: productId },
    })

    return result
  } catch (error) {
    throw new Error('Error fetching data product by id: ' + error.message)
  }
}

const createProduct = async (reqData) => {
  const {
    category_id,
    name,
    product_image = null,
    price,
    description,
  } = reqData

  const productSlug = generateSlug(name)

  const existsCategory = await prisma.Category.findUnique({
    where: { id: category_id },
  })

  const existsName = await prisma.Products.findUnique({
    where: { slug: productSlug },
  })

  if (!existsCategory) {
    throw new Error('Category does not exists')
  }

  if (existsName) {
    throw new Error('Name already exists')
  }

  const productsFields = {
    category_id: category_id,
    name: name,
    slug: productSlug,
    product_image: product_image,
    price: parseFloat(price),
    description: description,
  }

  try {
    const result = await prisma.Products.create({
      data: productsFields,
    })
    return result
  } catch (error) {
    throw new Error('Error creating product: ' + error.message)
  }
}

const updateProduct = async (productId, reqData) => {
  // make sure product exists
  const existsProduct = await getProductById(productId)
  if (!existsProduct) {
    throw new Error('Product not found')
  }

  const { category_id, name, product_image, price, description } = reqData
  const updatedProduct = {}

  if (category_id) {
    const existsCategory = await prisma.Category.findUnique({
      where: { id: category_id },
    })

    if (!existsCategory) {
      throw new Error('Category does not exists')
    }

    updatedProduct.category_id = category_id
  }

  if (name) {
    const productSlug = generateSlug(name)
    const existName = await prisma.Products.findUnique({
      where: { slug: productSlug },
    })

    if (existName) {
      throw new Error('Name already exists')
    }

    updatedProduct.name = name
    updatedProduct.slug = productSlug
  }

  if (product_image) {
    updatedProduct.product_image = product_image
  }

  if (price) {
    updatedProduct.price = parseFloat(price)
  }

  if (description) {
    updatedProduct.description = description
  }

  if (Object.keys(updatedProduct).length === 0) {
    throw new Error(
      'No changes detected. Please provide at least one field to update.',
    )
  }

  try {
    const result = await prisma.Products.update({
      where: { id: productId },
      data: updatedProduct,
    })

    return result
  } catch (error) {
    throw new Error('Error update product: ' + error.message)
  }
}

const deleteProduct = async (productId) => {
  // make sure product exists
  const existsProduct = await getProductById(productId)
  if (!existsProduct) {
    throw new Error('Product not found')
  }

  try {
    const result = await prisma.Products.delete({
      where: { id: productId },
    })

    return result
  } catch (error) {
    throw new Error('Error delete product: ' + error.message)
  }
}

export default {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
}
