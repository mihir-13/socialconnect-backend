const Joi = require('joi');
const HttpStatus = require('http-status-codes');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../Models/userModels');
const Helpers = require('../Helpers/helpers');
const dbConfig = require('../Config/secret');

module.exports = {
  async CreateUser(req, res) {
    console.log(req.body);
    // Validating the input params
    const schema = Joi.object().keys({
      username: Joi.string().min(5).max(12).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(5).required()
    });

    const { error, value } = Joi.validate(req.body, schema);
    if (error && error.details) {
      return res.status(HttpStatus.BAD_REQUEST).json({ msg: error.details });
    }

    // Formating user Email and Validating if it's exists in db or not
    const userEmail = await User.findOne({ email: Helpers.lowerCase(value.email) });
    if (userEmail) {
      return res.status(HttpStatus.CONFLICT).json({ message: 'Email already exists!' });
    }


    // Formating user-name and Validating if it's exists in db or not
    const userName = await User.findOne({ username: Helpers.firstLetterUpperCase(value.username) });
    if (userName) {
      return res.status(HttpStatus.CONFLICT).json({ message: 'Username already exists!' });
    }

    // Encrypting the password by using third-party modules - Bcrypt and auto-gen salt and appending hash
    return bcrypt.hash(value.password, 10, (err, hash) => {
      if (err) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Error hashing password!' });
      }

      // Creating a body after all validation and ready to send it to db
      const body = {
        username: Helpers.firstLetterUpperCase(value.username),
        email: Helpers.lowerCase(value.email),
        password: hash
      };

      // Creating a User and storing it into db
      User.create(body).then((user) => {
        console.log('USER CRETED IN CRETE', user);
        const token = jwt.sign({ data: user }, dbConfig.secret, {
          expiresIn: '1h'
        });
        res.cookie('auth', token);
        console.log("HttpStatus", HttpStatus);
        res.status(HttpStatus.CREATED).json({ message: 'User created successfully!', user, token });
      }).catch(err => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong!' });
      });
    });
  },

  async LoginUser(req, res) {
    console.log('REQ BODY', req.body);
    if (!req.body.username || !req.body.password) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'No empty fields allowed!' });
    }

    await User.findOne({ username: Helpers.firstLetterUpperCase(req.body.username) }).then(user => {
      if (!user) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'Username nor found!' });
      }
      return bcrypt.compare(req.body.password, user.password).then((result) => {
        if (!result) {
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Password is incorrect!' });
        }
        const token = jwt.sign({ data: user }, dbConfig.secret, {
          expiresIn: '5h'
        });
        res.cookie('auth', token);
        res.status(HttpStatus.OK).json({ message: 'Login successful', user, token });
      });
    }).catch(err => {
      console.log('err', err);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong while LogIn!' });
    });
  }
};