const Joi = require('joi');
const HttpStatus = require('http-status-codes');
const cloudinary = require('cloudinary');
const moment = require('moment');
const request = require('request');

const Post = require('../Models/postModel');
const User = require('../Models/userModels');

cloudinary.config({
  cloud_name: 'mihirb',
  api_key: '643616234724184',
  api_secret: 'eInM1w_BbL9leqKDw689Vka4gh0'
});

module.exports = {
  AddPost(req, res) {
    const schema = Joi.object().keys({
      post: Joi.string().required()
    });
    const body = {
      post: req.body.post
    }
    const { error } = Joi.validate(body, schema);
    if (error && error.details) {
      return res.status(HttpStatus.BAD_REQUEST).json({ msg: error.details });
    }
    const body2 = {
      user: req.user._id,
      username: req.user.username,
      post: req.body.post,
      created: new Date()
    }

    if (req.body.post && !req.body.image) {
      Post.create(body2).then(async (post) => {
        await User.update({
          _id: req.user._id
        }, {
            $push: {
              posts: {
                postId: post._id,
                post: req.body.post || post.post,
                created: new Date()
              }
            }
          });
        res.status(HttpStatus.OK).json({ message: 'Post Created', post });
      }).catch(error => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error Occured.' });
      });
    }

    if (req.body.post && req.body.image) {
      cloudinary.uploader.upload(req.body.image, async (result) => {
        const reqBody = { 
          user: req.user._id,
          username: req.user.username,
          post: req.body.post,
          imgId: result.public_id,
          imgVersion: result.version,
          created: new Date()
        }
        Post.create(reqBody).then(async (post) => {
          await User.update({
            _id: req.user._id
          }, {
              $push: {
                posts: {
                  postId: post._id,
                  post: req.body.post || post.post,
                  created: new Date()
                }
              }
            });
          res.status(HttpStatus.OK).json({ message: 'Post Created', post });
        }).catch(error => {
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error Occured.' });
        });
      });
    }
  },

  async GetAllPosts(req, res) {
    try {
      const today = moment().startOf('day');
      const tomorrow = moment(today).add(45, 'days');
      // created: {$gte: today.toDate(), $lt: tomorrow.toDate()}
      const posts = await Post.find({}).populate('user').sort({ created: -1 });

      const top = await Post.find({ totalLikes: { $gte: 2 } }).populate('user').sort({ created: -1 });

      const user = await User.findOne({ _id: req.user._id});
      
      if (user.city === '' && user.country === '') {
        request('https://geoip-db.com/json/', { json: true }, async (err, res, body) => {
          await User.update({
            _id: req.user._id
          }, {
            city: body.city,
            country: body.country_name
          })
          console.log('city', city);
        });
        
      }
      

      

      return res.status(HttpStatus.OK).json({ message: 'All Posts', posts, top });
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong while fetching posts.' });
    }
  },

  async GetPost(req, res) {
    await Post.findOne({ _id: req.params.id }).populate('user').populate('comments.userId').then((post) => {
      res.status(HttpStatus.OK).json({ message: 'Comment Found', post }).catch(err => {
        res.status(HttpStatus.NOT_FOUND).json({ message: 'Error while fetching Post!', post });
      });
    })
  },

  async AddLikePost(req, res) {
    console.log(req);
    const postId = req.body._id;
    await Post.update({
      _id: postId,
      "likes.username": { $ne: req.user.username }
    },
      {
        $push: {
          likes: {
            username: req.user.username
          }
        },
        $inc: { totalLikes: 1 },
      }).then(() => {
        res.status(HttpStatus.OK).json({ message: 'You liked the post.' });
      }).catch(err => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occured while liking the post.' });
      });
  },

  async AddComment(req, res) {
    console.log(req.body);
    const postId = req.body.postId;
    await Post.update({
      _id: postId
    },
      {
        $push: {
          comments: {
            userId: req.user._id,
            username: req.user.username,
            comment: req.body.comment,
            createdAt: new Date()
          }
        }
      }).then(() => {
        res.status(HttpStatus.OK).json({ message: 'Comment added to the post.' });
      }).catch(err => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occured while commenting the post.' });
      });
  }


}