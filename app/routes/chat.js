const express = require('express');
const router = express.Router();
const chatController = require("./../../app/controllers/chatController");
const appConfig = require("./../../config/appConfig")
const auth = require('./../middlewares/auth')

module.exports.setRouter = (app) => {

  let baseUrl = `${appConfig.apiVersion}/chat`;


  app.get(`${baseUrl}/get/for/user`, auth.isAuthorized, chatController.getUsersChat);

 
  app.get(`${baseUrl}/get/for/group`, auth.isAuthorized, chatController.getGroupChat);

  

  app.post(`${baseUrl}/mark/as/seen`, auth.isAuthorized, chatController.markChatAsSeen);

  app.get(`${baseUrl}/count/unseen`, auth.isAuthorized, chatController.countUnSeenChat);

 
  app.get(`${baseUrl}/find/unseen`, auth.isAuthorized, chatController.findUnSeenChat);

 
  app.get(`${baseUrl}/unseen/user/list`, auth.isAuthorized, chatController.findUserListOfUnseenChat);

}
