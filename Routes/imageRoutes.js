const express = require('express');
const router = express.Router();

const ImageCntrl = require('../Controllers/images');
const AuthHelper = require('../Helpers/AuthHelper');

router.post('/upload-image', AuthHelper.VerifyToken, ImageCntrl.UploadImage);
router.get('/set-default-image/:imgId/:imgVersion', AuthHelper.VerifyToken, ImageCntrl.SetDefaultImage);

module.exports = router;