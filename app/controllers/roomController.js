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

   
let createChatRoom1=(req,res)=>
   {
let createRoom=()=>
{
    console.log("create Room")
    return new Promise((resolve,reject)=>
{
    if(req.body.userId) 
    {

        console.log("userId is there");
        console.log(req.body.userId);
        let newChatRoom = new RoomModel({ 
            roomId: shortid.generate(),
            roomName: req.body.roomName,
        });

    UserModel.findOne({userId:req.body.userId},(err,userDetails)=>
{
if(err)
{
    console.log(err)
    logger.error('Failed To Retrieve User Data', 'roomController: createRoom()', 10)
    let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
    reject(apiResponse)
}
    else if (check.isEmpty(userDetails)) { 
        logger.error('No User Found', 'userController: findUser()', 7)
        let apiResponse = response.generate(true, 'No User Details Found', 404, null)
        reject(apiResponse)
    }
    else{
        let createdBy= {} 
        createdBy.name=userDetails.firstName+userDetails.lastName;
        createdBy.id=userDetails.userId;
        newChatRoom.adminId=createdBy.id;
        newChatRoom.adminName=createdBy.name;
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
        logger.error('authToken', 'userController: createUser', 4)
        let apiResponse = response.generate(true, 'userId doesnot exist', 403, null)
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
   
   let createChatRoom=(req,res)=>
   {
       let checkRoom=()=>
       {
        return new Promise((resolve,reject)=>
        {
           RoomModel.findOne({roomName:req.body.roomName},(err,userDetails)=>
           {
               if(err)
               {
                logger.error('Failed To Retrieve room Data', 'roomController: createRoom()', 10)
                let apiResponse = response.generate(true, 'Failed To Find room Details', 500, null)
                reject(apiResponse)
               }
               else if (check.isEmpty(userDetails)){
                logger.info("Room found", "roomController: getSingleRoom", 10);
                let apiResponse = response.generate(false, "Room not found", 200, userDetails);
                resolve(apiResponse);
               }
               else{
                logger.error('Room Found', 'roomController: createRoom()', 7)
                let apiResponse = response.generate(true, 'Room Found', 404, null)
                reject(apiResponse)
               }
           }) 
        }
        )

       }
let createRoom=()=>
{
    console.log("create Room")
    return new Promise((resolve,reject)=>
{
    
    if(req.body.userId) 
    {

        console.log("userId is there");
        console.log(req.body.userId);
        let newChatRoom = new RoomModel({ 
            roomId: shortid.generate(),
            roomName: req.body.roomName,
        });

    UserModel.findOne({userId:req.body.userId},(err,userDetails)=>
{
if(err)
{
    console.log(err)
    logger.error('Failed To Retrieve User Data', 'roomController: createRoom()', 10)
    let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
    reject(apiResponse)
}
    else if (check.isEmpty(userDetails)) { 
        logger.error('No User Found', 'roomController: createRoom()', 7)
        let apiResponse = response.generate(true, 'No User Details Found', 404, null)
        reject(apiResponse)
    }
   
    else{
        let createdBy= {} 
        createdBy.name=userDetails.firstName+userDetails.lastName;
        createdBy.id=userDetails.userId;
        newChatRoom.adminId=createdBy.id;
        newChatRoom.adminName=createdBy.name;
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
        logger.error('authToken', 'userController: createUser', 4)
        let apiResponse = response.generate(true, 'userId doesnot exist', 403, null)
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
checkRoom(req, res)
.then(createRoom)
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

    let findRoom = () => {
        return new Promise((resolve, reject) => {
            RoomModel.findOne({ roomName: req.body.roomName }, (err, roomDetails) => {
                if (err) {
                    logger.error('Failed to find rooms', "roomController: getSingleRoom", 10);
                    let apiResponse = response.generate(true, "failed to find the Room", 500, null);
                    reject(apiResponse);
                }
                else if (check.isEmpty(roomDetails)) {
                    logger.info("No Room Found", "roomController: getSingleRoom", 10);
                    let apiResponse = response.generate(true, "No Room Found", 404, null);
                    reject(apiResponse);
                }
                else {
                    logger.info("Room found", "roomController: getSingleRoom", 10);
                    let apiResponse = response.generate(false, "Group found", 200, roomDetails);
                    resolve(apiResponse);
                }
            });
    });
    }//end findRoom
    let findAdmin = () => {
        return new Promise((resolve, reject) => {
            RoomModel.findOne({ adminId: req.body.userId }, (err, roomDetails) => {
                if (err) {
                    logger.error('Failed to find rooms', "roomController: getSingleRoom", 10);
                    let apiResponse = response.generate(true, "failed to find the Room", 500, null);
                    reject(apiResponse);
                }
                else if (check.isEmpty(roomDetails)) {
                    logger.info("No Room Found", "roomController: getSingleRoom", 10);
                    let apiResponse = response.generate(true, "No Room Found", 404, null);
                    reject(apiResponse);
                }
                else {
                    logger.info("Room found", "roomController: getSingleRoom", 10);
                    let apiResponse = response.generate(false, "Group found", 200, roomDetails);
                    resolve(apiResponse);
                }
            });
    });
    }

   let deleteRoom = () => {
    return new Promise((resolve, reject) => {
        RoomModel.remove({ roomName: req.body.roomName }, (err, roomDetails) => {
            if (err) {
                logger.error(err.message, "roomController:deleteChatRoom()", 10);
                let apiResponse = response.generate(true, "Failed to delete chat room", 500, null);
                reject(apiResponse);
            }
            else if (check.isEmpty(roomDetails)) {
                logger.info('No chat room found', "roomController:deleteChatRoom()", 10);
                let apiResponse = response.generate(true, "No chat room found", 404, null);
                reject(apiResponse);
            }
            else {
                logger.info("Chat Room deleted", "roomrController: deleteChatRoom()", 10);
                let apiResponse = response.generate(false, "Chat Room deleted", 200, roomDetails);
                resolve(apiResponse);
            }
        });//end room
    });
    }// end deleteRoom


    findRoom(req, res)
    .then(findAdmin)
    .then(deleteRoom)
    .then((roomDetails) => {
        let apiResponse = response.generate(false, 'Room deleted Successfully.', 200, roomDetails)
        res.send(apiResponse)
    })
    .catch((err) => {
        console.log(err);
        res.send(err)
    });

}
let deleteChatRoom1= (req, res) => {
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
            let apiResponse = response.generate(false, "Group found", 200, roomDetails);
            resolve(apiResponse);
        }
    })
 }
 else{
    let apiResponse = response.generate(true, '"room id" parameter is missing', 400, null)
    reject(apiResponse)
 }   
})
}
let checkAdmin=()=>
{
    RoomModel.findOne({adminId:req.body.userId},(err,roomDetails)=>
    {
        if(err)
        {
            logger.error(err.message, "chatRoomController:deleteChatRoom()", 10);
            let apiResponse = response.generate("true", "Failed to chat room", 500, null);
            reject(apiResponse);
        }
        else if (check.isEmpty(roomDetails)) {
            logger.error('No room id found', "chatRoomController:deleteChatRoom()", 10);
            let apiResponse = response.generate("true", "No userId found", 500, null);
            reject(apiResponse);
        }
        else {
            logger.info(" userId match with the adminId", "chatRoomController: deleteChatRoom()", 10);
         
            let apiResponse = response.generate(false, "UserId match with admin id", 200, roomDetails);
                resolve(apiResponse);
        } 
    })
}
let deleteRoom=()=>
{
     if(req.body.roomName) {

        RoomModel.remove({ roomName: req.body.roomName }, (err, roomDetails) => {
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
                logger.info("Chat Room deleted", "chatRoomController: deleteChatRoom()", 10);
                let apiResponse = response.generate(false, "Chat Room deleted", 200, roomDetails);
                resolve(apiResponse);
            }
        });
    }
    else{
      
        let apiResponse = response.generate("true", " Id not found", 500, null);
        reject(apiResponse);
    }}
    findRoom(req, res)
    .then(checkAdmin)
    .then(deleteRoom)
    .then((roomDetails) => {
        let apiResponse = response.generate(false, 'Room deleted Successfully.', 200, roomDetails)
        res.send(apiResponse)
    })
    .catch((err) => {
        console.log(err);
        res.send(err)
    });

}
let editChatRoom = (req, res) => {

    let findRoom = () => {
        return new Promise((resolve, reject) => {
            RoomModel.findOne({ roomName: req.body.roomName }, (err, roomDetails) => {
                if (err) {
                    logger.error('Failed to find rooms', "roomController: getSingleRoom", 10);
                    let apiResponse = response.generate(true, "failed to find the Room", 500, null);
                    reject(apiResponse);
                }
                else if (check.isEmpty(roomDetails)) {
                    logger.info("No Room Found", "roomController: getSingleRoom", 10);
                    let apiResponse = response.generate(true, "No Room Found", 404, null);
                    reject(apiResponse);
                }
                else {
                    logger.info("Room found", "roomController: getSingleRoom", 10);
                    let apiResponse = response.generate(false, "Group found", 200, roomDetails);
                    resolve(apiResponse);
                }
            });
    });
    }//end findRoom


let editRoom = () => {
    return new Promise((resolve, reject) => {
  
    
        RoomModel.update({ roomName: req.body.NewRoomName },(err, roomDetails) => {
            if (err) {
                logger.error(err.message, "roomController:editChatRoom()", 10);
                let apiResponse = response.generate(true, "Failed to edit chat room", 500, null);
                reject(apiResponse);
            }
            else if (check.isEmpty(roomDetails)) {
                logger.info('No chat room found', "roomController:editChatRoom()", 10);
                let apiResponse = response.generate(true, "No chat room found", 404, null);
                reject(apiResponse);
            }
            else {
                logger.info("Chat Room edited Successfully", "roomController: editChatRoom()", 10);
                let apiResponse = response.generate(false, "Chat Room edited successfully", 200, roomDetails);
                resolve(apiResponse);
            }
        });//end room
    });
    }//end editRoom

    findRoom(req, res)
    .then(editRoom)
    .then((roomDetails) => {
        let apiResponse = response.generate(false, 'Room edited Successfully.', 200, roomDetails)
        res.send(apiResponse)
    })
    .catch((err) => {
        console.log(err);
        res.send(err)
    });


}
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
                    }
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
            if (check.isEmpty(req.body.userId)) {
                logger.error("userEmail is missing", "chatRoomController: sendInvite", 10);
                let apiResponse = response.generate(true, "userEmail is missing", 500, null);
                reject(apiResponse);
            }
            else {

                UserModel.findOne({ userId:req.body.userId }, (err, userDetails) => {
                    /* handle the error if the user is not found */
                    if (err) {
                        logger.error('Failed to retrieve user Data', "userController: findUser()", 10);
                        let apiResponse = response.generate(true, "failed to find the user with given id", 500, null);
                        reject(apiResponse);
                    }
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
            if (check.isEmpty(req.body.roomName)) {
                logger.error("chatRoomId is missing", "chatRoomController: sendInvite", 10);
                let apiResponse = response.generate(true, "chatRoomId is missing", 500, null);
                reject(apiResponse);
            }
            else {

                RoomModel.findOne({ roomName: req.body.roomName }, (err, roomDetails) => {
            /* handle the error if the user is not found */
                    if (err) {
                        logger.error('Failed to retrieve Group Data', "chatRoom: findRoom", 10);
                        let apiResponse = response.generate(true, "failed to find the Group with given chatRoomId", 500, null);
                        reject(apiResponse);
                    }
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
        if(user.name==`${details.userDetails.firstName} ${details.userDetails.lastName}`)
        {
console.log("error");
logger.error("No Group Found", "chatRoomController: findRoom", 10);
        }
        else{
            user.name = `${details.userDetails.firstName} ${details.userDetails.lastName}`;
            user.Id = details.userDetails.userId;
            
            details.roomDetails.members.push(user);

            RoomModel.update({ roomName: req.body.roomName }, { members: details.roomDetails.members }, { multi: true }, (err, result) => {
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
           }   });//end promise
    }//end saveRoom
    let saveUser = (details) => {

        return new Promise((resolve, reject) => {
            details.userDetails.groups.push(req.body.roomName);

            UserModel.update({ userId: req.body.userId }, { groups: details.userDetails.groups }, { multi: true }, (err, result) => {
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
   getChatRooms:getChatRooms,
   joinChatRoom:joinChatRoom
}