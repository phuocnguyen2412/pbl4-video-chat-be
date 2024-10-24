import { getIO } from '~/configs/socket.config'
import chatRoomModel from '../../chat-room/chatRoom.model'
import messageModel, { IMessage, MessageType } from '../message.model'

const createMessage = async (messageData: Omit<IMessage, 'isRead'>) => {
    const { chatRoom: chatRoomId, sender, content, type, fileUrl: file } = messageData
    const chatRoom = await chatRoomModel.findById(chatRoomId).populate('participants', 'name avatar isOnlie socketId')

    if (chatRoom === null) throw 'Không tìm thấy chat room!'

    const message = await messageModel.create({
        sender,
        content,
        chatRoom: chatRoomId,
        type,
        fileUrl: file,
        isRead: []
    })
    console.log(message)

    chatRoom.messages.push(message._id)
    chatRoom.lastMessage = message._id
    const updatedChatRoom = await chatRoom.save()

    const newMessage = await messageModel.findById(message._id).populate('sender', 'name avatar _id')
    if (newMessage === null) throw 'Lỗi get'
    const io = getIO()
    io.to(
        updatedChatRoom.participants.filter((person: any) => person.isOnline).map((person: any) => person.socketId)
    ).emit('new message', newMessage)

    io.to(
        updatedChatRoom.participants.filter((person: any) => person.isOnline).map((person: any) => person.socketId)
    ).emit('updated chatroom', updatedChatRoom)
    return { newMessage, updatedChatRoom }
}
export default createMessage
