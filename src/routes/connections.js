const express = require('express');
const router = require('express-promise-router')();
const ConnectionsController = require('../controllers/connections');

const { validateParam, validateBody, schemas } = require('../helpers/routeHelpers');


router.route('/:userId')
    .get(ConnectionsController.getUserConnections)
    .post(ConnectionsController.addNewConnection);

router.route('/:userId/following')
    .get(ConnectionsController.getUserFollowing)
    .post(ConnectionsController.followingNewUser);

router.route('/:userId/follower')
    .get(ConnectionsController.getUserFollowers);

router.route('/unfollow')
    .post(ConnectionsController.unfollowUser);

router.route('/:userId/request')
    .get(ConnectionsController.getUserConnectionRequests)
    .post(ConnectionsController.sendConnectionRequest);

router.route('/:userId/pending')
    .get(ConnectionsController.getUserConnectionPendings);

router.route('/:userId/accept')
    .get(ConnectionsController.getAcceptConnections)
    .post(ConnectionsController.acceptConnectionRequest);

router.route('/:userId/declined')
    .get(ConnectionsController.getDeclinedConnectionList)
    .post(ConnectionsController.declinedConnectionRequest);

router.route('/:userId/unfriend')
    .post(ConnectionsController.unfriendUser);

router.route('/:userId/blockUser/:blockId')
    .post(ConnectionsController.blockUser);



/*router.route('/:userId/remove-declined')
    .post(ConnectionsController.removeDeclined);*/






module.exports = router;