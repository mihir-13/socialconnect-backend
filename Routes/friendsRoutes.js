const express = require('express');
const router = express.Router();

const FriendCntrl = require('../Controllers/friends');
const AuthHelper = require('../Helpers/AuthHelper');

router.post('/follow-user', AuthHelper.VerifyToken, FriendCntrl.FollowUser);
router.post('/unfollow-user', AuthHelper.VerifyToken, FriendCntrl.UnFollowUser);
router.post('/mark/:id', AuthHelper.VerifyToken, FriendCntrl.MarkNotification);
router.post('/mark-all', AuthHelper.VerifyToken, FriendCntrl.MarkAllAsRead);

module.exports = router;