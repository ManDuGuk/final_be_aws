"use strict";
/**
 * authJwt.ts
 * 작성자: 조영우(chodevelop)
 * 작성일: 2024/11/20
 * 설명: accessToken의 유효성을 검증하고, 필요에 따라 RefreshToken을 통한 accessToken의 재발급을 유도하는 JWT 토큰 관리 미들웨어 모듈입니다.
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
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv = __importStar(require("dotenv"));
const JWT_SECRET = process.env.JWT_SECRET || `DEFAULT_JWT_SECRET`;
dotenv.config();
const verifyToken = (req, res, next) => {
    console.log(`req.headers verifytoken 1st: `, req.headers);
    //'x-access-token' 랑 'Bearer'를 둘 다 받을 수 있게 만든 코드
    let token;
    // 1) Authorization 헤더에서 Bearer 토큰 추출
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1]; // "Bearer TOKEN"에서 TOKEN만 추출
    }
    console.log(`Bear(er): `, token);
    // 2) x-access-token 헤더에서 토큰 추출
    if (!token && req.headers['x-access-token']) {
        token = req.headers['x-access-token'];
    }
    console.log(`x-access-token: `, token);
    //두개를 다 적용했는데도 토큰이 없으면 401 에러 후 리턴
    if (!token) {
        res.status(401).json({
            status: 401,
            message: "Access Token is missing.",
        });
        return;
    }
    try {
        // 2. 엑세스 토큰 확인
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET); // accessToken 만료 시 이 부분에서 걸림
        req.userId = decoded.userId;
        req.influencerId = decoded.influencerId ? decoded.influencerId : null; // 이 부분은 논린이 있어 수정 가능성이 농후함(undefined로 수정해야 할 수도?)
        req.userId = decoded.userId;
        next(); // 다음 미들웨어로 전달
    }
    catch (err) {
        if (err.name === 'TokenExpiredError') {
            res.status(401).send({
                status: 401,
                message: "Access Token expired. Please refresh your token.",
            });
        }
        else {
            // 기타 인증 실패 에러 처리
            res.status(401).send({
                message: 'Unauthorized!',
                status: 401,
                error: err,
            });
        }
    }
};
exports.verifyToken = verifyToken;
