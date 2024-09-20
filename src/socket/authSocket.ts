import { Socket } from 'socket.io'
import { verifyAccessToken } from '../helpers/jwtToken'
import userService from '../api/v1/user/user.service'

const authSocket = async (socket: Socket) => {
    const accessToken = socket.handshake.headers.authorization
    if (!accessToken) throw new Error('No authentication')
    const decode = verifyAccessToken(accessToken as string)
    const { userId } = typeof decode === 'string' ? { userId: decode } : decode.data
    const user = await userService.getUser(userId)
    return user
}
export default authSocket
