const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

//Load input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

//Load User Model
const User = require('../../models/User');

//@route: GET api/users/test
//@desc: Tests users route
//@access: Public
router.get('/test', (req, res) => res.json({ msg: 'Users Works' }));

//@route: GET api/users/register
//@desc: Register a user
//@access: Public
router.post('/register', async (req, res) => {

  const { errors, isValid } = validateRegisterInput(req.body);

  if(!isValid){
    return res.status(400).json(errors)
  }

  const user = await User.findOne({ email: req.body.email });

  if (user) {
      errors.email = 'Email already exists'
    return res.status(400).json(errors);
  } else {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });

    bcrypt.genSalt(10, (error, salt) => {
      bcrypt.hash(newUser.password, salt, (error, hash) => {
        if (error) throw error;
        newUser.password = hash;

        newUser
          .save()
          .then(user => res.json(user))
          .catch(error => console.log(error));
      });
    });
  }
});

//@route: GET api/users/login
//@desc: Log in a user (return the jwt token)
//@access: Public
router.post('/login', (req, res) => {
   const { errors, isValid } = validateLoginInput(req.body);

   if(!isValid){
        return res.status(400).json(errors)
   }

  const email = req.body.email;
  const password = req.body.password;

  //Find User by email
  User.findOne({ email }).then(user => {
    //Check for user
    if (!user) {
        errors.email = 'Looks like you haven\' registered yet';
      return res.status(404).json(errors);
    }

    //Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        //User password match

        //JWT payload
        const payload = { id: user.id, name: user.name };

        //Sign Token
        jwt.sign(
            payload, 
            keys.secretOrKey, 
            { expiresIn: 7200 }, 
            (error, token) => {
                res.json({
                success: true,
                token: 'Bearer ' + token
            });
        });
      } else {
        errors.password = 'That password doesn\'t quite look right'
        return res.status(400).json(errors);
      }
    });
  });
});

//@route: GET api/users/current
//@desc: Return current user
//@access: Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json(req.user);
});

module.exports = router;
