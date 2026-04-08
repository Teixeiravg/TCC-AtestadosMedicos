const { PrismaClient } = require('../generated/prisma/wasm')

const prisma = new PrismaClient()

module.exports = prisma