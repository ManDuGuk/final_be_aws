"use strict";
/**
 * kakaoAuth.controller.ts
 * 작성자: 조영우(chodevelop)
 * 작성일: 2024/11/27
 * 설명: 카카오(Kakao) 소셜 로그인 및 회원가입 유도를 관리하는 컨트롤러 모듈입니다.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKakaoAuthCallback = exports.getKakaoAuth = void 0;
const axios_1 = __importDefault(require("axios"));
const auth_1 = require("../../util/auth");
const apiEndpoints_1 = __importDefault(require("../../config/apiEndpoints"));
const KAKAO_CLIENT_ID = process.env.KAKAO_CLIENT_ID || "DEFAULT_KAKAO_CLIENT_ID";
// const KAKAO_REDIRECT_URI = process.env.KAKAO_REDIRECT_URI || "DEFAULT_KAKAO_REDIRECT_URI";
const FRONTEND_URL = process.env.FRONTEND_URL || `DEFAULT_FRONTEND_URL`;
const KAKAO_REDIRECT_URI = apiEndpoints_1.default.auth.kakaoRedirect;
/**
 * Kakao OAuth 인증을 시작하는 컨트롤러
 *
 * 사용자를 Kakao 로그인 페이지로 리다이렉트합니다.
 *
 * @param {Request} req - 클라이언트 요청 객체
 * @param {Response} res - 서버 응답 객체
 * @returns {void} Kakao 로그인 페이지로 리다이렉트
 *
 * @example
 * // 라우터에서 사용
 * router.get('/auth/kakao', getKakaoAuth);
 */
const getKakaoAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const responseType = "code";
        const authUrl = `https://kauth.kakao.com/oauth/authorize?response_type=${responseType}&client_id=${KAKAO_CLIENT_ID}&redirect_uri=${encodeURIComponent(KAKAO_REDIRECT_URI)}`;
        res.redirect(authUrl);
    }
    catch (error) {
        console.error("Error generating Kakao Auth URL:", error.message);
        res.status(500).json({ error: "Failed to generate Kakao Auth URL" });
    }
});
exports.getKakaoAuth = getKakaoAuth;
/**
 * Kakao OAuth 인증 콜백 처리 컨트롤러
 *
 * Kakao에서 받은 인증 코드를 사용하여 액세스 토큰을 가져오고, 사용자 정보를 처리합니다.
 *
 * @param {Request} req - 클라이언트 요청 객체 (Kakao 인증 코드 포함)
 * @param {Response} res - 서버 응답 객체
 * @returns {void} 인증 성공 시 세션 생성 후 클라이언트로 리다이렉트
 *
 * @throws {Error} Kakao 인증 실패 또는 액세스 토큰 요청 실패
 *
 * @example
 * // 라우터에서 사용
 * router.get('/auth/kakao/callback', getKakaoAuthCallback);
 */
const getKakaoAuthCallback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const code = req.query.code; // 클라이언트가 전달한 인증 코드
        if (!code) {
            res.status(400).json({ error: "Authorization code is required" });
            return;
        }
        // 요청 데이터
        const data = new URLSearchParams();
        data.append("grant_type", "authorization_code");
        data.append("client_id", KAKAO_CLIENT_ID);
        data.append("redirect_uri", KAKAO_REDIRECT_URI);
        data.append("code", code);
        // 카카오 토큰 발급 요청
        const tokenResponse = yield axios_1.default.post("https://kauth.kakao.com/oauth/token", data.toString(), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
            },
        });
        console.log(tokenResponse.data);
        const userInfo = yield axios_1.default.get("https://kapi.kakao.com/v2/user/me", {
            headers: {
                "Authorization": `Bearer ${tokenResponse.data.access_token}`,
            },
        });
        console.log(userInfo.data);
        const kakaoData = userInfo.data;
        const email = (_a = kakaoData.kakao_account) === null || _a === void 0 ? void 0 : _a.email;
        const { user, influencer } = yield (0, auth_1.getUserInfluencerInfo)(email);
        if (user) {
            const accessToken = (0, auth_1.handleIssueToken)(req, res, user, influencer);
            const result = accessToken;
            // 사용자 정보 쿼리 문자열로 포함
            const queryString = new URLSearchParams(result).toString();
            const redirectUrl = `${FRONTEND_URL}/login/callback?${queryString}`;
            res.redirect(redirectUrl);
        }
        else {
            // 4. 이메일이 없음 -> 회원가입 페이지로 연동
            // 회원가입 페이지로 리다이렉트
            const redirectUrl = `${FRONTEND_URL}/register?email=${encodeURIComponent(email)}`;
            res.redirect(redirectUrl);
        }
    }
    catch (error) {
        console.error("Error during Kakao Token Request:", ((_b = error.response) === null || _b === void 0 ? void 0 : _b.data) || error.message);
        res.status(500).json({ error: "Failed to get token from Kakao", details: (_c = error.response) === null || _c === void 0 ? void 0 : _c.data });
    }
});
exports.getKakaoAuthCallback = getKakaoAuthCallback;
