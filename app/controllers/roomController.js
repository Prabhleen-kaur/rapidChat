const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
const response = require('./../libs/responseLib');
const logger = require('./../libs/loggerLib');
const validateInput = require('../libs/paramsValidationLib');
const check = require('../libs/checkLib');
const passwordLib = require('./../libs/generatePasswordLib');
const token = require('./../libs/tokenLib');
const mailer = require('./../libs/mailLib');


const UserModel = mongoose.model('User');
const AuthModel = mongoose.model('Auth');
const RoomModel = mongoose.model('Room');

   let createChatRoom=(req,res)=>
   {
let createRoom=()=>
{
    console.log("create Room")
    return new Promise((resolve,reject)=>
{
    if(req.body.email) //email is present in body
    {

        console.log("req body email is there");
        console.log(req.body);
        let newChatRoom = new RoomModel({ 
            roomId: shortid.generate(),
            roomName: req.body.roomName,
        });

    UserModel.findOne({email:req.body.email},(err,userDetails)=> // email in body matches with the one in usermodel
{
if(err) //error case
{
    console.log(err)
    logger.error('Failed To Retrieve User Data', 'userController: findUser()', 10)
    let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
    reject(apiResponse)
}
    else if (check.isEmpty(userDetails)) { 
        logger.error('No User Found', 'userController: findUser()', 7)
        let apiResponse = response.generate(true, 'No User Details Found', 404, null)
        reject(apiResponse)
    }
    else{
        let createdBy= {} //object
        createdBy.name=userDetails.firstName+userDetails.lastName;
        createdBy.id=userDetails.id;
        newChatRoom.admin=createdBy
        newChatRoom.members.push(createdBy) 
        userDetails.groups.push(newChatRoom.roomId);
    }
    newChatRoom.save((err,newChatRoom)=>
{
    if (err) {
        logger.error(err.message, "RoomController:createChatRoom()", 10);
        let apiResponse = response.generate("true", "Failed to create Chat Room", 500, null);
        reject(apiResponse);
    }
    else {
        logger.info("chat room created successfully", "RoomController:createChatRoom()", 10);
        let data = {};
        data.userdetails = userDetails;
        data.newRoom = newChatRoom;
        resolve(data);
    }
})
})
    }
    else{
        logger.error('User email dont exist', 'userController: createUser', 4)
        let apiResponse = response.generate(true, 'User Already Present With this Email', 403, null)
        reject(apiResponse)
    }
})
}
let saveDetails = (data) => {

    return new Promise((resolve, reject) => {

        UserModel.update({ userId: data.userdetails.userId }, { groups: data.userdetails.groups }, { multi: true }, (err, result) => {
            if (err) {
                logger.error(err.message, "roomController:createChatRoom()", 10);
                let apiResponse = response.generate("true", "Failed to save user chat details.", 500, null);
                reject(apiResponse);
            }
            else if (check.isEmpty(result)) {
                logger.error("User details not Saved", "roomController: CreateChatRoom", 10);
                let apiResponse = response.generate(true, "unable to save user to chat room", 500, null);
                reject(apiResponse);
            } else {
                logger.info("chatRoom saved to user details", "roomController: createChatRoom", 10);
                resolve(data.newRoom);
            }
        });//end update for saving new room
    });//end promise
}
createRoom(req, res)
.then(saveDetails)
.then((result) => {
    let apiResponse = response.generate(false, "room saved to user details", 200, result);
    res.send(apiResponse);
})
.catch((err) => {
    res.send(err);
});
   }
let deleteChatRoom = (req, res) => {
let findRoom =()=>
{
    console.log('find room')
    return new Promise((resolve,reject)=>
{
 if(req.body.roomId)
 {
     console.log("room id is there")
     RoomModel.findOne({roomId:req.body.roomId},(err,roomDetails)=>
    {
        if(err)
        {
            logger.error(err.message, "chatRoomController:deleteChatRoom()", 10);
            let apiResponse = response.generate("true", "Failed to chat room", 500, null);
            reject(apiResponse);
        }
        else if (check.isEmpty(roomDetails)) {
            logger.error('No room id found', "chatRoomController:deleteChatRoom()", 10);
            let apiResponse = response.generate("true", "No chat room found", 500, null);
            reject(apiResponse);
        }
        else {
            logger.info("room id found", "chatRoomrController: deleteChatRoom()", 10);
         
            resolve(roomDetails);
        }
    })
 }
 else{
    let apiResponse = response.generate(true, '"room id" parameter is missing', 400, null)
    reject(apiResponse)
 }   
})
}
let deleteRoom=()=>
{
     if(req.body.roomId) {

        RoomModel.remove({ roomId: req.body.roomId }, (err, retrievedRoomDetails) => {
            if (err) {
                logger.error(err.message, "chatRoomController:deleteChatRoom()", 10);
                let apiResponse = response.generate("true", "Failed to chat room", 500, null);
                reject(apiResponse);
            }
            else if (check.isEmpty(roomDetails)) {
                logger.error('No room id found', "chatRoomController:deleteChatRoom()", 10);
                let apiResponse = response.generate("true", "No chat room found", 500, null);
                reject(apiResponse);
            }
            else {
                logger.info("Chat Room deleted", "chatRoomrController: deleteChatRoom()", 10);
              
                resolve(retrievedRoomDetails);
            }
        });
    }
    else{
      
        let apiResponse = response.generate("true", " Id not found", 500, null);
        reject(apiResponse);
    }}
    findRoom(req,res)
    .then(deleteRoom)
    .then((resolve)=>{
        let apiResponse = response.generate(false, 'Room deleted', 200, resolve)
        res.status(200)
        res.send(apiResponse)
    })
    .catch((err) => {
        console.log("errorhandler");
        console.log("Error");
        res.status(err.status)
        res.send(err)
    })
}
let editChatRoom = (req, res) => {
    let findRoom =()=>
{
    console.log('find room')
    return new Promise((resolve,reject)=>
{
 if(req.body.roomId)
 {
     console.log("room id is there")
     RoomModel.findOne({roomId:req.body.roomId},(err,roomDetails)=>
    {
        if(err)
        {
            logger.error(err.message, "chatRoomController:deleteChatRoom()", 10);
            let apiResponse = response.generate("true", "Failed to chat room", 500, null);
            reject(apiResponse);
        }
        else if (check.isEmpty(roomDetails)) {
            logger.error('No room id found', "chatRoomController:deleteChatRoom()", 10);
            let apiResponse = response.generate("true", "No chat room found", 500, null);
            reject(apiResponse);
        }
        else {
            logger.info("room id found", "chatRoomrController: deleteChatRoom()", 10);
         
            resolve(roomDetails);
        }
    })
 }
 else{
    let apiResponse = response.generate(true, '"room id" parameter is missing', 400, null)
    reject(apiResponse)
 }   
})
}
let editRoom=()=>
{
  if(req.body.roomId){
    let options = req.body;
      RoomModel.update({roomId:req.roomId}, options, { multi: true }, (err, roomDetails)=>
    {
        if (err) {
            logger.error(err.message, "roomController:editChatRoom()", 10);
            let apiResponse = response.generate(true, "Failed to edit chat room", 500, null);
            res.send(apiResponse);
        }
        else if (check.isEmpty(roomDetails)) {
            logger.error("chatRoom not found", "roomController: editChatRoom", 10);
            let apiResponse = response.generate(true, "chatRoom not found", 500, null);
            res.send(apiResponse);
        }
        else {
            logger.info("Chat Room edited", "roomrController: editChatRoom()", 10);
            let apiResponse = response.generate(false, "Chat Room edited", 200, roomDetails);
            res.send(apiResponse);
        }
    })
  }
  else{
      
    let apiResponse = response.generate("true", "Id not mentioned", 500, null);
    res.send(apiResponse);
}

}
findRoom(req,res)
    .then(editRoom)
    .then((resolve)=>{
        let apiResponse = response.generate(false, 'Room edited', 200, resolve)
        res.status(200)
        res.send(apiResponse)
    })
    .catch((err) => {
        console.log("errorhandler");
        console.log("Error");
        res.status(err.status)
        res.send(err)
    })}
let getChatRoom = (req, res) => {

    if (check.isEmpty(req.params.chatRoomId)) {
        logger.error("chatRoomId is missing", "roomController: getChatRoom", 10);
        let apiResponse = response.generate(true, "chatRoomId is missing", 500, null);
        reject(apiResponse);
    }
    else {
        RoomModel.findOne({ roomId: req.params.chatRoomId }, (err, roomDetails) => {

            /* handle the error if the user is not found */
            if (err) {
                logger.error('Failed to find rooms', "chatRoom: getChatRoom", 10);
                let apiResponse = response.generate(true, "failed to find the Room", 500, null);
                res.send(apiResponse);
            }/* if company details is not found */
            else if (check.isEmpty(roomDetails)) {
                logger.error("No Room Found", "chatRoomController: getChatRoom", 10);
                let apiResponse = response.generate(true, "No Room Found", 500, null);
                res.send(apiResponse);
            }
            else {
                logger.info("Room found", "chatRoomController: getChatRoom", 10);
                let apiResponse = response.generate(false, "Group found", 200, roomDetails);
                res.send(apiResponse);

            }

        });
    }

}
let sendInvite = (req, res) => {

    let findUser = () => {

        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.body.userEmail)) {
                logger.error("userEmail is missing", "chatRoomController: sendInvite", 10);
                let apiResponse = response.generate(true, "userEmail is missing", 500, null);
                reject(apiResponse);
            }
            else {

                UserModel.findOne({ email: req.body.userEmail }, (err, userDetails) => {
                    /* handle the error if the user is not found */
                    if (err) {
                        logger.error('Failed to retrieve user Data', "userController: findUser()", 10);
                        let apiResponse = response.generate(true, "failed to find the user with given email", 500, null);
                        reject(apiResponse);
                    }/* if company details is not found */
                    else if (check.isEmpty(userDetails)) {
                        logger.error("No User Found", "userController: findUser()", 10);
                        let apiResponse = response.generate(true, "No user Details Found", 500, null);
                        reject(apiResponse);
                    }
                    else {
                        logger.info("user found", "userController: findUser()", 10);
                        let details = {};
                        details.userDetails = userDetails;
                        resolve(details);
                    }
                });
            }
        });
    }//end findUser()

    let findRoom = (details) => {

        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.body.chatRoomId)) {
                logger.error("chatRoomId is missing", "chatRoomController: sendInvite", 10);
                let apiResponse = response.generate(true, "chatRoomId is missing", 500, null);
                reject(apiResponse);
            }
            else {

                RoomModel.findOne({ roomId: req.body.chatRoomId }, (err, roomDetails) => {
                    /* handle the error if the user is not found */
                    if (err) {
                        logger.error('Failed to retrieve Group Data', "chatRoom: findRoom", 10);
                        let apiResponse = response.generate(true, "failed to find the Group with given chatRoomId", 500, null);
                        reject(apiResponse);
                    }/* if company details is not found */
                    else if (check.isEmpty(roomDetails)) {
                        logger.error("No Group Found", "chatRoomController: findRoom", 10);
                        let apiResponse = response.generate(true, "No Group Details Found", 500, null);
                        reject(apiResponse);
                    }
                    else {
                        logger.info("Group found", "chatRoomController: findRoom", 10);
                        details.roomDetails = roomDetails;
                        resolve(details);
                    }
                });
            }
        });
    }//end findRoom()

    let sendMail = (details) => {

        return new Promise((reject, resolve) => {
            logger.info("User & Group found", "chatRoomController: sendMail", 10);
            mailer.autoEmail(req.body.userEmail, `<a href='http://localhost:4200/joinGroup/${details.roomDetails.roomId}/${details.roomDetails.roomName}'>click here to join the Chat Room</a>`);
            let apiResponse = response.generate(false, "User & Group found", 200,"Mail sent successfully");
            resolve(apiResponse);
        });

    }//end sendMail

    findUser(req, res)
        .then(findRoom)
        .then(sendMail)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            res.send(err);
        });

}
let joinChatRoom = (req, res) => {

    let findUser = () => {

        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.body.userEmail)) {
                logger.error("userEmail is missing", "chatRoomController: sendInvite", 10);
                let apiResponse = response.generate(true, "userEmail is missing", 500, null);
                reject(apiResponse);
            }
            else {

                UserModel.findOne({ email: req.body.userEmail }, (err, userDetails) => {
                    /* handle the error if the user is not found */
                    if (err) {
                        logger.error('Failed to retrieve user Data', "userController: findUser()", 10);
                        let apiResponse = response.generate(true, "failed to find the user with given email", 500, null);
                        reject(apiResponse);
                    }/* if company details is not found */
                    else if (check.isEmpty(userDetails)) {
                        logger.error("No User Found", "userController: findUser()", 10);
                        let apiResponse = response.generate(true, "No user Details Found", 500, null);
                        reject(apiResponse);
                    }
                    else {
                        logger.info("user found", "userController: findUser()", 10);
                        let details = {};
                        details.userDetails = userDetails;
                        resolve(details);
                    }
                });
            }
        });
    }//end findUser()

    let findRoom = (details) => {

        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.body.chatRoomId)) {
                logger.error("chatRoomId is missing", "chatRoomController: sendInvite", 10);
                let apiResponse = response.generate(true, "chatRoomId is missing", 500, null);
                reject(apiResponse);
            }
            else {

                RoomModel.findOne({ roomId: req.body.chatRoomId }, (err, roomDetails) => {
                    /* handle the error if the user is not found */
                    if (err) {
                        logger.error('Failed to retrieve Group Data', "chatRoom: findRoom", 10);
                        let apiResponse = response.generate(true, "failed to find the Group with given chatRoomId", 500, null);
                        reject(apiResponse);
                    }/* if company details is not found */
                    else if (check.isEmpty(roomDetails)) {
                        logger.error("No Group Found", "chatRoomController: findRoom", 10);
                        let apiResponse = response.generate(true, "No Group Details Found", 500, null);
                        reject(apiResponse);
                    }
                    else {
                        logger.info("Group found", "chatRoomController: findRoom", 10);
                        details.roomDetails = roomDetails;
                        resolve(details);
                    }
                });
            }
        });
    }//end findRoom()

    let saveRoom = (details) => {

        return new Promise((resolve, reject) => {
            let user = {};
            user.name = `${details.userDetails.firstName} ${details.userDetails.lastName}`;
            user.Id = details.userDetails.userId;
            details.roomDetails.members.push(user);

            RoomModel.update({ roomId: req.body.chatRoomId }, { members: details.roomDetails.members }, { multi: true }, (err, result) => {
                if (err) {
                    logger.error(err.message, "chatRoomController:createChatRoom()", 10);
                    let apiResponse = response.generate("true", "Failed to save room details.", 500, null);
                    reject(apiResponse);
                }
                else if (check.isEmpty(result)) {
                    logger.error("User details not Saved", "chatRoomController: CreateChatRoom", 10);
                    let apiResponse = response.generate(true, "unable to save user to chat room", 500, null);
                    reject(apiResponse);
                } else {
                    logger.info("user saved to room details", "chatRoomController: createChatRoom", 10);
                    resolve(details);
                }
            });//end update for saving new room
        });//end promise
    }//end saveRoom
    let saveUser = (details) => {

        return new Promise((resolve, reject) => {
            details.userDetails.groups.push(req.body.chatRoomId);

            UserModel.update({ email: req.body.userEmail }, { groups: details.userDetails.groups }, { multi: true }, (err, result) => {
                if (err) {
                    logger.error(err.message, "chatRoomController:createChatRoom()", 10);
                    let apiResponse = response.generate("true", "Failed to save user chat details.", 500, null);
                    reject(apiResponse);
                }
                else if (check.isEmpty(result)) {
                    logger.error("User details not Saved", "chatRoomController: CreateChatRoom", 10);
                    let apiResponse = response.generate(true, "unable to save user to chat room", 500, null);
                    reject(apiResponse);
                } else {
                    logger.info("chatRoom saved to user details", "chatRoomController: createChatRoom", 10);
                    resolve(result);
                }
            });//end update for saving new room
        });//end promise
    }//end saveDetails

    findUser(req, res)
        .then(findRoom)
        .then(saveRoom)
        .then(saveUser)
        .then((result) => {
            let apiResponse = response.generate(false, "User & Group Saved", 200, result);
            res.send(apiResponse);
        })
        .catch((err) => {
            res.send(err);
        });

}
let getChatRooms = (req, res) => {

    RoomModel.find({}, (err, roomsDetails) => {

        /* handle the error if the user is not found */
        if (err) {
            logger.error('Failed to find rooms', "chatRoom: getChatRooms", 10);
            let apiResponse = response.generate(true, "failed to find the Rooms", 500, null);
            res.send(apiResponse);
        }/* if company details is not found */
        else if (check.isEmpty(roomsDetails)) {
            logger.error("No Rooms Found", "chatRoomController: getChatRooms", 10);
            let apiResponse = response.generate(true, "No Rooms Found", 500, null);
            res.send(apiResponse);
        }
        else {
            logger.info("Rooms found", "chatRoomController: getChatRooms", 10);
            let apiResponse = response.generate(false, "Groups found", 200, roomsDetails);
            res.send(apiResponse);

        }

    });

} 
let closeChatRoom = (req, res) => {

    if (check.isEmpty(req.params.chatRoomId)) {
        logger.error("chatRoomId is missing", "chatRoomController: closeChatRoom", 10);
        let apiResponse = response.generate(true, "chatRoomId is missing", 500, null);
        reject(apiResponse);
    }
    else {

        RoomModel.update({ roomId: req.params.chatRoomId }, { status: false }, (err, roomDetails) => {

            /* handle the error if the user is not found */
            if (err) {
                logger.error('Failed to find room', "chatRoom: closeChatRoom", 10);
                let apiResponse = response.generate(true, "failed to find the Room", 500, null);
                res.send(apiResponse);
            }/* if company details is not found */
            else if (check.isEmpty(roomDetails)) {
                logger.error("No Room Found", "chatRoomController: closeChatRoom", 10);
                let apiResponse = response.generate(true, "No Room Found", 500, null);
                res.send(apiResponse);
            }
            else {
                logger.info("Room found & marked close", "chatRoomController: closeChatRoom", 10);
                let apiResponse = response.generate(false, "Group found & marked close", 200, roomDetails);
                res.send(apiResponse);
            }
        });
    }
}   
module.exports = {
    createChatRoom: createChatRoom,
    deleteChatRoom:deleteChatRoom,
    editChatRoom:editChatRoom,
    getChatRoom:getChatRoom,
    
}