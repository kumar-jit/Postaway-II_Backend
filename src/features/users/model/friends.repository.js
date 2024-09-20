import { userModel } from "./users.schema.js";



export const getFriendsRepository = async(userId) =>{
    return await userModel.findById(userId)
    .select('friends')
    .populate({
        path:'friends.friendId',
        match:{'friends.status': 'Accepted'},
        select:'name email avatar'
    });
}

export const getPendingRequestRepository = async(userId) => {
    return await userModel.findById(userId)
    .select('friends')
    .populate({
        path:'friends.friendId',
        match:{'friends.status': 'Pending'},
        select:'name email avatar'
    });
}

export const sendFriendRequestRepositor = async(userId,friendsinfo) => {
    return await userModel.findByIdAndUpdate(userId,{$push: {friends: friendsinfo } }, {new: true});
}

export const cancelFriendshipRepository = async(userId,friendId) => {
    return await userModel.findByIdAndUpdate(
        userId,
        {$pull: {friends: {friendId: friendId}} },
        {new: true}
    )
}