const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLoginInput(data){
    let errors = {};

    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';



    if(!Validator.isEmail(data.email)){
        errors.email = 'That email doesn\'t quite look right';
    }
    if(Validator.isEmpty(data.email)){
        errors.email = 'Oops! Looks like you forgot to type your email';
    }
    if(Validator.isEmpty(data.password)){
        errors.password = 'Oops! Looks like you forgot to type your password';
    }
 
    return{
        errors,
        isValid: isEmpty(errors)
    }
}