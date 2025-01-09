"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMessageController = exports.uploadImageController = exports.createMessage = exports.getMessageUerInfo = exports.getMessages = void 0;
const Message_1 = require("../models/Message");
const messageService_1 = require("../services/messageService");
//모든 메세지 불러오기
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Messages = yield Message_1.Message.findAll();
    res.json(Messages);
});
exports.getMessages = getMessages;
//메세지에서 유저 정보를 불러오기
const getMessageUerInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roomId = parseInt(req.query.roomId);
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const offset = (page - 1) * limit;
        console.log("roomId:---------------------", roomId);
        console.log("page:---------------------", page);
        console.log("limit:---------------------", limit);
        console.log("offset:---------------------", offset);
        const result = yield (0, messageService_1.getMessageByroomUserInfo)(roomId, limit, offset);
        res.status(200).json(result);
    }
    catch (error) {
        console.error("멤버쉽 유저 정보 가져오기 오류:", error);
        res.status(500).json({ error: "멤버쉽 유저 정보 가져오기 오류." });
    }
});
exports.getMessageUerInfo = getMessageUerInfo;
//메세지 보낼때 
const createMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { room_id, user_id, message_content } = req.body;
        const newMessage = yield Message_1.Message.create({
            room_id: room_id,
            user_id: user_id,
            message_content: message_content,
        });
        res.status(201).json({ success: true, data: newMessage });
    }
    catch (err) {
        console.log('err by create Message', err);
        res.status(500).json({ success: false, message: 'failed to Message room' });
    }
});
exports.createMessage = createMessage;
const uploadImageController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file = req.file;
        if (!file) {
            res.status(400).send('No file uploaded.');
        }
        if (file) {
            const url = yield (0, messageService_1.uploadImage)(file);
            res.status(200).json({ url });
        }
    }
    catch (err) {
        console.error('Error uploading file:', err);
        res.status(500).send('Error uploading file.');
    }
});
exports.uploadImageController = uploadImageController;
const deleteMessageController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, key } = req.body;
        yield (0, messageService_1.deleteMessage)(id, key);
        res.status(200).json({ success: true });
    }
    catch (err) {
        console.error('Error deleting message:', err);
        res.status(500).send('Error deleting message.');
    }
});
exports.deleteMessageController = deleteMessageController;
