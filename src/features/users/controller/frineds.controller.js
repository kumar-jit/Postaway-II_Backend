import { ErrorHandler } from "../../../utils/errorHandler.js";
import { getFriendsRepository,getPendingRequestRepository, handleFriendRequestRepository,cancelFriendshipRepository } from "../model/friends.repository.js";
import { getUserByIdRepository } from "../model/user.repository.js";

/**
 * Fetches the list of friends for a specific user.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express middleware function
 */
export const getFriends = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        if(!userId) return next(new ErrorHandler(400, "User ID required."));
        const user = await getFriendsRepository(userId);
        res.status(200).json(user.friends);
    } catch (error) {
        next(error);
    }
} 

/**
 * Fetches the pending friend requests for the logged-in user.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express middleware function
 */
export const getPendingRequest = async (req, res, next ) => {
    try {
        const userId = req.userId;
        if(!userId) return next(new ErrorHandler(403, "Please login first"));

        const user = await getPendingRequestRepository(userId);
        res.status(200).json(user.friends);
    } catch (error) {
        next(error);
    }
}

/**
 * Toggles friendship status based on the user's action (send request/cancel request).
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express middleware function
 */
export const toggoleFriendship = async (req, res, next) =>{
    try{
        const userId = req.userId;
        const friendId = req.params.friendId;
        const status = req.body.status;

        // Ensure a valid friendship status is provided
        if(!status ) return next(new ErrorHandler(403, "Friendship status is required"));

        // Ensure user is logged in
        if(!userId) return next(new ErrorHandler(403, "Please login to manage friendship status"));

        // Ensure a valid friend ID is provided
        if(!friendId) return next(new ErrorHandler(400, "Friend ID is required"));

        // Prevent sending a friend request to oneself
        if(userId == friendId) return next(new ErrorHandler(403,"You cannot send a friend request to yourself"));

        const currentUser = await getUserByIdRepository(userId,true);
        if(!currentUser) return next(new ErrorHandler(500,"An error occurred. Please try again later"));

        // Get the friendship status between the current user and the provided friend ID
        const currentFriendshipRelation = currentUser.checkFriendshipStatus(friendId);

        // Prepare the sender (current user) payload
        const senderUser = {
            userId : userId,
            friendsInfo : {
                friendId : friendId,
                status : "",
            }
        }
        // Prepare the receiver (friend) payload
        const receiverUser = {
            userId : friendId,
            friendsInfo : {
                friendId : userId,
                status : "",
            }
        }

        // Handle sending a friend request
        if(status.toLowerCase().trim() == "request"){
            // If no friendship exists, create a new request
            if(!currentFriendshipRelation){
                // updating satatus
                senderUser.friendsInfo.status = "SendRequest";          // Mark current user as having sent the request
                receiverUser.friendsInfo.status = "ReceiveRequest";

                const newFriendship = await handleFriendRequestRepository(senderUser,receiverUser,'add');
                return res.status(200).json({status:true, message: `Friend request sent to ${newFriendship.receiver.name} successfully.` });
            }
            // If a request has already been sent by the user, do not allow duplicate requests
            else if(currentFriendshipRelation.status == "SendRequest")
                return next(new ErrorHandler(400,"Friend request already sent"));
            // If the user has a pending friend request from the other person, notify them
            else if(currentFriendshipRelation.status == "ReceiveRequest")
                return next(new ErrorHandler(400,"Friend request from this user is pending. Please check your request list."));
            // If the users are already friends, notify them that no action is needed
            else
                return next(new ErrorHandler(400,"You are already friends with this user"));
        }

        // Handle cancelling a friend request or friendship
        else if(status.toLowerCase().trim() == "cancel"){
            // If no friendship exists, cancelling the action is not possible
            if(!currentFriendshipRelation){
                return next(new ErrorHandler(400,"You are not friends with this user"));
            }
            // Proceed with cancelling the friend request if the relation exists
            else{
                const cancelFriendRequest = await cancelFriendshipRepository(senderUser,receiverUser);
                return res.status(200).json({status:true, message: "Friend request successfully cancelled."});
            }
        }
        
        // Handle invalid status input
        next(new ErrorHandler(400,"Invalid status. Please provide a valid friendship status."));
    }
    catch(error){
        next(error);
    }
}

/**
 * Responds to an incoming friend request (confirm/reject).
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express middleware function
 */
export const respondToFriendRequest = async (req, res, next) => {
    try{
        const friendId = req.params.friendId;
        const userId = req.userId;
        const status = req.body.status;

        // Ensure a valid friendship status is provided
        if(!status ) return next(new ErrorHandler(403, "Friendship status is required"));

        // Ensure user is logged in
        if(!userId) return next(new ErrorHandler(403, "Please login to manage friendship status"));

        // Ensure a valid friend ID is provided
        if(!friendId) return next(new ErrorHandler(400, "Friend ID is required"));

        // Prevent sending a friend request to oneself
        if(userId == friendId) return next(new ErrorHandler(403,"You cannot friendship with yourself"));


        const currentUser = await getUserByIdRepository(userId,true);
        if(!currentUser) return next(new ErrorHandler(500,"An error occurred. Please try again later"));

        // Get the friendship status between the current user and the provided friend ID
        const currentFriendshipRelation = currentUser.checkFriendshipStatus(friendId);

        // Prepare the response payload (the user responding to the request)
        const responseUser = {
            userId : userId,
            friendsInfo : {
                friendId : friendId,
                status : "",
            }
        }
        // Prepare the sender payload (the user who sent the request)
        const senderUser = {
            userId : friendId,
            friendsInfo : {
                friendId : userId,
                status : "",
            }
        }

        // Handle sending a friend request
        if(status.toLowerCase().trim() == "confirm"){
            // Check if there is a pending request to accept
            if(!currentFriendshipRelation){
                return next(new ErrorHandler(400,"There is no pending request to accept"));
            }
            // Update both users' status to "Friend" and confirm the request
            else if(currentFriendshipRelation.status == "ReceiveRequest"){
                responseUser.friendsInfo.status = "Friend";
                senderUser.friendsInfo.status = "Friend";

                const newFriendship = await handleFriendRequestRepository(responseUser, senderUser);
                return res.status(200).json({status:true, message: `Friend request confirmed. You are now friends.` });
            }
             // If the user has already sent the request, notify them of their action
            else if(currentFriendshipRelation.status == "SendRequest")
                return next(new ErrorHandler(400,"This action is not possible. You have sent the request and are waiting for their response."));
            // If they are already friends, notify them
            else
                return next(new ErrorHandler(400,"You are already friends with this user"));
        }

        // Handle rejecting/Cancel a friend request
        else if(status.toLowerCase().trim() == "delete"){
            // Check if there is a pending request to reject
            if(!currentFriendshipRelation){
                return next(new ErrorHandler(400,"There is no pending request from this use."));
            }
            // Reject the pending request and update the status accordingly
            else{
                const cancelFriendRequest = await cancelFriendshipRepository(responseUser,senderUser,'update');
                return res.status(200).json({status:true, message: "Friend request successfully rejected."});
            }
        }

        // Handle invalid status input
        next(new ErrorHandler(400,"Invalid status. Please provide a valid friendship status."));
    }
    catch(error){
        next(error);
    }
}
