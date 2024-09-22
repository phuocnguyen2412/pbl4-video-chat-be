import messageModel from '../message.model'
import { getPagination } from '../../../../helpers/pagination'

const getMessagesByChatRoomId = async (chatRoomId: string, page: number = 1, limit: number = 10) => {
    const pagination = getPagination(page, limit)

    const messages = await messageModel
        .find({ chatRoom: chatRoomId })
        .select('chatRoom sender content isRead')
        .populate('sender', 'name')
        .populate('chatRoom', 'name')
        .sort({ createdAt: -1 })
        .skip(pagination.skip)
        .limit(pagination.limit)
    return messages
}

export default getMessagesByChatRoomId
