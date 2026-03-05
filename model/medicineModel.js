const mongoose = require('mongoose');
const { type } = require('node:os');

const Schema = mongoose.Schema;

const medicineSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    stock:{
        type:Number,
        required:true
    }
})

module.exports = mongoose.model('Medicine', medicineSchema);