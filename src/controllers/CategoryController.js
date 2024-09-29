import Category from '../models/Category.js'

const getAllCategory = async (req, res) => {
  try {
    const result = await Category.getAllCategory()

    return res.status(200).json({
      success: true,
      message: 'Get All Category Success',
      data: result,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

const getCategoryById = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.categoryId)

    if (isNaN(categoryId)) {
      return res.status(400).json({ message: 'Invalid Category ID !' })
    }

    const result = await Category.getCategoryById(categoryId)

    if (!result) {
      return res.status(404).json({ message: 'Category not found' })
    }

    return res.status(200).json({
      success: true,
      message: 'Get Category By Id Success',
      data: result,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

const createCategory = async (req, res) => {
  try {
    const { name, category_image } = req.body

    if (!name) {
      return res.status(400).json({ message: 'Name is required' })
    }

    const result = await Category.createCategory({ name, category_image })

    res.status(201).json({
      success: true,
      message: 'Create Category Success',
      data: result,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

const updateCategory = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.categoryId)
    const { name, category_image } = req.body

    // check cateogry id
    if (isNaN(categoryId)) {
      return res.status(400).json({ message: 'Invalid Category ID' })
    }

    const result = await Category.updateCategory(categoryId, {
      name: name,
      category_image: category_image,
    })

    return res.status(200).json({
      success: true,
      message: 'Update category success',
      data: result,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

const deleteCategory = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.categoryId)

    // check cateogry id
    if (isNaN(categoryId)) {
      return res.status(400).json({ message: 'Invalid Category ID' })
    }

    // make sure category exists
    const existsCategory = await Category.getCategoryById(categoryId)
    if (!existsCategory) {
      return res.status(400).json({ message: 'Category not found' })
    }

    // Process Delete
    await Category.deleteCategory(categoryId)

    return res.status(200).json({
      success: true,
      message: 'Delete Category success',
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

export default {
  getAllCategory,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
}
