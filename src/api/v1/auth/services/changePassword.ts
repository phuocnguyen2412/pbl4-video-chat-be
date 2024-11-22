import { Request, Response } from 'express'
import userModel from '../../user/user.model'
import { hashPassword, comparePassword } from '../../../../helpers/hashPassword' // Thêm hàm so sánh mật khẩu

const changePassword = async (oldPassword: string, newPassword: string, userId: string): Promise<void> => {
    const user = await userModel.findById(userId)

    if (!user) {
        throw new Error('Người dùng không tồn tại!')
    }

    const isPasswordValid = await comparePassword(oldPassword, user.account.password)
    if (!isPasswordValid) {
        throw new Error('Mật khẩu cũ không đúng!')
    }

    const hashedPassword = await hashPassword(newPassword)
    user.account.password = hashedPassword
    await user.save()
}

export default changePassword
