const router = require('express-promise-router')();
const StatusControllers = require('../controllers/status');


router.route('/')
    .get(StatusControllers.GetAllStatus)
    .post(StatusControllers.AddStatus);

router.route('/:UserID')
    .get(StatusControllers.GetAllStatusBySpecificUser);

router.route('/:StatusID')
    .post(StatusControllers.UpdateStatus);

module.exports = router;