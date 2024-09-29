import prisma from '../config/database.js'
import generateSlug from '../utils/generateSlug.js'

const getAllCategory = async () => {
  try {
    const result = await prisma.category.findMany()
    return result
  } catch (error) {
    throw new Error('Error fetching all data category: ' + error.message)
  }
}

const getCategoryById = async (categoryId) => {
  try {
    const result = await prisma.category.findUnique({
      where: { id: categoryId },
    })

    return result
  } catch (error) {
    throw new Error('Error fetching data product by id: ' + error.message)
  }
}

const createCategory = async (reqData) => {
  const { name, category_image = null } = reqData
  const categorySlug = generateSlug(name)

  const existsName = await prisma.category.findUnique({
    where: { slug: categorySlug },
  })

  if (existsName) {
    throw new Error('Name already exists')
  }

  const categoryFields = {
    name: name,
    slug: categorySlug,
    category_image: category_image,
  }

  try {
    const result = await prisma.category.create({
      data: categoryFields,
    })

    return result
  } catch (error) {
    throw new Error('Error creating category: ' + error.message)
  }
}

const updateCategory = async (categoryId, reqData) => {
  try {
    //make sure category exists
    const existsCategory = await getCategoryById(categoryId)
    if (!existsCategory) {
      throw new Error('Category not found')
    }

    const { name, category_image } = reqData
    const updatedCategory = {}

    // Check if user input data name
    if (name) {
      // check exsist name
      const existName = await prisma.category.findUnique({
        where: { name: name },
      })

      if (existName) {
        throw new Error('Name already exists')
      }

      updatedCategory.name = name
      updatedCategory.slug = generateSlug(name)
    }

    // check if user input file image
    if (category_image) {
      updatedCategory.category_image = category_image
    }

    // check if there are any changes
    if (Object.keys(updatedCategory).length === 0) {
      throw new Error(
        'No changes detected. Please provide at least one field to update.',
      )
    }

    const result = await prisma.category.update({
      where: { id: categoryId },
      data: updatedCategory ,
    })

    return result
  } catch (error) {
    throw new Error('Error updating Category: ' + error.message)
  }
}

const deleteCategory = async (categoryId) => {
  try {
    const result = await prisma.category.delete({
      where: { id: categoryId },
    })

    return result
  } catch (error) {
    // Prisma error code for foreign key constraint failure
    if (error.code === 'P2003') {
      throw new Error(
        'Cannot delete category, it is referenced by other records.',
      )
    }
    throw new Error('Error delete Category: ' + error.message)
  }
}

export default {
  getAllCategory,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
}
