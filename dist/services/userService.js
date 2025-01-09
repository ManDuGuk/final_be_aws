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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByInfluencerId = exports.getAllUsersWithInfluencerInfo = exports.findFollowingsByUser = exports.updateUser = exports.getUserById = void 0;
const user_1 = require("../models/user");
const influencer_1 = require("../models/influencer");
const database_1 = require("../util/database");
const membershipProduct_1 = require("../models/membershipProduct");
// 사용자 ID로 사용자 정보 조회
const getUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.User.findOne({
            where: { id: userId },
            include: [
                {
                    model: influencer_1.Influencer,
                    attributes: ["id", "follower", "banner_picture", "category"],
                },
            ],
            attributes: ["id", "username", "email", "about_me", "profile_picture"],
            raw: true,
            nest: true,
        });
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
    catch (error) {
        console.error("Error fetching user by ID:", error);
        throw new Error("Error fetching user");
    }
});
exports.getUserById = getUserById;
// 사용자 정보 업데이트
const updateUser = (userId, updates) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { influencer, profile_picture } = updates, userUpdates = __rest(updates, ["influencer", "profile_picture"]);
        const [affectedRows] = yield user_1.User.update(Object.assign(Object.assign({}, userUpdates), { profile_picture }), {
            where: { id: userId },
        });
        if (affectedRows === 0) {
            throw new Error("User not found");
        }
        if (influencer) {
            if (influencer.follower) {
                influencer.follower = JSON.stringify(influencer.follower);
            }
            const influencerInstance = yield influencer_1.Influencer.findOne({
                where: { user_id: userId },
            });
            if (influencerInstance) {
                yield influencerInstance.update(Object.assign(Object.assign({}, influencer), { category: influencer.category, banner_picture: influencer.banner_picture })); // 기존 인플루언서 정보 업데이트
            }
            // else {
            //   const user = await User.findByPk(userId);
            //   await Influencer.create({
            //     user_id: userId,
            //     ...influencer,
            //   }); // 새로운 인플루언서 정보 생성
            // }
        }
        const updatedUser = yield user_1.User.findOne({
            where: { id: userId },
            include: [
                {
                    model: influencer_1.Influencer,
                    attributes: [
                        "id",
                        "user_id",
                        "category",
                        "banner_picture",
                        "follower",
                    ],
                },
            ],
        });
        return updatedUser;
    }
    catch (error) {
        console.error("Error updating user:", error);
        throw new Error("Error updating user");
    }
});
exports.updateUser = updateUser;
// 사용자가 팔로우한 인플루언서 조회
const findFollowingsByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const follows = yield influencer_1.Influencer.findAll({
            where: database_1.sequelize.literal(`JSON_CONTAINS(follower, '"${userId}"')`),
            attributes: ["id", "user_id", "follower", "category"],
            include: [
                {
                    model: user_1.User,
                    attributes: ["username", "about_me", "profile_picture"], // 필요한 User 속성만 포함
                },
            ],
            raw: true,
            nest: true, // 중첩된 결과를 객체로 반환
        });
        // console.log("follows with user info: ", follows);
        return follows.length > 0 ? follows : [];
    }
    catch (error) {
        console.error("Error fetching followers by user:", error);
        throw new Error("Error fetching followers by user");
    }
});
exports.findFollowingsByUser = findFollowingsByUser;
// 모든 유저 정보 조회
const getAllUsersWithInfluencerInfo = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_1.User.findAll({
            attributes: [
                "id",
                "username",
                "email",
                "about_me",
                "profile_picture",
                "created_at",
            ],
            include: [
                {
                    model: influencer_1.Influencer,
                    attributes: ["id", "category", "banner_picture", "follower"],
                    include: [
                        {
                            model: membershipProduct_1.MembershipProduct,
                            as: "products", // Alias 명시
                            attributes: [
                                "id",
                                "level",
                                "name",
                                "image",
                                "price",
                                "benefits",
                                "is_active",
                            ],
                        },
                    ],
                },
            ],
        });
        // 팔로워 수 및 멤버십 상품 정보 추가
        return users.map((user) => {
            var _a;
            const influencer = user.Influencer
                ? {
                    id: user.Influencer.id,
                    category: user.Influencer.category,
                    banner_picture: user.Influencer.banner_picture,
                    follower_count: JSON.parse(user.Influencer.follower || "[]").length,
                    products: ((_a = user.Influencer.products) === null || _a === void 0 ? void 0 : _a.map((product) => ({
                        id: product.id,
                        level: product.level,
                        name: product.name,
                        image: product.image,
                        price: product.price,
                        benefits: product.benefits,
                        is_active: !!product.is_active,
                    }))) || [],
                }
                : null;
            return {
                id: user.id,
                username: user.username,
                email: user.email,
                about_me: user.about_me,
                profile_picture: user.profile_picture,
                created_at: user.created_at,
                is_influencer: !!influencer,
                influencer,
            };
        });
    }
    catch (error) {
        console.error("Error fetching users with influencer info:", error);
        throw new Error("Error fetching users.");
    }
});
exports.getAllUsersWithInfluencerInfo = getAllUsersWithInfluencerInfo;
// 인플루언서 ID로 사용자 정보 조회
const getUserByInfluencerId = (influencerId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const influencer = yield influencer_1.Influencer.findOne({
            where: { id: influencerId },
            include: [
                {
                    model: user_1.User,
                    attributes: ["id", "username", "email", "about_me", "profile_picture"],
                },
            ],
        });
        if (!influencer) {
            throw new Error("Influencer not found");
        }
        return influencer.get('User');
    }
    catch (error) {
        console.error("Error fetching user by influencer ID:", error);
        throw new Error("Error fetching user");
    }
});
exports.getUserByInfluencerId = getUserByInfluencerId;
