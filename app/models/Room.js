const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const time = require('./../libs/timeLib');

const Room = new Schema({
    roomId: {
        type: String,
        default: 0,
        index: true,
        unique: true
    },
    roomName: {
        type: String,
        default: "New Group",
        unique: true
    },
    admin: {},
    createdOn: {
        type: Date,
        default: time.now
    },
    modifiedOn:{
        type: Date,
        default: time.now
    },
    message:
    { type: String, default: '' },
    members:[],
    status:{
        type: Boolean,
        default: true
    },
   adminId:String,
   adminName:String
});

mongoose.model('Room', Room);