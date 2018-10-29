const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');

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

module.exports = router;
