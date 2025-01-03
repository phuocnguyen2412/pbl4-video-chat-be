import { Request, Response } from 'express'

import { Router } from 'express'

import responseHandler from '../../../handlers/response.handler'
import { authenticate } from '../../../middlewares/auth.middleware'

import { createRequestDto, updateRequestDto } from './groupRequest.dto'
import { groupRequestService } from './groupRequest.service'
import { validateHandler } from '~/handlers/validation.handler'
import { groupRequestValidation } from './groupRequest.validation'
import { GroupRequestStatus } from './groupRequest.model'

const groupRequestRoute: Router = Router()

groupRequestRoute.get(
    '/get-request-by-chat-room-id',
    authenticate,
    groupRequestValidation.getAllRequest,
    validateHandler,
    async (req: Request, res: Response) => {
        try {
            const {
                chatRoomId,
                page = 1,
                limit = 10
            } = req.query as {
                chatRoomId: string
                page: string
                limit: string
            }
            const requests = await groupRequestService.getRequestByChatRoomId(chatRoomId, +page, +limit)
            return responseHandler.ok(res, requests, 'Tìm kiếm thành công!')
        } catch (error: any) {
            responseHandler.errorOrBadRequest(res, error)
        }
    }
)
groupRequestRoute.post(
    '/',
    authenticate,
    groupRequestValidation.create,
    validateHandler,
    async (req: Request<{}, {}, createRequestDto>, res: Response) => {
        try {
            const request = await groupRequestService.create({ ...req.body, createBy: req.user.userId })
            return responseHandler.ok(res, request, 'Yêu cầu vào phòng thành công!')
        } catch (error: any) {
            responseHandler.errorOrBadRequest(res, error)
        }
    }
)
groupRequestRoute.patch(
    '/:requestId',
    authenticate,
    groupRequestValidation.update,
    validateHandler,
    async (req: Request<{ requestId: string }, {}, updateRequestDto>, res: Response) => {
        try {
            const userId: string = req.user.userId
            const request = await groupRequestService.update({
                ...req.body,
                updateBy: userId,
                requestId: req.params.requestId
            })
            return responseHandler.ok(res, request, 'Cập nhật yêu cầu vào phòng thành công!')
        } catch (error: any) {
            responseHandler.errorOrBadRequest(res, error)
        }
    }
)

groupRequestRoute.get(
    '/get-all-requests-of-user',
    authenticate,
    groupRequestValidation.getAllRequestOfUser,
    validateHandler,
    async (req: Request, res: Response) => {
        try {
            const userId: string = req.user.userId
            const {
                status,
                page = 1,
                limit = 10
            } = req.query as {
                status: GroupRequestStatus
                page: string
                limit: string
            }
            const requests = await groupRequestService.getAllRequestOfUser({
                status,
                page: +page,
                limit: +limit,
                userId
            })
            return responseHandler.ok(res, requests, 'Lấy danh sách thành công')
        } catch (error: any) {
            responseHandler.errorOrBadRequest(res, error)
        }
    }
)

export default groupRequestRoute
