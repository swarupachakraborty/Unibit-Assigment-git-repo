const ObjectId = require("mongoose").Types.ObjectId


//**********************************************************************//

//==Request Body Validation
let isValidRequestBody = function (body) {
    if (Object.keys(body).length === 0) return false;
    return true;
}
//**********************************************************************//

//==Mandatory Field Validation
let isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false;
    if (typeof value === 'string' && value.trim().length === 0) return false;
    return true;
}
//**********************************************************************//
let isValidEmail = function (email) {
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return emailRegex.test(email)
}
//==ObjectId Validation
let isValidObjectId = function (objectId) {
    if (!ObjectId.isValid(objectId)) return false;
    return true;
}
//==Name Validation
let isValidName=function(name){
    let nameRegex=/^[A-Za-z\s]{1,}[A-Za-z\s]{0,}$/;
    return nameRegex.test(name);
    }
 //**********************************************************************//
    
//==Password Validation
 let isValidPassword=function(password){
    let regexPassword=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/
    return regexPassword.test(password);
    }
//*******************************************************************//



    module.exports = { isValidRequestBody,isValidEmail, isValid, isValidObjectId,  isValidName, isValidPassword}

//***************************************************************
