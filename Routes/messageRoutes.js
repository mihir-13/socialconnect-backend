const express = require('express');
const router = express.Router();

const MessageCntrl = require('../Controllers/message');
const AuthHelper = require('../Helpers/AuthHelper');

router.get('/chat-messages/:sender_Id/:receiver_Id', AuthHelper.VerifyToken, MessageCntrl.GetAllMessages);
router.get('/receiver-messages/:sender/:receiver', AuthHelper.VerifyToken, MessageCntrl.MarkReceiverMessages);
router.get('/mark-all-messages', AuthHelper.VerifyToken, MessageCntrl.MarkAllMessages);
router.post('/chat-messages/:sender_Id/:receiver_Id', AuthHelper.VerifyToken, MessageCntrl.SendMessage);

module.exports = router;