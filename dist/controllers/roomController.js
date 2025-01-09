"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function () { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function (o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function (o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.createRoom = exports.getFollowingsByUser = exports.getUserProfileByInfluencerId = exports.getRooms = void 0;
const roomService = __importStar(require("../services/roomService"));
const Room_1 = require("../models/room");
const userService_1 = require("../services/userService");
// 모든 채팅방 불러오기
const getRooms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rooms = yield Room_1.Room.findAll();
    res.json(rooms);
});
exports.getRooms = getRooms;
//구독하고 있는 인플루언서 
const getUserProfileByInfluencerId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const influencer = yield roomService.getInfluencerDetails(Number(req.params.id));
        res.status(200).json(influencer);
    }
    catch (error) {
        console.error("사용자 정보 가져오기 오류:", error);
        res.status(500).json({ error: "사용자 정보를 가져오는 중 오류가 발생했습니다." });
    }
});
exports.getUserProfileByInfluencerId = getUserProfileByInfluencerId;
//팔로우 하고 있는 인플루언서
const getFollowingsByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const follwings = yield (0, userService_1.findFollowingsByUser)(Number(req.params.id));
        if (!follwings || follwings.length == 0) {
            res.status(200).json([]);
            return;
        }
        res.status(200).json(follwings);
    }
    catch (error) {
        console.log("팔로우한 인플루언서 가져오기 오류", error);
        res.status(500).json({
            error: "팔로우한 인플루언서 가져오는 중 오류가 발생했습니다.",
        });
    }
});
exports.getFollowingsByUser = getFollowingsByUser;
// 인플루언서 채팅방 생성
const createRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { roomName, influencerId, visibilityLevel } = req.body;
        const newRoom = yield Room_1.Room.create({
            room_name: roomName,
            influencer_id: influencerId,
            visibility_level: visibilityLevel || 1,
        });
        res.status(201).json({ sucess: true, data: newRoom });
    }
    catch (err) {
        console.log('err by create room', err);
        res.status(500).json({ success: false, message: 'failed to create room' });
    }
});
exports.createRoom = createRoom;
