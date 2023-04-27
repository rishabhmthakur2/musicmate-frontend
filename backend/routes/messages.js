var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");

const Message = require("../models/message");

/**
 * @swagger
 * /messages/{id}:
 *  get:
 *    tags:
 *      - messages
 *    description: Get messages for a user
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      '200':
 *        description: list of messages for a user
 */
router.get("/:id", async (request, response) => {
  var tempid = request.params.id;

  if (tempid.length != 24) {
    response.status(400).send("Please send a valid id of 24 characters");
  } else {
    try {
      const output = await Message.find({ sender_id: request.params.id });
      try {
        response.status(200).send(output);
      } catch (error) {
        response.status(500).send(error);
      }
      ß;
    } catch (error) {
      response.status(500).send(error);
    }
  }
});

/**
 * @swagger
 * /messages/{sender_id}/{receiver_id}:
 *  get:
 *    tags:
 *      - messages
 *    description: Get messages between two users
 *    parameters:
 *      - name: sender_id
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *      - name: receiver_id
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      '200':
 *        description: list of messages between two users
 */
router.get("/:sender_id/:receiver_id", async (request, response) => {
  try {
    const output = await Message.find({
      sender_id: request.params.sender_id,
      receiver_id: request.params.receiver_id,
    });
    try {
      response.status(200).send(output);
    } catch (error) {
      response.status(500).send(error);
    }
  } catch (error) {
    response.status(500).send(error);
  }
});

/**
 * @swagger
 * /messages/chatlist/{id}:
 *  get:
 *    tags:
 *      - messages
 *    description: Get all users the given user is talking to
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      '200':
 *        description: list of users that the user is talking to
 */
router.get("/chatlist/:id", async (request, response) => {
  var tempid = request.params.id;

  if (tempid.length != 24) {
    response.status(400).send("Please send a valid id of 24 characters");
  } else {
    try {
      const result = await Message.distinct("receiver_id", {
        sender_id: tempid,
      });
      console.log(result);
      try {
        response.status(200).send(result);
      } catch (error) {
        response.status(500).send(error);
      }
    } catch (error) {
      response.status(500).send(error);
    }
  }
});

/**
 * @swagger
 * /messages:
 *  post:
 *    tags:
 *      - messages
 *    description: Create a new message
 *    responses:
 *      '200':
 *        description: success message for successful creation
 */
router.post("/", (req, res, next) => {
  const msg = new Message({
    _id: new mongoose.Types.ObjectId(),
    sender_id: req.body.senderId,
    receiver_id: req.body.receiverId,
    message_content: req.body.messageContent,
  });

  msg.save().then;

  res.status(200).json({
    message: "Handling GET request on /",
    createdMessage: msg,
  });
});

module.exports = router;
