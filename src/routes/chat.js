const router = require('express-promise-router')();
const ChatController = require('../controllers/chat');

router.route('/')
    .get(ChatController.getSpecificUserChat)
    .post(ChatController.chats);


module.exports = router;