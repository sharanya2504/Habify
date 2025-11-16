const express = require('express');
const { createUser, getUsers } = require('../controllers/userControllers');
const router = express.Router();

router.post('/create', createUser);
router.get('/', getUsers);

module.exports = router;
