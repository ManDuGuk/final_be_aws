"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const messageController_1 = require("../controllers/messageController");
const router = express_1.default.Router();
exports.router = router;
const upload = (0, multer_1.default)();
router.get('/', messageController_1.getMessages);
router.get('/room', messageController_1.getMessageUerInfo);
router.post('/', messageController_1.createMessage);
router.post('/upload', upload.single('file'), messageController_1.uploadImageController);
router.post('/delete', messageController_1.deleteMessageController);
