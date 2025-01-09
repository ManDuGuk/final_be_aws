"use strict";
/**
 * auth.ts
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
const verifySignUp_1 = require("../middlewares/verifySignUp");
const sessionMiddleware_1 = __importDefault(require("../middlewares/sessionMiddleware"));
const cors_1 = __importDefault(require("cors"));
const localAuthController_1 = require("../controllers/auth/localAuthController");
const googleAuthController_1 = require("../controllers/auth/googleAuthController");
const kakaoAuthController_1 = require("../controllers/auth/kakaoAuthController");
const refreshAccessTokenController_1 = require("../controllers/auth/refreshAccessTokenController");
const dotenv = __importStar(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const clearBrowserCache_1 = __importDefault(require("../middlewares/clearBrowserCache"));
dotenv.config();
const router = (0, express_1.Router)();
exports.router = router;
router.use((0, cookie_parser_1.default)());
const FRONTEND_URL = process.env.FRONTEND_URL || "DEFAULT_FRONTEND_URL";
// CORS 설정
const corsOptions = {
    origin: FRONTEND_URL, // 클라이언트 도메인
    credentials: true, // 쿠키 및 인증 헤더 허용
    methods: ['GET', 'POST', 'OPTIONS'], // 허용할 HTTP 메서드
};
// router.use(cors(corsOptions)); // 쿠키 파서 미들웨어 설정
// 회원가입 경로
router.post("/signup", [verifySignUp_1.verifySignUp.checkDuplicateUsernameOrEmail], localAuthController_1.signup);
// 로그인 경로
router.post("/signin", localAuthController_1.signin);
router.post("/refreshaccesstoken", (0, cors_1.default)(corsOptions), refreshAccessTokenController_1.refreshAccessToken);
router.get("/signin/kakao/", (0, cors_1.default)(corsOptions), kakaoAuthController_1.getKakaoAuth);
router.get("/signin/kakao/callback", (0, cors_1.default)(corsOptions), kakaoAuthController_1.getKakaoAuthCallback);
router.get("/signin/google/", (0, cors_1.default)(corsOptions), sessionMiddleware_1.default, googleAuthController_1.getGoogleAuth);
router.get("/signin/google/callback", (0, cors_1.default)(corsOptions), sessionMiddleware_1.default, googleAuthController_1.getGoogleAuthCallback);
router.post("/logout", (0, cors_1.default)(corsOptions), clearBrowserCache_1.default, localAuthController_1.logout);
