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
exports.checkPendingApplication = exports.rejectInfluencer = exports.approveInfluencer = exports.getApplies = exports.applyInfluencer = exports.getInfluenerByuser = exports.exitInfluencer = exports.registerInfluencer = exports.followInfluencer = exports.getInfluencers = exports.getInfluencer = void 0;
const influencerService_1 = require("../services/influencerService");
const getInfluencer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const influencers = yield (0, influencerService_1.getInfluencerById)(Number(req.params.id));
        res.status(200).json(influencers);
    }
    catch (error) {
        console.error("인플루언서 가져오기 오류:", error);
        res
            .status(500)
            .json({ error: "인플루언서 정보를 가져오는 중 오류가 발생했습니다." });
    }
});
exports.getInfluencer = getInfluencer;
const getInfluencers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const influencers = yield (0, influencerService_1.getAllInfluencers)();
        res.status(200).json(influencers);
    }
    catch (error) {
        console.error("전체 인플루언서 가져오기 오류:", error);
        res
            .status(500)
            .json({
            error: "전체 인플루언서 정보를 가져오는 중 오류가 발생했습니다.",
        });
    }
});
exports.getInfluencers = getInfluencers;
const followInfluencer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, influencerId } = req.body;
    try {
        const isFollowing = yield (0, influencerService_1.toggleFollow)(userId, influencerId);
        res.status(200).json(isFollowing);
    }
    catch (error) {
        console.error("인플루언서 팔로우 처리 오류:", error);
        res
            .status(500)
            .json({ error: "인플루언서 팔로우 중 오류가 발생했습니다." });
    }
});
exports.followInfluencer = followInfluencer;
const registerInfluencer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id, follower, banner_picture, category } = req.body;
        if (!user_id || !category) {
            res.status(400).json({ error: "Missing required fields" });
        }
        const newInfluencer = yield (0, influencerService_1.createInfluencer)({
            user_id,
            follower: JSON.stringify(follower), // 배열을 JSON 문자열로 변환
            banner_picture,
            category,
        });
        res.status(201).json(newInfluencer);
    }
    catch (error) {
        console.error("Error registering influencer:", error);
        res.status(500).json({ error: "Failed to register influencer" });
    }
});
exports.registerInfluencer = registerInfluencer;
const exitInfluencer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const influencerId = Number(req.params.id);
        if (!influencerId) {
            res.status(400).json({ error: "Invalid influencer ID" });
        }
        const deletedInfluencer = yield (0, influencerService_1.deleteInfluencer)(influencerId);
        res.status(200).json(deletedInfluencer);
    }
    catch (error) {
        console.error("Error deleting influencer:", error);
        res.status(500).json({ error: "Failed to delete influencer" });
    }
});
exports.exitInfluencer = exitInfluencer;
//user_id로 인플정보 --윤호
const getInfluenerByuser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const influencers = yield (0, influencerService_1.getInfluencerByuserId)(Number(req.params.id));
        res.status(200).json(influencers);
    }
    catch (error) {
        console.error("인플루언서 가져오기 오류:", error);
        res
            .status(500)
            .json({ error: "인플루언서 정보를 가져오는 중 오류가 발생했습니다." });
    }
});
exports.getInfluenerByuser = getInfluenerByuser;
// 인플루언서 신청
const applyInfluencer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id, category, banner_picture } = req.body;
        console.log(user_id, category, banner_picture);
        if (!user_id || !category) {
            res.status(400).json({ error: "Missing required fields: user_id or category" });
            return;
        }
        // 새로운 인플루언서 신청 레코드 생성
        const application = yield (0, influencerService_1.createInfluencerApplication)({
            user_id,
            category,
            banner_picture: banner_picture || null,
        });
        res.status(201).json({
            message: "Influencer application submitted successfully.",
            application,
        });
    }
    catch (error) {
        console.error("Error applying for influencer:", error);
        res.status(500).json({ error: "Failed to apply for influencer" });
    }
});
exports.applyInfluencer = applyInfluencer;
// 모든 인플루언서 신청 목록 가져오기
const getApplies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const applications = yield (0, influencerService_1.getInfluencerApplications)();
        res.status(200).json(applications);
    }
    catch (error) {
        console.error("Error fetching influencer applications:", error);
        res.status(500).json({ error: "Failed to fetch influencer applications" });
    }
});
exports.getApplies = getApplies;
const approveInfluencer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ error: "Application ID is required" });
            return;
        }
        yield (0, influencerService_1.approveInfluencerApplication)(Number(id), 1); // req.user.id는 관리자의 ID로 가정
        res.status(200).json({ message: "Application approved successfully." });
    }
    catch (error) {
        console.error("Error approving influencer application:", error);
        res.status(500).json({ error: "Failed to approve application" });
    }
});
exports.approveInfluencer = approveInfluencer;
const rejectInfluencer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        if (!id || !reason) {
            res.status(400).json({ error: "Application ID and reason are required" });
            return;
        }
        yield (0, influencerService_1.rejectInfluencerApplication)(Number(id), 1, reason);
        res.status(200).json({ message: "Application rejected successfully." });
    }
    catch (error) {
        console.error("Error rejecting influencer application:", error);
        res.status(500).json({ error: "Failed to reject application" });
    }
});
exports.rejectInfluencer = rejectInfluencer;
const checkPendingApplication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (!userId) {
            res.status(400).json({ error: "User ID is required" });
            return;
        }
        const isPending = yield (0, influencerService_1.getPendingApplicationByUserId)(Number(userId));
        res.status(200).json({ isPending });
    }
    catch (error) {
        console.error("Error checking pending application:", error);
        res.status(500).json({ error: "Failed to check pending application" });
    }
});
exports.checkPendingApplication = checkPendingApplication;
