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
exports.getPendingApplicationByUserId = exports.rejectInfluencerApplication = exports.approveInfluencerApplication = exports.getInfluencerApplications = exports.createInfluencerApplication = exports.getInfluencerByuserId = exports.deleteInfluencer = exports.createInfluencer = exports.getFollowers = exports.toggleFollow = exports.getAllInfluencers = exports.getInfluencerById = void 0;
const influencer_1 = require("../models/influencer");
const influencerApplication_1 = require("../models/influencerApplication");
const user_1 = require("../models/user");
const membershipProduct_1 = require("../models/membershipProduct");
const room_1 = require("../models/room");
// 인플루언서 정보 가져오기
const getInfluencerById = (influencerId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const influencers = yield influencer_1.Influencer.findOne({
            where: { id: influencerId },
            include: [
                {
                    model: user_1.User,
                    attributes: [
                        "id",
                        "username",
                        "email",
                        "about_me",
                        "profile_picture",
                    ], // 필요한 사용자 정보만 가져오기
                },
            ],
            attributes: ["id", "follower", "banner_picture", "category"], // 필요한 인플루언서 정보만 가져오기
            raw: true,
            nest: true, // 중첩된 결과를 객체 형태로 반환
        });
        // console.log(influencers);
        if (!influencers) {
            throw new Error("No influencer found");
        }
        return influencers;
    }
    catch (error) {
        console.error("Error fetching influencer:", error);
        throw new Error("Error fetching influencer");
    }
});
exports.getInfluencerById = getInfluencerById;
// 모든 인플루언서 정보 가져오기
const getAllInfluencers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const influencers = yield influencer_1.Influencer.findAll({
            include: [
                {
                    model: user_1.User,
                    attributes: [
                        "id",
                        "username",
                        "email",
                        "about_me",
                        "profile_picture",
                    ], // 필요한 사용자 정보만 가져오기
                },
            ],
            attributes: ["id", "follower", "banner_picture", "category"], // 필요한 인플루언서 정보만 가져오기
            raw: true,
            nest: true, // 중첩된 결과를 객체 형태로 반환
        });
        // console.log(influencers);
        if (influencers.length === 0) {
            throw new Error("No influencers found");
        }
        return influencers;
    }
    catch (error) {
        console.error("Error fetching influencers:", error);
        throw new Error("Error fetching influencers");
    }
});
exports.getAllInfluencers = getAllInfluencers;
// 인플루언서 팔로우 토글
const toggleFollow = (userId, influencerId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 인플루언서 찾기
        const influencer = yield influencer_1.Influencer.findOne({
            where: { id: influencerId },
        });
        if (!influencer) {
            throw new Error("Influencer not found");
        }
        // 팔로워 목록 파싱
        let followers = [];
        try {
            const followerData = influencer.get("follower"); // 속성 가져오기
            followers = JSON.parse(followerData || "[]");
        }
        catch (error) {
            console.error("Error parsing followers:", error);
        }
        const userIdStr = userId.toString();
        const index = followers.indexOf(userIdStr);
        if (index === -1) {
            // 팔로우 추가
            followers.push(userIdStr);
        }
        else {
            // 팔로우 취소
            followers.splice(index, 1);
        }
        // `set` 메서드로 'follower' 속성 설정
        influencer.set("follower", JSON.stringify(followers));
        yield influencer.save();
        return index === -1; // `true`면 팔로우, `false`면 언팔로우
    }
    catch (error) {
        console.error("Error toggling follow:", error);
        throw new Error("Error toggling follow");
    }
});
exports.toggleFollow = toggleFollow;
const getFollowers = (influencerId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 인플루언서 찾기
        const influencer = yield influencer_1.Influencer.findOne({
            where: { id: influencerId },
        });
        if (!influencer) {
            throw new Error("Influencer not found");
        }
        // 팔로워 목록 가져오기
        const followerData = influencer.get("follower");
        const followers = JSON.parse(followerData || "[]");
        return followers.map((id) => parseInt(id, 10)); // 숫자 배열로 반환
    }
    catch (error) {
        console.error("Error fetching followers:", error);
        throw new Error("Error fetching followers");
    }
});
exports.getFollowers = getFollowers;
// 인플루언서 생성
const createInfluencer = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newInfluencer = yield influencer_1.Influencer.create(data);
        return newInfluencer;
    }
    catch (error) {
        console.error("Error creating influencer:", error);
        throw new Error("Error creating influencer");
    }
});
exports.createInfluencer = createInfluencer;
// 인플루언서 삭제
const deleteInfluencer = (influencerId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const influencer = yield influencer_1.Influencer.findOne({
            where: { id: influencerId },
        });
        if (!influencer) {
            throw new Error("Influencer not found");
        }
        // 멤버십 제품 삭제
        yield membershipProduct_1.MembershipProduct.destroy({
            where: { influencer_id: influencerId },
        });
        // 채팅방 삭제
        yield room_1.Room.destroy({
            where: { influencer_id: influencerId },
        });
        yield influencer.destroy();
        return influencer;
    }
    catch (error) {
        console.error("Error deleting influencer:", error);
        throw new Error("Error deleting influencer");
    }
});
exports.deleteInfluencer = deleteInfluencer;
//user_id로 인플정보 --윤호
const getInfluencerByuserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const influencers = yield influencer_1.Influencer.findOne({
            where: { user_id: userId },
            include: [
                {
                    model: user_1.User,
                    attributes: [
                        "id",
                        "username",
                        "email",
                        "about_me",
                        "profile_picture",
                    ], // 필요한 사용자 정보만 가져오기
                },
            ],
            attributes: ["id", "follower", "banner_picture", "category"], // 필요한 인플루언서 정보만 가져오기
        });
        if (!influencers) {
            throw new Error("No influencer found");
        }
        return influencers;
    }
    catch (error) {
        console.error("Error fetching influencer:", error);
        throw new Error("Error fetching influencer");
    }
});
exports.getInfluencerByuserId = getInfluencerByuserId;
const createInfluencerApplication = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingApplication = yield influencerApplication_1.InfluencerApplication.findOne({
            where: { user_id: data.user_id, status: "pending" },
        });
        if (existingApplication) {
            throw new Error("You already have a pending application.");
        }
        const newApplication = yield influencerApplication_1.InfluencerApplication.create({
            user_id: data.user_id,
            category: data.category,
            banner_picture: data.banner_picture,
        });
        return newApplication;
    }
    catch (error) {
        console.error("Error creating influencer application:", error);
        throw new Error("Error creating influencer application");
    }
});
exports.createInfluencerApplication = createInfluencerApplication;
const getInfluencerApplications = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const applications = yield influencerApplication_1.InfluencerApplication.findAll({
            include: [
                {
                    model: user_1.User,
                    attributes: ["id", "username", "email"],
                },
            ],
        });
        return applications;
    }
    catch (error) {
        console.error("Error fetching influencer applications:", error);
        throw new Error("Error fetching influencer applications");
    }
});
exports.getInfluencerApplications = getInfluencerApplications;
const approveInfluencerApplication = (applicationId, adminId) => __awaiter(void 0, void 0, void 0, function* () {
    const application = yield influencerApplication_1.InfluencerApplication.findOne({
        where: { id: applicationId, status: "pending" },
    });
    if (!application) {
        throw new Error("Application not found or already processed.");
    }
    // 승인 처리
    application.status = "approved";
    application.reviewed_at = new Date();
    application.reviewed_by = adminId;
    yield application.save();
    // 인플루언서 등록
    const influencer = yield influencer_1.Influencer.create({
        user_id: application.user_id,
        banner_picture: application.banner_picture,
        category: application.category,
        follower: JSON.stringify([]), // 빈 팔로워 리스트로 시작
    });
    // 채팅방 생성
    yield room_1.Room.create({
        room_name: `${application.user_id}의 채팅방`,
        influencer_id: influencer.id,
        visibility_level: 1,
    });
    // 기본 멤버십 제품 생성
    const defaultProducts = [
        {
            level: 1,
            name: "레벨 1 멤버십",
            price: 0, // 무료 멤버십
            benefits: "기본 혜택",
            is_active: 0,
            influencer_id: influencer.id,
        },
        {
            level: 2,
            name: "레벨 2 멤버십",
            price: 5000, // 예: 5,000원
            benefits: "추가 혜택",
            is_active: 0,
            influencer_id: influencer.id,
        },
        {
            level: 3,
            name: "레벨 3 멤버십",
            price: 10000, // 예: 10,000원
            benefits: "최고 혜택",
            is_active: 0,
            influencer_id: influencer.id,
        },
    ];
    yield membershipProduct_1.MembershipProduct.bulkCreate(defaultProducts);
    return influencer; // 성공적으로 생성된 인플루언서 정보 반환
});
exports.approveInfluencerApplication = approveInfluencerApplication;
const rejectInfluencerApplication = (applicationId, adminId, reason) => __awaiter(void 0, void 0, void 0, function* () {
    const application = yield influencerApplication_1.InfluencerApplication.findOne({
        where: { id: applicationId, status: "pending" },
    });
    if (!application) {
        throw new Error("Application not found or already processed.");
    }
    // 반려 처리
    application.status = "rejected";
    application.reason = reason;
    application.reviewed_at = new Date();
    application.reviewed_by = adminId;
    yield application.save();
});
exports.rejectInfluencerApplication = rejectInfluencerApplication;
const getPendingApplicationByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const application = yield influencerApplication_1.InfluencerApplication.findOne({
            where: { user_id: userId, status: "pending" },
        });
        return !!application; // true if a pending application exists
    }
    catch (error) {
        console.error("Error fetching pending application:", error);
        throw new Error("Error fetching pending application");
    }
});
exports.getPendingApplicationByUserId = getPendingApplicationByUserId;
