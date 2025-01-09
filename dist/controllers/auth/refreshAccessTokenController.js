"use strict";
/**
 * refreshAccessTokenController.ts
 * 작성자: 조영우(chodevelop)
 * 작성일: 2024/11/20
 * 리팩터링: 2024/12/06
 * 설명: JWT 로그인 과정에서 필요한 refreshToken의 존재 여부 확인 및 accessToken 재발급을 위한 컨트롤러 모듈입니다.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("../../util/auth");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
///여기서부터는 리프레쉬 토큰 검증
const refreshAccessToken = (req, res) => {
    var _a;
    const refreshToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
    // 리프레쉬 토큰 없음 -> 403 에러 처리
    if (!refreshToken) {
        res.status(403).send({
            message: 'No refresh token provided.',
            status: 403,
        });
        return;
    }
    try {
        //리프레쉬 토큰 해독 시도
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        //유효한 값이 나오면 토큰을 해독한 값에서 새로운 accessToken에 들어갈 값을 구성
        const newTokenInfo = {
            userId: decoded.userId,
            username: decoded.username,
        };
        if (decoded.influencerId) {
            newTokenInfo.influencerId = decoded.influencerId;
        }
        //구성한 값을 통해 새로운 accessToken을 생성
        const newAccessToken = (0, auth_1.generateToken)(newTokenInfo, process.env.JWT_SECRET, "5m");
        //accessToken을 200 status를 통해 JSON으로 보내기
        res.status(200).json({ accessToken: newAccessToken });
    }
    catch (err) {
        // 리프레쉬 토큰은 성공적으로 검증됐으나 이미 만료가 된 경우 403 에러 보냄
        if (err.name === 'TokenExpiredError') {
            res.status(403).json({
                message: 'Refresh Token is expired.',
                status: 401,
            });
            // 유효하지 않거나 변조된 Refresh Token값을 보냈을 시 403 에러
        }
        else if (err.name === 'JsonWebTokenError') {
            res.status(403).json({
                message: 'Refresh Token is invalid.',
                status: 403,
            });
            // 기타 분류하지 못한 에러가 발생했을 시 500 에러
        }
        else {
            res.status(401).send({
                message: 'Unauthorized!',
                status: 401,
                error: err,
            });
        }
    }
    ;
};
exports.refreshAccessToken = refreshAccessToken;
