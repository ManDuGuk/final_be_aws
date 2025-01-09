"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const paymentController_1 = require("../controllers/paymentController");
const router = express_1.default.Router();
exports.router = router;
router.get("/list", paymentController_1.getPaymentsController); // 결제 목록 조회
router.post("/confirm", paymentController_1.confirmPaymentController); // 결제 승인
router.post("/save", paymentController_1.savePaymentInfoController); // 결제 정보 저장
