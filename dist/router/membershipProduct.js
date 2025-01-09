"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const membershipProductController_1 = require("../controllers/membershipProductController");
const membershipController_1 = require("../controllers/membershipController");
const membershipProductController_2 = require("../controllers/membershipProductController");
const router = express_1.default.Router();
exports.router = router;
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(), // 파일을 메모리에 저장
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB 제한
});
router.patch("/product/:productId", membershipProductController_1.toggleProductStatus);
router.get("/products/:userId", membershipProductController_2.getMembershipProducts);
router.patch("/products/:productId", upload.single("image"), membershipProductController_2.updateMembershipProducts);
router.delete("/image", membershipProductController_1.deleteImg);
router.post("/products", upload.single("image"), membershipProductController_1.createMembershipProducts);
router.delete("/products/:productId", membershipProductController_1.deleteMembershipProducts);
router.get("/allproducts/:influencerId", membershipProductController_1.getMembershipProductsByInfluencerId);
router.get("/subscriptions/:userId", membershipController_1.getSubscriptions);
router.post("/subscribe", membershipController_1.subscribeMembership);
