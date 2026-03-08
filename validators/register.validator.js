const zod = require('zod')
const loginSchema = require('./login.validator')

const registerSchema = zod.object({
    email: zod.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
    password: zod.string().min(6),
    name: zod.string().min(1)
})

module.exports = registerSchema