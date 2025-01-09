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
exports.getAllUsers = exports.findFollowInfluencerForUser = exports.findFeedsForUser = exports.findLikeFeedForUser = exports.updateUserProfile = exports.getUserProfile = void 0;
const userService_1 = require("../services/userService");
const feedService_1 = require("../services/feedService"); // feedService에서 함수 가져오기
const userResponse_1 = require("../util/userResponse"); // 유틸 함수 가져오기
const uplode_1 = require("../util/uplode");
// 사용자 정보 조회
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, userService_1.getUserById)(Number(req.params.id));
        const response = (0, userResponse_1.formatUserResponse)(user);
        res.status(200).json(response);
    }
    catch (error) {
        console.error("사용자 정보 가져오기 오류:", error);
        res
            .status(500)
            .json({ error: "사용자 정보를 가져오는 중 오류가 발생했습니다." });
    }
});
exports.getUserProfile = getUserProfile;
// 사용자 정보 업데이트
const updateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const files = req.files;
        let profilePictureUrl;
        let bannerPictureUrl;
        // 프로필 이미지 업로드 처리
        const profilePictureFile = (_a = files === null || files === void 0 ? void 0 : files.profile_picture) === null || _a === void 0 ? void 0 : _a[0];
        if (profilePictureFile) {
            profilePictureUrl = yield (0, uplode_1.uploadToS3)(profilePictureFile);
        }
        // 배너 이미지 업로드 처리
        const bannerPictureFile = (_b = files === null || files === void 0 ? void 0 : files.banner_picture) === null || _b === void 0 ? void 0 : _b[0];
        if (bannerPictureFile) {
            bannerPictureUrl = yield (0, uplode_1.uploadToS3)(bannerPictureFile);
            console.log("Uploaded banner picture URL:", bannerPictureUrl);
        }
        // 기존 프로필 이미지 삭제
        if (req.body.existingProfilePicture &&
            req.body.isNewProfilePicture === "true") {
            const oldKey = req.body.existingProfilePicture.split("/").pop(); // 기존 파일의 키 추출
            if (oldKey) {
                console.log("Deleting existing profile picture:", oldKey);
                yield (0, uplode_1.deleteFromS3)(oldKey);
            }
        }
        // 기존 배너 이미지 삭제
        if (req.body.existingBannerPicture &&
            req.body.isNewBannerPicture === "true") {
            const oldKey = req.body.existingBannerPicture.split("/").pop(); // 기존 파일의 키 추출
            if (oldKey) {
                yield (0, uplode_1.deleteFromS3)(oldKey);
            }
        }
        let influencerData;
        if (req.body.influencer) {
            influencerData = JSON.parse(req.body.influencer);
        }
        const updatedUser = yield (0, userService_1.updateUser)(Number(req.params.id), Object.assign(Object.assign({}, req.body), { profile_picture: profilePictureUrl ||
                (req.body.isNewProfilePicture === "true"
                    ? null
                    : req.body.existingProfilePicture), influencer: Object.assign(Object.assign({}, influencerData), { banner_picture: bannerPictureUrl ||
                    (req.body.isNewBannerPicture === "true"
                        ? null
                        : req.body.existingBannerPicture) }) }));
        res.status(200).json(updatedUser);
    }
    catch (error) {
        console.error("사용자 업데이트 오류:", error);
        res
            .status(500)
            .json({ error: "사용자 정보를 업데이트하는 중 오류가 발생했습니다." });
    }
});
exports.updateUserProfile = updateUserProfile;
// 사용자가 좋아요한 피드 조회
const findLikeFeedForUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const feeds = yield (0, feedService_1.findFeedsLikedByUser)(Number(req.params.id));
        if (!feeds || feeds.length === 0) {
            res.status(200).json([]);
            return;
        }
        res.status(200).json(feeds);
    }
    catch (error) {
        console.error("사용자가 좋아요한 피드 가져오기 오류:", error);
        res.status(500).json({
            error: "사용자가 좋아요한 피드를 가져오는 중 오류가 발생했습니다.",
        });
    }
});
exports.findLikeFeedForUser = findLikeFeedForUser;
// 사용자가 작성한 피드 조회
const findFeedsForUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const feeds = yield (0, feedService_1.findFeedsByUser)(Number(req.params.id));
        if (!feeds || feeds.length === 0) {
            res
                .status(404)
                .json({ error: "사용자가 작성한 피드를 찾을 수 없습니다." });
            return;
        }
        res.status(200).json(feeds);
    }
    catch (error) {
        console.error("사용자가 작성한 피드 가져오기 오류:", error);
        res.status(500).json({
            error: "사용자가 작성한 피드를 가져오는 중 오류가 발생했습니다.",
        });
    }
});
exports.findFeedsForUser = findFeedsForUser;
// 사용자가 팔로우한 인플루언서 조회
const findFollowInfluencerForUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const followings = yield (0, userService_1.findFollowingsByUser)(Number(req.params.id));
        if (!followings || followings.length === 0) {
            res.status(200).json([]);
            return;
        }
        res.status(200).json(followings);
    }
    catch (error) {
        console.error("사용자가 좋아요한 피드 가져오기 오류:", error);
        res.status(500).json({
            error: "사용자가 좋아요한 피드를 가져오는 중 오류가 발생했습니다.",
        });
    }
});
exports.findFollowInfluencerForUser = findFollowInfluencerForUser;
// 모든 사용자 정보 조회
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield (0, userService_1.getAllUsersWithInfluencerInfo)();
        res.status(200).json(users);
    }
    catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to fetch users." });
    }
});
exports.getAllUsers = getAllUsers;
