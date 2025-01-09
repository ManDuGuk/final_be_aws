"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const multer_1 = __importDefault(require("multer"));
const validateUserId_1 = require("../middlewares/validateUserId");
const upload = (0, multer_1.default)();
const router = express_1.default.Router();
exports.router = router;
router.get("/all", userController_1.getAllUsers);
router.get("/:id", validateUserId_1.validateUserId, userController_1.getUserProfile);
router.put("/:id", validateUserId_1.validateUserId, upload.fields([
    { name: "profile_picture", maxCount: 1 }, // 프로필 이미지
    { name: "banner_picture", maxCount: 1 }, // 배너 이미지
]), userController_1.updateUserProfile);
router.get("/:id/likes", validateUserId_1.validateUserId, userController_1.findLikeFeedForUser);
router.get("/:id/follows", validateUserId_1.validateUserId, userController_1.findFollowInfluencerForUser);
router.get("/:id/feeds", validateUserId_1.validateUserId, userController_1.findFeedsForUser);
