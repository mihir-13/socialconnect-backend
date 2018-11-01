const HttpStatus = require('http-status-codes');
const User = require('../Models/userModels');


module.exports = {
  async GetAllUsers(req, res) {
    await User.find({})
    .populate('posts.postId')
    .populate('following.userFollowed')
    .populate('followers.follower')
    .populate('chatList.receiverId')
    .populate('chatList.msgId')
    .then((result) => {
      res.status(HttpStatus.OK).json({ message: 'All Users', result });
    }).catch(err => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error while fetching all users.' });
    });
  },


  async GetUsersById(req, res) {
    await User.findOne({ _id: req.params.id })
    .populate('posts.postId')
    .populate('following.userFollowed') 
    .populate('followers.follower')
    .populate('chatList.receiverId')
    .populate('chatList.msgId')
    .then((result) => {
      res.status(HttpStatus.OK).json({ message: 'User By Id', result });
    }).catch(err => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error while fetching user By id.' });
    });
  },


  async GetUsersByUsername(req, res) {
    await User.findOne({ username: req.params.username })
    .populate('posts.postId')
    .populate('following.userFollowed') 
    .populate('followers.follower')
    .populate('chatList.receiverId')
    .populate('chatList.msgId')
    .then((result) => {
      res.status(HttpStatus.OK).json({ message: 'User By Username', result });
    }).catch(err => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error while fetching user By username.' });
    });
  }
}