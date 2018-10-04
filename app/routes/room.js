const express = require('express');
const router = express.Router();
const roomController = require("./../../app/controllers/roomController");
const appConfig = require("./../../config/appConfig")
const auth = require('./../middlewares/auth')
module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/chat`;
app.post(`${baseUrl}/createChatRoom`, roomController.createChatRoom);

app.put(`${baseUrl}/deleteChatRoom`, roomController.deleteChatRoom);
app.put(`${baseUrl}/editChatRoom`, roomController.editChatRoom);
app.get(`${baseUrl}/:chatRoomId/getChatRoom`, roomController.getChatRoom);
//app.post(`${baseUrl}/sendInvite`, roomController.sendInvite);

app.get(`${baseUrl}/getChatRooms`, roomController.getChatRooms);
app.post(`${baseUrl}/joinChatRoom`, roomController.joinChatRoom);

//app.get(`${baseUrl}/:chatRoomId/closeGroup`,roomController.closeChatRoom);
}