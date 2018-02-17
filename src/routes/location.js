const express = require('express');
const router = require('express-promise-router')();
const LocationController = require('../controllers/locations');

router.route('/')
    .get(LocationController.index);

router.route('/current')
    .get(LocationController.getCurrentLocations)


router.route('/:userId')
    .get(LocationController.getAllLocationsOfaUser);

router.route('/current/:userId')
    .get(LocationController.getCurrentLocationOfaUser);


module.exports = router;