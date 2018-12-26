const express = require('express');
const router = express.Router();

const UserCntrl = require('../Controllers/user');
const AuthHelper = require('../Helpers/AuthHelper');

router.get('/users', AuthHelper.VerifyToken, UserCntrl.GetAllUsers);
router.get('/user/:id', AuthHelper.VerifyToken, UserCntrl.GetUsersById);
router.get('/username/:username', AuthHelper.VerifyToken, UserCntrl.GetUsersByUsername);
router.post('/user/view-profile', AuthHelper.VerifyToken, UserCntrl.ProfileNotification);
router.post('/change-password', AuthHelper.VerifyToken, UserCntrl.ChangePassword);

module.exports = router;