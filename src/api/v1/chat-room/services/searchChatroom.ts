import chatRoomModel, { TypeRoom } from '../chatRoom.model'
import { getPagination } from '../../../../helpers/pagination'
import { IUser } from '../../user/user.model'
import messageModel, { IMessage } from '../../message/message.model'
import { validation } from '~/helpers/validation'

const searchChatRooms = async (
    name?: string,
    page: number = 1,
    limit: number = 10,
    privacy?: 'PUBLIC' | 'PRIVATE',
    getMy?: boolean,
    userId?: string,
    typeRoom?: TypeRoom
) => {
    const pagination = getPagination(page, limit)

    type SearchOption = {
        name?: RegExp
        privacy?: 'PUBLIC' | 'PRIVATE'
        participants?: string
        $or?: any[]
        email?: string
        typeRoom?: TypeRoom
    }

    const searchOption: SearchOption = {}
    if (name) {
        searchOption.$or = [
            { name: new RegExp(name, 'i') }, // Tìm phòng có tên khớp
            {
                $and: [
                    { participants: { $elemMatch: { $regex: new RegExp(name, 'i') } } }, // Tìm participants có tên khớp
                    { participants: { $elemMatch: { $eq: userId } } } // Kiểm tra userId trong participants
                ]
            }
        ]
    }
    if (privacy === 'PRIVATE') {
        searchOption.privacy = 'PRIVATE'
        searchOption.participants = userId
    } else if (privacy === 'PUBLIC') {
        searchOption.privacy = 'PUBLIC'
    }
    if (getMy === true) {
        searchOption.participants = userId
    }
    if (typeRoom) {
        searchOption.typeRoom = typeRoom
    }

    const chatRooms = await chatRoomModel
        .find(searchOption)
        .select('name typeRoom chatRoomImage participants admins moderators updatedAt lastMessage')
        .populate<{ admins: IUser[] }>('admins', 'name avatar')
        .populate<{ moderators: IUser[] }>('moderators', 'name avatar')
        .populate<{ participants: IUser[] }>('participants', 'name avatar')
        .populate<{ lastMessage: IMessage[] }>({
            path: 'lastMessage', // Populate lastMessage first
            select: '_id sender content type createdAt updatedAt', // Select fields in lastMessage
            populate: {
                path: 'sender', // Nested populate for sender
                select: 'name avatar' // Select fields from the sender (user model)
            }
        })
        .sort({ updatedAt: -1 })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .lean()

    return chatRooms
}

export default searchChatRooms
