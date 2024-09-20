import { ErrorHandler } from "../../../utils/errorHandler.js";
import { getFriendsRepository,getPendingRequestRepository, sendFriendRequestRepositor,cancelFriendshipRepository } from "../model/friends.repository.js";
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
        if(!userId) return next(new ErrorHandler(403, "Please log in to manage friendship status"));

        // Ensure a valid friend ID is provided
        if(!friendId) return next(new ErrorHandler(400, "Friend ID is required"));

        // Prevent sending a friend request to oneself
        if(userId == friendId) return next(new ErrorHandler(403,"You cannot send a friend request to yourself"));

        const currentUser = await getUserByIdRepository(userId,true);
        if(!currentUser) return next(new ErrorHandler(500,"An error occurred. Please try again later"));

        const currentFriendshipRelation = currentUser.checkFriendshipStatus(friendId);

        // Handle sending a friend request
        if(status.toLowerCase() == "request"){
            if(!currentFriendshipRelation){
                const newFriendship = await sendFriendRequestRepositor(userId,{friendId:friendId});
                return res.status(200).json({status:true, message: "Friend request has been sent successfully" });
            }
            else if(currentFriendshipRelation.status == "Pending")
                return next(new ErrorHandler(400,"Friend request already sent"));
            else
                return next(new ErrorHandler(400,"You are already friends with this user"));
        }

        // Handle cancelling a friend request or friendship
        else if(status.toLowerCase() == "cancel"){
            if(!currentFriendshipRelation){
                return next(new ErrorHandler(400,"This action is not possible. You are not friends with this user"));
            }
            else{
                const cancelFriendRequest = await cancelFriendshipRepository(userId,friendId);
                return res.status(200).json({status:true, message: "Friend request successfully cancelled"});
            }
        }
        
        // Handle invalid status
        next(new ErrorHandler(400,"Invalid status. Please provide a valid friendship status"));
    }
    catch(error){
        next(error);
    }
}

export const respondToFriendRequest = async (req, res, next) => {

}