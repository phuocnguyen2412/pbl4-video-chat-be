import { body } from 'express-validator'

const chatRoomValidation = {
    create: [
        body('users')
            .notEmpty()
            .withMessage('thiếu trường user')
            .custom(async (value: string[]) => {
                if (!Array.isArray(value)) throw 'users must be an array'
                if (value.length < 1) throw 'users must nhiều hơn hoặc bằng 1'
            })
    ]
}
export default chatRoomValidation
