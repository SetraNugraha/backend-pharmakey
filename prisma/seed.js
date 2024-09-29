import prisma from "../src/config/database.js"
import generateSlug from "../src/utils/generateSlug.js"
import bcrypt from "bcrypt"

async function main() {
  // Delete All
  await prisma.users.deleteMany()
  await prisma.category.deleteMany()
  await prisma.products.deleteMany()

  const salt = await bcrypt.genSalt(10)
  const customerPassword = await bcrypt.hash("testuser", salt)
  const adminPassword = await bcrypt.hash("adminpharmakey", salt)

  const users = await prisma.users.createMany({
    data: [
      {
        username: "Test User",
        email: "testuser@gmail.com",
        password: customerPassword,
        role: "CUSTOMER",
      },
      {
        username: "Admin Pharmakey",
        email: "adminpharmakey@gmail.com",
        password: adminPassword,
        role: "ADMIN",
      },
    ],
  })

  const categories = [{ name: "Surgicals" }, { name: "Fitness" }, { name: "Diabetes" }, { name: "Vitamins" }]

  const seedCategory = await prisma.category.createMany({
    data: categories.map((category) => ({
      ...category,
      slug: generateSlug(category.name),
    })),
  })

  const findCategory = await prisma.category.findMany()

  const products = [
    {
      name: "Softovac Enoki",
      category_id: findCategory.find((cat) => cat.name === "Surgicals").id,
      price: 50000,
      description: "Obat untuk anak dibawah 18 tahun",
    },

    {
      name: "Junior Power",
      category_id: findCategory.find((cat) => cat.name === "Fitness").id,
      price: 17000,
      description: "Obat untuk anak dibawah 6 tahun",
    },

    {
      name: "Panadomal",
      category_id: findCategory.find((cat) => cat.name === "Diabetes").id,
      price: 33000,
      description: "Obat pereda sakit kepala",
    },

    {
      name: "Nutrition Assemic",
      category_id: findCategory.find((cat) => cat.name === "Vitamins").id,
      price: 87000,
      description: "Vitamins penunjang kesehatan tulang",
    },
  ]

  const seedProducts = await prisma.products.createMany({
    data: products.map((product) => ({
      ...product,
      slug: generateSlug(product.name),
    })),
  })
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
