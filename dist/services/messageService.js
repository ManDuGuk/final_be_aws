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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMessage = exports.uploadImage = exports.getMessageByroomUserInfo = void 0;
const Message_1 = require("../models/Message");
const database_1 = __importDefault(require("../util/database"));
const sequelize_1 = require("sequelize");
const uplode_1 = require("../util/uplode");
const getMessageByroomUserInfo = (roomId, limit, offset) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = `
            SELECT 
                m.id AS message_id,
                m.room_id,
                m.user_id,
                m.message_content,
                m.created_at,
                u.username,
                u.profile_picture,
                i.id as influencer_id,
                i.follower,
                i.banner_picture,
                i.category
            FROM 
                Message m
            INNER JOIN 
                User u
            ON 
                m.user_id = u.id
            LEFT JOIN 
                Influencer i
            ON 
                u.id = i.user_id
            WHERE 
                m.room_id = :roomId
            ORDER BY 
                m.created_at DESC
            LIMIT :limit OFFSET :offset;
        `;
        const messages = yield database_1.default.query(query, {
            type: sequelize_1.QueryTypes.SELECT,
            replacements: {
                roomId,
                limit,
                offset,
            },
        });
        return messages.reverse();
    }
    catch (error) {
        console.error('메세지 관련 유저 정보 디비 불러오기 실패:', error);
        throw new Error("메세지 관련 유저 정보 디비 불러오기 실패");
    }
});
exports.getMessageByroomUserInfo = getMessageByroomUserInfo;
const uploadImage = (file) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const url = yield (0, uplode_1.uploadToS3)(file);
        return url;
    }
    catch (error) {
        console.error('이미지 업로드 실패:', error);
        throw new Error("이미지 업로드 실패");
    }
});
exports.uploadImage = uploadImage;
const deleteMessage = (id, key) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield database_1.default.transaction();
    try {
        yield Message_1.Message.destroy({ where: { id }, transaction });
        yield (0, uplode_1.deleteFromS3)(key);
        yield transaction.commit();
    }
    catch (error) {
        yield transaction.rollback();
        console.error('메시지 삭제 실패:', error);
        throw new Error("메시지 삭제 실패");
    }
});
exports.deleteMessage = deleteMessage;
