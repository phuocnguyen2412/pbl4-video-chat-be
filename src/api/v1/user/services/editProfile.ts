import userModel from '../user.model'

const editProfile = async (data: {
    userId: string
    name: string
    avatar: string
    introduction: string
    backgroundImage: string
}) => {
    type UserProfile = {
        name?: string
        avatar?: string
        introduction?: string
        backgroundImage?: string
    }
    const dataToUpdate: UserProfile = {}
    for (const item in data) {
        if (item !== 'userId') {
            dataToUpdate[item as keyof UserProfile] = data[item as keyof typeof data]
        }
    }

    const profileUpdated = await userModel
        .findByIdAndUpdate(data.userId, dataToUpdate, { new: true })
        .select('-account -notifications -chatRooms -friends')
    if (profileUpdated === null) throw 'Lỗi trong lúc update'
    return profileUpdated
}
export default editProfile
