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
exports.getFollowingFeeds = exports.getMembershipFromUserId = exports.getMembershipProductsFromInfluencerId = exports.getUserMembershipLevel = exports.getMembershipProduct = exports.postUsernameByUserId = exports.postUserIdByInfluencerId = exports.postInfluencerUsernameInfo = exports.patchFeedLikes = exports.patchUserFollow = exports.postFeedDatatoInfluencerData = exports.getFeeds = exports.getFeedsQueue = exports.postCurrentLoggedInUserInfo = void 0;
const multer_1 = __importDefault(require("multer"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_1 = require("../../models/user");
const feed_1 = require("../../models/feed");
const influencer_1 = require("../../models/influencer");
const membershipProduct_1 = require("../../models/membershipProduct");
const membership_1 = require("../../models/membership");
const sequelize_1 = require("sequelize");
const lodash_1 = __importDefault(require("lodash"));
dotenv_1.default.config();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage }).fields([
    { name: 'productImgs', maxCount: 5 },
    { name: 'postImages', maxCount: 5 },
]);
const postCurrentLoggedInUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //user의 id를 통해 post 조회할 예정
        const { id } = req.body;
        const user = yield user_1.User.findOne({
            where: { id },
            raw: true, // 순수 데이터 객체 반환
        }); // 반환 타입 명시
        const influencer = yield influencer_1.Influencer.findOne({
            where: { user_id: id },
            raw: true, // 순수 데이터 객체 반환
        }); // 반환 타입 명시
        if (!user) {
            res.status(404).json({
                message: '현재 홈 화면에서 유효한 user 정보를 DB에서 찾는 것에 실패했습니다.',
                status: 404,
            });
        }
        res.status(200).json(Object.assign(Object.assign({}, user), { influencerId: influencer === null || influencer === void 0 ? void 0 : influencer.id })); // 응답 후 user 반환
    }
    catch (error) {
        console.error('FeedGet Error:', error);
        res.status(500).json({
            message: "로그인 정보를 가져오는데 문제가 생겼습니다. FeedGet Error.",
            status: 500,
            error: error,
        });
    }
});
exports.postCurrentLoggedInUserInfo = postCurrentLoggedInUserInfo;
const getFeedsQueue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userFollowList = req.body.userFollowList || [];
        const userId = req.body.userId;
        // console.log("userFollowList:", userFollowList);
        // console.log("userId:", userId);
        let influencerIds = [];
        if (userId) {
            const userMemberships = yield membership_1.Membership.findAll({
                where: { user_id: userId, status: 'active' },
                raw: true,
                attributes: ['product_id'],
            });
            const productIds = userMemberships.map((membership) => membership.product_id);
            const influencerProducts = yield membershipProduct_1.MembershipProduct.findAll({
                where: { id: { [sequelize_1.Op.in]: productIds }, is_active: 1 },
                raw: true,
                attributes: ['influencer_id'],
            });
            influencerIds = influencerProducts.map((id) => id.influencer_id);
        }
        const feeds = yield feed_1.Feed.findAll({
            limit: 300,
            where: {
                [sequelize_1.Op.or]: [
                    { visibility_level: 1 },
                    {
                        visibility_level: 2,
                        influencer_id: { [sequelize_1.Op.in]: [...userFollowList, ...influencerIds] },
                    },
                    {
                        visibility_level: 3,
                        influencer_id: { [sequelize_1.Op.in]: influencerIds },
                    },
                ],
            },
            attributes: ['id', 'visibility_level'],
            raw: true,
        });
        // console.log("feeds:", feeds);
        const feed1Arr = lodash_1.default.shuffle(feeds.filter(feed => feed.visibility_level === 1).map(feed => feed.id));
        const feed2Arr = lodash_1.default.shuffle(feeds.filter(feed => feed.visibility_level === 2).map(feed => feed.id));
        const feed3Arr = lodash_1.default.shuffle(feeds.filter(feed => feed.visibility_level === 3).map(feed => feed.id));
        const feedIds = [...feed3Arr, ...feed2Arr, ...feed1Arr].filter((id) => id !== undefined);
        // console.log("feedIds:", feedIds);
        res.status(200).json(feedIds);
    }
    catch (error) {
        console.error('FeedGetQueue Error:', error);
        res.status(500).json({
            message: "피드를 가져오는 중 오류가 발생했습니다.",
            status: 500,
            error: error.message,
        });
    }
});
exports.getFeedsQueue = getFeedsQueue;
const getFeeds = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queue = req.body.queue;
        const limit = req.body.limit;
        const slicedQueue = queue.slice(0, limit);
        const feeds = (yield feed_1.Feed.findAll({
            where: {
                id: { [sequelize_1.Op.in]: slicedQueue }
            },
            raw: true,
        })) || [];
        res.status(200).json(feeds);
    }
    catch (error) {
        console.error('FeedGet Error:', error);
        res.status(500).json({
            message: "피드를 가져오는 중 오류가 발생했습니다.",
            status: 500,
            error: error.message,
        });
    }
});
exports.getFeeds = getFeeds;
const postFeedDatatoInfluencerData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //user의 id를 통해 post 조회할 예정
        const { id } = req.body;
        const influencer = yield influencer_1.Influencer.findOne({
            where: { id },
            raw: true, // 순수 데이터 객체 반환
        }); // 반환 타입 명시
        res.status(200).json(influencer); // 응답 후 user 반환
    }
    catch (error) {
        console.error('postFeedDatatoInfluencerData Error:', error);
        res.status(500).json({
            message: "로그인 정보를 가져오는데 문제가 생겼습니다.",
            status: 500,
            error: error,
        });
    }
});
exports.postFeedDatatoInfluencerData = postFeedDatatoInfluencerData;
const patchUserFollow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, influencerId, isFollowing } = req.body;
        const user = yield user_1.User.findOne({
            where: { id: userId },
        }); // 반환 타입 명시
        if (!user) {
            res.status(404).json({
                message: "현재 로그인된 유저 정보와 일치하는 유효한 user 정보가 DB에 없습니다.",
                status: 404,
            });
            return;
        }
        // 기존 follow 배열 파싱 (JSON으로 저장된 경우 처리)
        let followList = user.follow || [];
        if (typeof followList === "string") {
            followList = JSON.parse(followList);
        }
        // follow 목록 수정
        if (isFollowing) {
            // 팔로우 추가
            if (!followList.includes(influencerId.toString())) {
                followList.push(influencerId.toString());
            }
        }
        else {
            // 언팔로우 제거
            followList = followList.filter((id) => id !== influencerId.toString());
        }
        // DB 업데이트
        yield user_1.User.update({ follow: followList }, // 배열을 문자열로 변환하여 저장
        { where: { id: userId } });
        res.status(200).json({
            message: `사용자 ID ${userId}의 follow 목록이 성공적으로 업데이트되었습니다.`,
            status: 200,
        });
    }
    catch (error) {
        console.error('patchUserFollow Error:', error);
        res.status(500).json({
            message: '유저의 Follow 배열의 값을 갱신하는데 문제가 생겼습니다.',
            status: 500,
            error: error,
        });
    }
});
exports.patchUserFollow = patchUserFollow;
const patchFeedLikes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { feedId } = req.params;
        const { likes } = req.body;
        // DB 업데이트
        yield feed_1.Feed.update({ likes: JSON.stringify(likes) }, // likes 배열을 JSON 문자열로 저장
        { where: { id: feedId } });
        res.status(200).json({
            message: `피드 ${feedId}의 좋아요 목록이 성공적으로 업데이트되었습니다. likes: ${likes}`,
            status: 200,
        });
    }
    catch (error) {
        console.error("서버에서 좋아요 데이터를 업데이트하는 중 오류 발생:", error);
        res.status(500).json({
            message: '서버에서 좋아요 데이터를 업데이트하는 중 오류가 발생했습니다.',
            status: 500,
            error: error,
        });
    }
});
exports.patchFeedLikes = patchFeedLikes;
const postInfluencerUsernameInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { influencerId } = req.body;
        const influencer = yield influencer_1.Influencer.findOne({
            where: { id: influencerId },
            raw: true, // 순수 데이터 객체 반환
        }); // 반환 타입 명시
        if (!influencer || !influencer.user_id) {
            res.status(404).json({
                message: "피드의 아이디를 통해 인플루언서를 찾을 수 없습니다.",
                status: 404,
            });
        }
        const user = yield user_1.User.findOne({
            where: { id: influencer === null || influencer === void 0 ? void 0 : influencer.user_id },
            raw: true, // 순수 데이터 객체 반환
        }); // 반환 타입 명시
        if (!user) {
            res.status(404).json({
                message: "피드의 아이디를 통해 인플루언서를 찾았으나 유효한 유저가 아닙니다.",
                status: 404,
            });
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.error("피드에서 인플루언서 id를 참고하여 user 테이블의 username을 가져오는 과정에서 문제가 생겼습니다: ", error);
        res.status(500).json({
            message: "피드에서 인플루언서 id를 참고하여 user 테이블의 username을 가져오는 과정에서 문제가 생겼습니다.",
            status: 500,
            error: error,
        });
    }
});
exports.postInfluencerUsernameInfo = postInfluencerUsernameInfo;
const postUserIdByInfluencerId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { influencerId } = req.body;
        const influencer = yield influencer_1.Influencer.findOne({
            where: { id: influencerId },
            raw: true, // 순수 데이터 객체 반환
        }); // 반환 타입 명시
        if (!influencer || !influencer.user_id) {
            res.status(404).json({
                message: "피드의 아이디를 통해 인플루언서를 찾을 수 없습니다",
                status: 404,
            });
        }
        res.status(200).json(influencer);
    }
    catch (error) {
        console.error("postUserIdByInfluencerId ", error);
        res.status(500).json({
            message: "postUserIdByInfluencerId",
            status: 500,
            error: error,
        });
    }
});
exports.postUserIdByInfluencerId = postUserIdByInfluencerId;
const postUsernameByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        const user = yield user_1.User.findOne({
            where: { id: userId },
            raw: true, // 순수 데이터 객체 반환
        }); // 반환 타입 명시
        if (!user) {
            res.status(404).json({
                message: "피드의 아이디를 통해 인플루언서를 찾았으나 유효한 유저가 아닙니다.",
                status: 404,
            });
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.error("postUsernameByUserId ", error);
        res.status(500).json({
            message: "postUsernameByUserId",
            status: 500,
            error: error,
        });
    }
});
exports.postUsernameByUserId = postUsernameByUserId;
const getMembershipProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const visibilityLevel = parseInt(req.query.visibilityLevel, 10);
        const influencerId = parseInt(req.query.influencerId, 10);
        // console.log(influencerId, typeof influencerId, visibilityLevel, typeof visibilityLevel);
        const membershipProduct = yield membershipProduct_1.MembershipProduct.findOne({
            where: { influencer_id: influencerId, level: visibilityLevel, is_active: 1 },
            raw: true, // 순수 데이터 객체 반환
            attributes: ['name'], // name 필드만 선택
        }); // 반환 타입 명시
        if (!membershipProduct) {
            res.status(204).json("unknown");
            return;
        }
        res.status(200).json(membershipProduct);
    }
    catch (error) {
        console.error("getMembershipProduct ", error.message);
        res.status(500).json({
            message: "getMembershipProduct",
            status: 500,
            error: error.message,
        });
    }
});
exports.getMembershipProduct = getMembershipProduct;
const getUserMembershipLevel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = parseInt(req.query.visibilityLevel, 10);
        const influencerId = parseInt(req.query.influencerId, 10);
        const product = yield membership_1.Membership.findOne({
            where: { user_id: userId, status: 'active' },
            raw: true, // 순수 데이터 객체 반환
            attributes: ['id'], // name 필드만 선택
        }); // 반환 타입 명시
        if (!product) {
            res.status(204).json({ level: 0 });
            return;
        }
        const userMembership = yield membershipProduct_1.MembershipProduct.findOne({
            where: { id: product.id, is_active: 1 },
            raw: true, // 순수 데이터 객체 반환
            attributes: ['level'], // name 필드만 선택
        }); // 반환 타입 명시
        if (!userMembership) {
            res.status(204).json({ level: 0 });
            return;
        }
        res.status(200).json({ level: userMembership.level });
    }
    catch (error) {
        console.error("getUserMembershipLevel ", error.message);
        res.status(500).json({
            message: "getUserMembershipLevel",
            status: 500,
            error: error.message,
        });
    }
});
exports.getUserMembershipLevel = getUserMembershipLevel;
const getMembershipProductsFromInfluencerId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const influencerId = parseInt(req.query.influencerId, 10);
        const influencerProducts = yield membershipProduct_1.MembershipProduct.findAll({
            where: { influencer_id: influencerId, is_active: 1 },
            raw: true, // 순수 데이터 객체 반환
            attributes: ['id'], // name 필드만 선택
        });
        // console.log(influencerProducts, "    influencerProduct");
        if (!influencerProducts || influencerProducts.length === 0) {
            res.status(204).json({
                message: "getUserMembershipLevel not found",
                status: 204,
            });
            return;
        }
        res.status(200).json(influencerProducts);
    }
    catch (error) {
        console.error("getMembershipProductsFromInfluencerId ", error.message);
        res.status(500).json({
            message: "getUserMembershipLevel",
            status: 500,
            error: error.message,
        });
    }
});
exports.getMembershipProductsFromInfluencerId = getMembershipProductsFromInfluencerId;
const getMembershipFromUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = parseInt(req.body.userId, 10);
        const userMembership = yield membership_1.Membership.findAll({
            where: { user_id: userId, status: 'active' },
            raw: true, // 순수 데이터 객체 반환
            attributes: ['product_id'], // name 필드만 선택
        });
        // console.log(userMembership, "    userMembership");
        if (!userMembership || userMembership.length === 0) {
            res.status(204).json({
                message: "getMembershipFromUserId not found",
                status: 204,
            });
            return;
        }
        res.status(200).json(userMembership);
    }
    catch (error) {
        console.error("getMembershipFromUserId ", error.message);
        res.status(500).json({
            message: "getMembershipFromUserId",
            status: 500,
            error: error.message,
        });
    }
});
exports.getMembershipFromUserId = getMembershipFromUserId;
const getFollowingFeeds = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.body.userId;
        const limit = req.body.limit;
        const queue = req.body.queue;
        if (queue.length === 0) {
            res.status(200).json([]);
            return;
        }
        // 인플루언서 중에서 userId를 팔로워로 가지고 있는 인플루언서들을 찾습니다.
        const influencers = yield influencer_1.Influencer.findAll({
            where: {
                follower: {
                    [sequelize_1.Op.like]: `%${userId}%`
                }
            },
            attributes: ['id'],
            raw: true,
        });
        const influencerIds = influencers.map(influencer => influencer.id);
        const slicedQueue = queue.slice(0, limit);
        const feeds = (yield feed_1.Feed.findAll({
            where: {
                id: { [sequelize_1.Op.in]: slicedQueue },
                influencer_id: { [sequelize_1.Op.in]: influencerIds }
            },
            raw: true,
        })) || [];
        // 큐에서 가져온 게시물 수가 limit보다 적을 경우 추가로 게시물을 가져옵니다.
        if (feeds.length < limit) {
            const additionalFeeds = (yield feed_1.Feed.findAll({
                where: {
                    id: { [sequelize_1.Op.notIn]: slicedQueue },
                    influencer_id: { [sequelize_1.Op.in]: influencerIds }
                },
                limit: limit - feeds.length,
                raw: true,
            })) || [];
            feeds.push(...additionalFeeds);
        }
        res.status(200).json(feeds);
    }
    catch (error) {
        console.error('getFollowingFeeds Error:', error);
        res.status(500).json({
            message: "팔로우 피드를 가져오는 중 오류가 발생했습니다.",
            status: 500,
            error: error.message,
        });
    }
});
exports.getFollowingFeeds = getFollowingFeeds;
