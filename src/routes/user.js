const express = require('express');
const router = require('express-promise-router')();
const UsersController = require('../controllers/users');

const { validateParam, validateBody, validateSigninToken, schemas, tokens } = require('../helpers/routeHelpers');

router.route('/')
    .get(UsersController.index)
    .post(UsersController.newUser);

router.route('/:userId')
    .get(validateParam(schemas.idSchema, 'userId'),UsersController.getUser)
    .put([validateParam(schemas.idSchema, 'userId'),validateBody(schemas.userSchema)],UsersController.replaceUser)
    .patch([validateParam(schemas.idSchema, 'userId'), validateBody(schemas.userOptionalSchema)],UsersController.updateUser);

router.route('/:userId/all')
    .get(validateParam(schemas.idSchema, 'userId'), UsersController.getUserAllFields);

router.route('/:userId/location')
    .get(validateParam(schemas.idSchema, 'userId'),UsersController.getUserLocations)
    .post([validateParam(schemas.idSchema, 'userId'), validateBody(schemas.userLocationSchema)],UsersController.addUserLocation);

router.route('/:userId/device')
    .get(validateParam(schemas.idSchema, 'userId'),UsersController.getUserDevices)
    .post([validateParam(schemas.idSchema, 'userId'), validateBody(schemas.userDeviceSchema)],UsersController.newUserDevice);

/*router.route('/:userId/connection')
    .get(UsersController.getUserConnections)
    .post(UsersController.addNewConnection);*/



module.exports = router;