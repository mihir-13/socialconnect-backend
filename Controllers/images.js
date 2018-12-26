const HttpStatus = require('http-status-codes');
const User = require('../Models/userModels');
const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: 'mihirb',
  api_key: '643616234724184',
  api_secret: 'eInM1w_BbL9leqKDw689Vka4gh0'
});


module.exports = {
  UploadImage(req, res) {
    cloudinary.uploader.upload(req.body.image, async (result) => {
      await User.update({
        _id: req.user._id
      }, {
          $push: {
            images: {
              imgId: result.public_id,
              imgVersion: result.version
            }
          }
        })
    })
      .then(() => {
        res.status(HttpStatus.OK).json({ message: 'Image Uploaded' });
      }).catch(err => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error while uploading Images.' });
      });
  },

  async SetDefaultImage(req, res) {
    const { imgId, imgVersion } = req.params;
    await User.update({
      _id: req.user._id
    }, {
        picId: imgId,
        picVersion: imgVersion
      }).then(() => {
        res.status(HttpStatus.OK).json({ message: 'Default Image Set' });
      }).catch(() => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error while changing Image.' });
      });
  }
}