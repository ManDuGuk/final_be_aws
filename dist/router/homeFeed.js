"use strict";
/**
 * homeFeed.ts
 * 작성자: 조영우(chodevelop)
 * 작성일: 2024/11/20
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const dotenv = __importStar(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const homeFeedController_1 = require("../controllers/homeFeed/homeFeedController");
dotenv.config();
const router = (0, express_1.Router)();
exports.router = router;
router.use((0, cookie_parser_1.default)());
router.post("/postcurrentloggedinuserinfo", homeFeedController_1.postCurrentLoggedInUserInfo);
router.post("/getfeeds", homeFeedController_1.getFeeds);
router.post("/getfeeds", homeFeedController_1.getFeeds);
router.post("/feeddatatoinfluencerdata", homeFeedController_1.postFeedDatatoInfluencerData);
router.patch("/patchuserfollow", homeFeedController_1.patchUserFollow);
router.patch("/:feedId/likes", homeFeedController_1.patchFeedLikes);
router.post("/postinfluencerusernameinfo", homeFeedController_1.postInfluencerUsernameInfo); // 안씀
router.post("/postuseridbyinfluencerid", homeFeedController_1.postUserIdByInfluencerId);
router.post("/postusernamebyuserid", homeFeedController_1.postUsernameByUserId);
router.get("/getmembershipproduct", homeFeedController_1.getMembershipProduct);
router.get("/getusermembershiplevel", homeFeedController_1.getUserMembershipLevel);
router.get("/getMembershipProductsFromInfluencerId", homeFeedController_1.getMembershipProductsFromInfluencerId);
router.post("/getMembershipFromUserId", homeFeedController_1.getMembershipFromUserId);
router.post("/getFeedsQueue", homeFeedController_1.getFeedsQueue);
router.post("/getfollowingfeeds", homeFeedController_1.getFollowingFeeds);
