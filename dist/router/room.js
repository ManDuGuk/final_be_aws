"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const roomController_1 = require("../controllers/roomController");
const router = express_1.default.Router();
exports.router = router;
router.get('/', roomController_1.getRooms); //모든 채팅룸 호출
router.post('/', roomController_1.createRoom); //채팅방 생성
router.get('/influencer/:id', roomController_1.getUserProfileByInfluencerId); //구독하고 있는 인플루언서정보 호출
router.get('/follwing/:id', roomController_1.getFollowingsByUser); //구독하고 있는 인플루언서정보 호출
