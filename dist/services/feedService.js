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
exports.findFeedsByUser = exports.findFeedsLikedByUser = exports.getFeedById = exports.saveFeedToDB = void 0;
const user_1 = require("../models/user");
const feed_1 = require("../models/feed"); // Feed 모델 임포트
const database_1 = require("../util/database");
const influencer_1 = require("../models/influencer");
const saveFeedToDB = (feedData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 새 피드 정보 DB에 저장
        const feed = yield feed_1.Feed.create({
            influencer_id: feedData.influencer_id, // influencer_id 매핑
            content: feedData.description, // content 필드 매핑
            images: JSON.stringify(feedData.images), // JSON으로 변환
            // username: feedData.nickname,
            // JSON.stringify를 사용해서 문자열로 변환
            products: JSON.stringify(feedData.product),
            visibility_level: Number(feedData.visibility_level), // 가시성 수준
            likes: '', // 기본값 빈 배열로 설정
        });
        return feed;
    }
    catch (error) {
        console.error('Error saving feed to DB:', error);
        throw new Error('Error saving feed to DB');
    }
});
exports.saveFeedToDB = saveFeedToDB;
// 특정 ID의 피드 가져오기
const getFeedById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const feed = yield feed_1.Feed.findOne({
            where: { id },
            attributes: [
                'id',
                'influencer_id',
                'content',
                'images',
                'products',
                'visibility_level',
                'likes',
            ],
            include: [
                {
                    model: influencer_1.Influencer,
                    as: 'influencer', // 관계 이름
                    include: [
                        {
                            model: user_1.User,
                            as: 'user', // 관계 이름
                            attributes: ['username', 'profile_picture'], // User 테이블에서 username만 가져오기
                        },
                    ],
                },
            ],
        });
        if (!feed) {
            throw new Error('Feed not found');
        }
        // 모델 데이터를 일반 객체로 변환
        const parsedFeed = feed.toJSON();
        // console.log(parsedFeed, 'parsedFeedparsedFeedparsedFeed');
        const result = Object.assign(Object.assign({}, parsedFeed), { influencer: (_b = (_a = parsedFeed === null || parsedFeed === void 0 ? void 0 : parsedFeed.influencer) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.username, influencerImg: (_d = (_c = parsedFeed === null || parsedFeed === void 0 ? void 0 : parsedFeed.influencer) === null || _c === void 0 ? void 0 : _c.user) === null || _d === void 0 ? void 0 : _d.profile_picture });
        return result;
    }
    catch (error) {
        console.error('Error fetching feed by ID:', error);
        throw new Error('Error fetching feed by ID');
    }
});
exports.getFeedById = getFeedById;
const findFeedsLikedByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const feeds = yield feed_1.Feed.findAll({
            where: database_1.sequelize.literal(`JSON_CONTAINS(likes, '"${userId}"')`), // 정확한 JSON 배열 검사
            attributes: ['id', 'content', 'images', 'products', 'likes'],
        });
        return feeds;
    }
    catch (error) {
        console.error('Error fetching feeds liked by user:', error);
        throw new Error('Error fetching feeds liked by user');
    }
});
exports.findFeedsLikedByUser = findFeedsLikedByUser;
const findFeedsByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const influencerId = (_a = (yield influencer_1.Influencer.findOne({
            where: { user_id: userId },
            attributes: ['id'],
        }))) === null || _a === void 0 ? void 0 : _a.dataValues.id;
        console.log(influencerId);
        const feeds = yield feed_1.Feed.findAll({
            where: { influencer_id: influencerId },
            attributes: ['id', 'content', 'images', 'products', 'likes'],
        });
        return feeds;
    }
    catch (error) {
        console.error('Error fetching feeds liked by user:', error);
        throw new Error('Error fetching feeds liked by user');
    }
});
exports.findFeedsByUser = findFeedsByUser;
