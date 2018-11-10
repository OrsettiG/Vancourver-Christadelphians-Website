const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');

//Load Profile model
const Profile = require('../../models/Profile');
//Load User Profile
const User = require('../../models/User');


//@route: GET api/profiles/test
//@desc: Tests profiles route
//@access: Public
router.get('/test', (req, res) => res.json({ msg: 'Profiles Works' }));

//@route: GET api/profiles
//@desc: Get current User Profile
//@access: Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const errors = {}
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            if(!profile){
                errors.noProfile = 'This profile doesn\'t exist';
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
            .catch(error => res.status(404).json(error));
});

//@route: POST api/profiles
//@desc: Create or Edit User Profile
//@access: Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    
    const { errors, isValid } = validateProfileInput(req.body);

    //Check  validation
    if(!isValid){
        //return errors with 400 status
        return res.status(400).json(errors);
    }

    //Get fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if(req.body.handle) profileFields.handle = req.body.handle;
    if(req.body.favoriteVerse) profileFields.favoriteVerse = req.body.favoriteVerse;
    if(req.body.phone) profileFields.phone = req.body.phone;
    if(req.body.email2) profileFields.email2 = req.body.email2;
 
    Profile.findOne({ user: req.user.id })
     .then(profile => {
         if(profile){
             //Update profile
             Profile.findOneAndUpdate(
                 { user: req.user.id }, 
                 { $set: profileFields }, 
                 { new: true })
                     .then(profile => res.json(profile));
         } else{
             // Create new Profile
 
             //Check if handle exists
             Profile.findOne({ handle: profileFields.handle })
             .then(profile => {
                 if(profile){
                     errors.handle = 'That handle already exists';
                     res.status(400).json(errors);
                 }
 
                 //Save new Profile
                 new Profile(profileFields).save().then(profile => res.json(profile));
             });
         }
     });
 });

module.exports = router;
