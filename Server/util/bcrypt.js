import bcrypt from 'bcryptjs'

export const hashPassword = async (password) => {

    const genSalt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, genSalt)

    return hashedPassword
}

export const comparePassword = async (plainPassword, hashedPassword) => {

    return bcrypt.compare(plainPassword, hashedPassword)
}