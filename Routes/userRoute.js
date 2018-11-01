const express = require('express');
const router = express.Router();

const UserCntrl = require('../Controllers/user');
const AuthHelper = require('../Helpers/AuthHelper');

router.get('/users', AuthHelper.VerifyToken, UserCntrl.GetAllUsers);
router.get('/user/:id', AuthHelper.VerifyToken, UserCntrl.GetUsersById);
router.get('/username/:username', AuthHelper.VerifyToken, UserCntrl.GetUsersByUsername);

module.exports = router;