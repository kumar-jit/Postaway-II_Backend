import { userModel } from "./users.schema.js";
import mongoose from "mongoose";


export const getFriendsRepository = async(userId) =>{
    return await userModel.findById(userId)
    .select('friends')
    .populate({
        path:'friends.friendId',
        match:{'friends.status': 'Friend'},
        select:'name email avatar'
    });
}

export const getPendingRequestRepository = async(userId) => {
    return await userModel.findById(userId)
    .select('friends')
    .populate({
        path:'friends.friendId',
        match:{'friends.status': 'ReceiveRequest'},
        select:'name email avatar'
    });
}

export const handleFriendRequestRepository = async (senderUser, receiverUser, action = 'update') => {

    // Start a MongoDB session to allow for transactions
    const session = await mongoose.startSession();
    session.startTransaction();  // Begin a transaction

    try {
        let sender,receiver;

        if(action == 'add'){
            // Add the friend info to the sender's friends list using findByIdAndUpdate
            sender = await userModel.findByIdAndUpdate(
                senderUser.userId,
                { $push: { friends: senderUser.friendsInfo } },
                { new: true }
            ).session(session);

            // Add the friend info to the receiver's friends list using findByIdAndUpdate
            receiver = await userModel.findByIdAndUpdate(
                receiverUser.userId,
                { $push: { friends: receiverUser.friendsInfo } },
                { new: true }
            ).session(session);
        }
        else if (action === "update") {
            // If action is update, modify the friend's status
            sender = await userModel.findOneAndUpdate(
                {
                    _id: senderUser.userId,
                    'friends.friendId': senderUser.friendsInfo.friendId  // Find the friend in sender's array
                },
                {
                    $set: { 'friends.$.status': senderUser.friendsInfo.status }  // Update the friend's status
                },
                { new: true }  // Return the updated document
            ).session(session);  // Attach the session to this operation

            receiver = await userModel.findOneAndUpdate(
                {
                    _id: receiverUser.userId,
                    'friends.friendId': receiverUser.friendsInfo.friendId  // Find the friend in receiver's array
                },
                {
                    $set: { 'friends.$.status': receiverUser.friendsInfo.status }  // Update the friend's status
                },
                { new: true }  // Return the updated document
            ).session(session);  // Attach the session to this operation
        }

        // Commit the transaction if both updates are successful
        await session.commitTransaction();
        session.endSession();  // End the session after committing the transaction
        
        // Return the updated sender and receiver documents
        return { sender, receiver };
        
    } catch (error) {
        // Abort the transaction in case of any error
        await session.abortTransaction();
        session.endSession();  // End the session after aborting the transaction

        // Rethrow the error to be handled by the caller
        throw error;
    }
}

export const cancelFriendshipRepository = async (senderUser, receiverUser) => {
    // Start a MongoDB session to manage the transaction
    const session = await mongoose.startSession();
    session.startTransaction();  // Begin the transaction

    try {
        // Remove the friend from the sender's friends list using the $pull operator
        let sender = await userModel.findByIdAndUpdate(
            senderUser.userId,                               // The ID of the sender
            { $pull: { friends: { friendId: senderUser.friendsInfo.friendId } } },  // Remove the friend
            { new: true }                                    // Return the updated document
        ).session(session);                                  // Attach the session to the operation

        // Remove the friend from the receiver's friends list using the $pull operator
        let receiver = await userModel.findByIdAndUpdate(
            receiverUser.userId,                             // The ID of the receiver
            { $pull: { friends: { friendId: receiverUser.friendsInfo.friendId } } }, // Remove the friend
            { new: true }                                    // Return the updated document
        ).session(session);                                  // Attach the session to the operation

        // Commit the transaction if both updates are successful
        await session.commitTransaction();
        session.endSession();  // End the session after committing the transaction
        
        // Return the updated sender and receiver documents
        return { sender, receiver };
        
    } catch (error) {
        // Abort the transaction if there is an error
        await session.abortTransaction();
        session.endSession();  // End the session after aborting the transaction

        // Rethrow the error to be handled by the calling function
        throw error;
    }
}