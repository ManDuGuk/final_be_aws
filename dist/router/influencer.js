"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const influencerController_1 = require("../controllers/influencerController");
const router = express_1.default.Router();
exports.router = router;
router.get("/all", influencerController_1.getInfluencers);
router.get("/:id", influencerController_1.getInfluencer);
//user_id로 인플정보 --윤호
router.get("/user/:id", influencerController_1.getInfluenerByuser);
router.post("/follow", influencerController_1.followInfluencer);
router.post("/register", influencerController_1.registerInfluencer);
router.delete("/:id", influencerController_1.exitInfluencer);
router.post("/apply", influencerController_1.applyInfluencer);
router.get("/apply/check/:userId", influencerController_1.checkPendingApplication); // 펜딩 상태 확인
router.get("/apply/all", influencerController_1.getApplies);
router.put("/apply/:id/approve", influencerController_1.approveInfluencer);
router.put("/apply/:id/reject", influencerController_1.rejectInfluencer);
