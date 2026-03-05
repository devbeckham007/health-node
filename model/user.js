const mongoose = require('mongoose');
// const { type } = require('node:os');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true,
    },
    refreshToken:{
        type:String
    }
});

module.exports = mongoose.model('User', userSchema);