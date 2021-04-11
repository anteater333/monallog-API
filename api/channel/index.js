const express = require('express');
const router = express.Router();

const controller = require('./channel.controller');

/**
 * URI: /channels
 */

router.get('/', controller.index);

router.get('/:channelName', controller.show);

router.delete('/:channelName', controller.destroy);

router.post('/', controller.create);

router.put('/:channelName', controller.update); // update

module.exports = router;