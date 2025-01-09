"use strict";
/**
 * localAuth.controller.ts
 * 작성자: 조영우(chodevelop)
 * 작성일: 2024/11/27
 * 리팩터링: 2024/12/06
 * 설명: 로컬 로그인(소셜 로그인이 아닌 것)의 회원가입 및 로그인을 관리하는 컨트롤러 모듈입니다.
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
exports.logout = exports.signin = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_1 = require("../../models/user");
const auth_1 = require("../../util/auth");
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield user_1.User.create({
            username: req.body.username,
            email: req.body.email,
            password: bcryptjs_1.default.hashSync(req.body.password, 8),
        });
        res.status(201).json({
            message: 'User registered successfully!',
            status: 201,
        });
    }
    catch (err) {
        console.error('Internal server error.', err);
        res.status(500).send({
            message: 'Internal server error.',
            error: err.message,
            status: 500,
        });
    }
});
exports.signup = signup;
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    try {
        const { user, influencer } = yield (0, auth_1.getUserInfluencerInfo)(email);
        if (!user) {
            res.status(404).send({
                message: 'User Not found.',
                status: 404,
            });
            return;
        }
        const passwordIsValid = bcryptjs_1.default.compareSync(req.body.password, user.password);
        if (!passwordIsValid) {
            res.status(401).send({
                message: 'Invalid Password.',
                status: 401,
            });
            return;
        }
        const accessToken = (0, auth_1.handleIssueToken)(req, res, user, influencer);
        res.status(200).send(accessToken);
        // res.status(200).send({
        //   message: 'Access token generated successfully.',
        //   status: 200,
        //   data: accessToken
        // });
    }
    catch (err) {
        console.error('Internal server error.', err);
        res.status(500).send({
            message: 'Internal server error.',
            error: err.message,
            status: 500,
        });
    }
});
exports.signin = signin;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    console.log(`req.cookies.refreshToken: `, refreshToken);
    res.clearCookie('refreshToken', {
        httpOnly: true, // 오로지 백엔드에서만 수정 및 삭제가 가능함
        secure: false, // localhost에서 HTTPS 사용 안 함
        sameSite: 'lax', // Cross-Origin 요청 허용 (로그인 리다이렉트 등)
        path: '/', // 모든 경로에서 쿠키 삭제
    });
    console.log('refreshToken 삭제 완료');
    res.status(200).json({
        message: 'Logout successful.',
        status: 200,
    });
});
exports.logout = logout;
