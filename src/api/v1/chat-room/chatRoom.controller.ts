import { Request, Response } from 'express'

import { Router } from 'express'

import chatRoomService from './chatRoom.service'
import { authenticate } from '../../../middlewares/auth.middleware'
import responseHandler from '../../../handlers/response.handler'
import chatRoomValidation from './chatroom.validation'
import { validateHandler } from '../../../handlers/validation.handler'
import { createChatRoom, searchChatroomQueryParams } from './chatRoom.dto'
import notificationModel from '../notifications/notification.model'
import { notificationService } from '../notifications/notification.service'

const chatRoomRoute: Router = Router()

chatRoomRoute.post(
    '/',
    authenticate,
    chatRoomValidation.create,
    validateHandler,
    async (req: Request<{}, {}, createChatRoom>, res: Response) => {
        try {
            const { users, name = '', privacy } = req.body
            const { userId } = req.user

            const newChatRoom = await chatRoomService.createChatRoom(userId, users, name, privacy)

            responseHandler.ok(res, newChatRoom, 'Tạo room thành công')
        } catch (error: any) {
            responseHandler.errorOrBadRequest(res, error)
        }
    }
)

chatRoomRoute.get(
    '/search',
    authenticate,
    async (req: Request<{}, {}, {}, Partial<searchChatroomQueryParams>>, res: Response) => {
        try {
            const { name, page = '1', limit = '10', privacy, getMy } = req.query
            const { userId } = req.user

            const result = await chatRoomService.searchChatRooms(
                name,
                Number(page),
                Number(limit),
                privacy,
                getMy === 'true',
                userId
            )
            responseHandler.ok(res, result, 'Tìm kiếm chatroom thành công!')
        } catch (error: any) {
            responseHandler.errorOrBadRequest(res, error)
        }
    }
)

chatRoomRoute.get(
    '/getOneToOne',
    authenticate,
    async (req: Request<{}, {}, {}, Partial<{ to: string }>>, res: Response) => {
        try {
            const { to } = req.query
            const { userId } = req.user

            const oneToOneRoom = await chatRoomService.getOneToOneChatRoom(userId, to as string)
            if (oneToOneRoom) return responseHandler.ok(res, oneToOneRoom, 'Tìm kiếm chatroom thành công!')

            const newOneToOneRoom = await chatRoomService.createChatRoom(userId, [to as string], '', 'PRIVATE')
            responseHandler.ok(res, newOneToOneRoom, 'Tìm kiếm chatroom thành công!')
        } catch (error: any) {
            responseHandler.errorOrBadRequest(res, error)
        }
    }
)

export default chatRoomRoute
