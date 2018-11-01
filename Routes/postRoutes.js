const express = require('express');
const router = express.Router();

const PostCntrl = require('../Controllers/posts');
const AuthHelper = require('../Helpers/AuthHelper');

router.get('/posts', AuthHelper.VerifyToken, PostCntrl.GetAllPosts);
router.get('/post/:id', AuthHelper.VerifyToken, PostCntrl.GetPost);

router.post('/post/add-post', AuthHelper.VerifyToken, PostCntrl.AddPost);
router.post('/post/add-likepost', AuthHelper.VerifyToken, PostCntrl.AddLikePost);
router.post('/post/add-comment', AuthHelper.VerifyToken, PostCntrl.AddComment);

module.exports = router