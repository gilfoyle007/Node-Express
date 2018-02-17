import User from '../models/user'
import Connection from '../models/connection'
import Follower from '../models/follower'
import Following from '../models/following'
import Request from '../models/request'
import Pending from '../models/pending'
import Blocked from '../models/blocked'
import Declined from '../models/declined'
import Accept from '../models/accept'

export default {

    getUserConnections: async(req, res) => {
        const { userId } = req.params;
        const user = await User.findById(userId).populate('connections');
        if (!user) return res.status(400).json({ success: false });
        res.status(200).json(user.connections);
    },

    addNewConnection: async(req, res) => {
        const { userId } = req.params;

        // verify is already requested
        const verifyConnection = await Connection.find({ user_two: req.body.user_two });
        if (!verifyConnection) return res.status(400).json({ success: false });

        if (verifyConnection[0] == null) {
            // user one
            const newConnection = new Connection(req.body);
            const user = await User.findById(userId);
            newConnection.user_id = user._id;
            await newConnection.save();
            user.connections.push(newConnection);
            await user.save();
            // user requested
            const newConnectionTwo = new Connection(req.body);
            const userTwo = await User.find({ _id: req.body.user_two });
            newConnectionTwo.user_id = userTwo._id;
            await newConnectionTwo.save();
            userTwo.connections.push(newConnectionTwo);
            await userTwo.save();

            res.status(201).json({ success: true, newConnection });
        } else {
            res.status(200).json({ success: false, message: "already requested" });
        }

    },

    getUserFollowing: async(req, res) => {
        const { userId } = req.params;
        const user = await User.findById(userId).populate('following');
        if (!user) return res.status(400).json({ success: false });
        res.status(200).json(user.following);
    },

    followingNewUser: async(req, res) => {
        const { userId } = req.params;
        const followingId = req.body.following_user_id;

        if (userId === followingId) res.status(409).json({ success: false, message: "user _Id can not be same" });

        const user = await User.findById(userId);
        if (!user) return res.status(400).json({ success: false });
        const verifyFollowing = await Following.find({ user_id: userId, following_user_id: followingId });
        if (!verifyFollowing) return res.status(400).json({ success: false });

        if (verifyFollowing[0] == null) {

            // make follower to other user
            const newFollower = new Follower({ user_id: followingId, follower_user_id: userId });
            const user2 = await User.findById({ _id: followingId });
            if (!user2) return res.status(400).json({ success: false });
            await newFollower.save();
            user2.follower.push(newFollower);
            await user2.save();

            // add user to user's following list
            const newFollowing = new Following(req.body);
            newFollowing.user_id = user._id;
            await newFollowing.save();
            user.following.push(newFollowing);
            await user.save();

            res.status(201).json({ success: true, following: user.following, follower: user2.follower });
        } else {
            res.status(409).json({ success: false, message: "You are already following this user" });
        }
    },

    getUserFollowers: async(req, res) => {
        const { userId } = req.params;
        const user = await User.findById(userId).populate('follower');
        if (!user) return res.status(400).json({ success: false });
        res.status(200).json(user.follower);
    },

    unfollowUser: async(req, res) => {

        console.log("unfollow");

        const { userId, unfollowId } = req.body;
        console.log(userId, unfollowId);

        if (userId === unfollowId) return res.status(409).json({ success: false });

        const user = await User.findById(userId);
        if (!user) return res.status(400).json({ success: false });

        const user2 = await User.findById(unfollowId);
        if (!user2) return res.status(400).json({ success: false });

        const usersfollowing = await Following.find({ user_id: userId, following_user_id: unfollowId });
        const usersfollower = await Follower.find({ user_id: unfollowId, follower_user_id: userId });

        if (usersfollowing[0] != null && usersfollower[0] != null) {

            user.following.pull(usersfollowing[0]);
            await usersfollower[0].remove();
            await user.save();
            user2.follower.pull(usersfollower[0]);
            await usersfollower[0].remove();
            await user2.save();
            res.status(200).json({ success: true })
        } else {
            res.status(409).json({ success: false });
        }
    },

    getUserConnectionRequests: async(req, res) => {
        const { userId } = req.params;
        const user = await User.findById(userId).populate('request');
        if (!user) return res.status(400).json({ success: false });
        res.status(200).json(user.request);

    },

    sendConnectionRequest: async(req, res) => {
        const { userId } = req.params;
        const reqUserId = req.body.request_user_id;
        const user = await User.findById(userId);
        if (!user) return res.status(400).json({ success: false });
        const verifyRequest = await Pending.find({ user_id: userId, pending_user_id: reqUserId });
        if (!verifyRequest) return res.status(400).json({ success: false });
        const declinedUsers = await Declined.find({ user_id: userId, declined_user_id: reqUserId });
        console.log(declinedUsers[0]);
        if (declinedUsers[0] != null) return res.status(409).json({ success: false, message: "you are declined by user" });
        if (verifyRequest[0] == null) {
            // add request in pendig list of this user
            const newPending = new Pending({ pending_user_id: reqUserId });

            newPending.user_id = user._id;
            await newPending.save();
            user.pending.push(newPending);
            await user.save();

            // add request in request list of that user
            const newRequest = new Request({ user_id: reqUserId, request_user_id: user._id });
            const user2 = await User.findById({ reqUserId });
            console.log(user2);
            await newRequest.save();
            user2.request.push(newRequest);
            await user2.save();

            res.status(201).json({ success: true, pending: user.pending, request: user2.request });

        } else {
            res.status(200).json({ success: false, message: "You already send connection request to this user." });
        }


        const newRequest = new Request(req.body);


    },
    getUserConnectionPendings: async(req, res) => {
        const { userId } = req.params;
        const user = await User.findById(userId).populate('pending');
        if (!user) return res.status(400).json({ success: false });
        res.status(200).json(user.pending);
    },
    acceptConnectionRequest: async(req, res) => {
        const { userId } = req.params;
        const acceptUserId = req.body.accept_user_id;

        console.log(acceptUserId, userId);

        const user = await User.findById(userId);
        if (!user) return res.status(400).json({ success: false });

        const connectionRequest = await Request.find({ user_id: userId, request_user_id: acceptUserId });
        if (!connectionRequest) return res.status(400).json({ success: false });

        console.log(connectionRequest);
        if (connectionRequest[0] != null) {


            // remove connection request
            user.request.pull(connectionRequest[0]);
            await connectionRequest[0].remove();
            // add user to accept list
            const newAccept = new Accept(req.body);
            newAccept.user_id = user._id;
            await newAccept.save();
            user.accept.push(newAccept);
            await user.save();

            // remove connection pending from other user
            const user2 = await User.findById(acceptUserId);
            const connectionPending = await Pending.find({ user_id: user2._id, pending_user_id: userId });

            user2.pending.pull(connectionPending[0]);
            await connectionPending[0].remove();

            const newAccept2 = new Accept({ user_id: user2._id, accept_user_id: userId });
            await newAccept2.save();
            user2.accept.push(newAccept2);
            await user2.save();

            res.status(201).json({ success: true, user1: newAccept, user2: newAccept2 });
        } else {
            res.status(200).json({ success: false, message: "user request expired or not found" });
        }
    },

    getAcceptConnections: async(req, res) => {
        const { userId } = req.params;
        const user = await User.findById(userId).populate('accept');
        if (!user) return res.status(400).json({ success: false });
        res.status(200).json(user.accept);
    },

    unfriendUser: async(req, res) => {
        const { userId } = req.params;
        const { unfriendUserId } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(400).json({ success: false });
        const user2 = await User.findById(unfriendUserId);
        if (!user2) return res.status(400).json({ success: false });
        const removeFriendUser1 = await Accept.find({ user_id: userId, accept_user_id: unfriendUserId });
        const removeFriendUser2 = await Accept.find({ user_id: unfriendUserId, accept_user_id: userId });

        if (removeFriendUser1[0] != null && removeFriendUser2[0] != null) {
            user.accept.pull(removeFriendUser1[0]);
            await removeFriendUser1[0].remove();
            const declineUser = new Declined({ user_id: userId, declined_user_id: unfriendUserId });
            await declineUser.save();
            user.declined.push(declineUser);
            await user.save();

            user2.accept.pull(removeFriendUser2[0]);
            await removeFriendUser2[0].remove();
            await user2.save();

            res.status(200).json({ success: true });
        } else {
            res.status(409).json({ success: false });
        }
    },

    getDeclinedConnectionList: async(req, res) => {
        const { userId } = req.params;
        const user = await User.findById(userId).populate('declined');
        if (!user) return res.status(400).json({ success: false });
        res.status(200).json({ success: true, declined: user.declined });
    },

    declinedConnectionRequest: async(req, res) => {
        const { userId } = req.params;
        const { declined_user_id } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(400).json({ success: false });
        const user2 = await User.findById(declined_user_id);
        if (!user2) return res.status(400).json({ success: false });

        const connection_request = await Request.find({ user_id: userId, request_user_id: declined_user_id });
        const connection_pending = await Pending.find({ user_id: declined_user_id, pending_user_id: userId });
        if (connection_request[0] != null && connection_pending[0] != null) {
            console.log(connection_request);
            console.log(connection_pending);

            user.request.pull(connection_request[0]);
            await connection_request[0].remove();
            await user.save();

            user2.pending.pull(connection_pending[0]);
            await connection_pending[0].remove();
            const declinedUser = new Declined({ user_id: user2._id, declined_user_id: user._id });
            console.log(declinedUser);
            await declinedUser.save();
            user2.declined.push(declinedUser);
            await user2.save();

            res.status(201).json({ success: true, declined: declinedUser })
        } else {
            res.status(409).json({ success: false });
        }

    },

    blockUser: async(req, res) => {
        const { userId, blockId } = req.params;

        const user = await User.findById(userId);
        if (!user) return res.status(400).json({ success: false });
        const user2 = await User.findById(blockId);
        if (!user2) return res.status(400).json({ success: false });

        const removeFriendUser1 = await Accept.find({ user_id: userId, accept_user_id: blockId });
        const removeFriendUser2 = await Accept.find({ user_id: blockId, accept_user_id: userId });

        if (removeFriendUser1[0] != null && removeFriendUser2[0] != null) {
            //remove user2 from user1 friend list
            user.accept.pull(removeFriendUser1[0]);
            await removeFriendUser1[0].remove();

            //add user2 in block list of user1
            const blockUser = new Blocked({ user_id: userId, blocked_user_id: blockId });
            await blockUser.save();
            user.blocked.push(blockUser);

            //add user2 in declined list of user1
            const declineUser = new Declined({ user_id: userId, declined_user_id: unfriendUserId });
            await declineUser.save();
            user.declined.push(declineUser);
            await user.save();

            //remove user1 from user2 friend list
            user2.accept.pull(removeFriendUser2[0]);
            await removeFriendUser2[0].remove();
            await user2.save();

            res.status(200).json({ success: true });
        } else {
            res.status(409).json({ success: false });
        }
    }

};