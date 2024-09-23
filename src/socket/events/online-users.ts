import { Socket } from 'socket.io'
import userService from '~/api/v1/user/user.service'

const onlineUsersEvent = async (socket: Socket) => {
    const user = socket.handshake.auth
    const userId = user._id.toString()
    const onlineFriends = await userService.getOnlineFriends(userId)
    socket.emit('online friends', onlineFriends)

    socket.to(onlineFriends.map((friend) => (friend.socketId ? friend.socketId : ''))).emit('new online friend', user)

    return onlineFriends
}
export default onlineUsersEvent
