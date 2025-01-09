"use strict";
/**
 * verifySignUp.ts
 * 작성자: 조영우(chodevelop)
 * 작성일: 2024/11/20
 * 설명: 회원가입 과정에 필요한 username 및 email의 유일성(DB 내 중복된 칼럼 값을 가지는 데이터 존재 여부)을 검증하는 미들웨어 모듈입니다.
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySignUp = exports.checkDuplicateUsernameOrEmail = void 0;
const models_1 = require("../models");
const User = models_1.db.User;
/**
 * 사용자 이름(username)과 이메일(email)의 중복 여부를 확인하는 미들웨어
 *
 * 회원가입 요청 시, 데이터베이스에서 동일한 `username` 또는 `email`이 존재하는지 확인합니다.
 * 중복이 발견되면 요청을 종료하고 적절한 상태 코드와 메시지를 반환합니다.
 *
 * @param {Request} req - 클라이언트 요청 객체
 *   - `req.body.username` (string): 중복 여부를 확인할 사용자 이름
 *   - `req.body.email` (string): 중복 여부를 확인할 이메일 주소
 * @param {Response} res - 서버 응답 객체
 *   - 중복 발견 시: 400 상태 코드와 에러 메시지 반환
 *   - 서버 에러 시: 500 상태 코드와 에러 메시지 반환
 * @param {NextFunction} next - 다음 미들웨어로 요청을 전달하는 함수
 *   - 중복이 없으면 호출됩니다.
 * @returns {void} 반환값 없음. 성공 시 `next()` 호출로 흐름 제어.
 *
 * @throws {Error} 데이터베이스 연결 문제 또는 서버 에러 발생 시
 *
 * @example
 * // 라우터에서 사용
 * import { verifySignUp } from "./middlewares/verifySignUp";
 * router.post("/signup", verifySignUp.checkDuplicateUsernameOrEmail, (req, res) => {
 *   res.send({ message: "User registered successfully!" });
 * });
 */
const checkDuplicateUsernameOrEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Sequelize에서 Username과 Email 동시에 체크
        const [userByUsername, userByEmail] = yield Promise.all([
            User.findOne({ where: { username: req.body.username } }),
            User.findOne({ where: { email: req.body.email } }),
        ]);
        if (userByUsername) {
            res.status(400).send({
                message: "Failed! Username is already in use!",
            });
            return; // 중복 발견 시 요청 종료
        }
        if (userByEmail) {
            res.status(400).send({
                message: "Failed! Email is already in use!",
            });
            return; // 중복 발견 시 요청 종료
        }
        next(); // 중복 없음, 다음 미들웨어로 진행
    }
    catch (error) {
        console.error("Error in checkDuplicateUsernameOrEmail:", error);
        res.status(500).send({
            message: "Internal server error during user validation.",
        });
    }
});
exports.checkDuplicateUsernameOrEmail = checkDuplicateUsernameOrEmail;
/**
 * verifySignUp 객체
 *
 * 회원가입 검증과 관련된 미들웨어를 포함하는 객체입니다.
 *
 * @property {Function} checkDuplicateUsernameOrEmail - 사용자 이름과 이메일 중복 여부를 확인하는 미들웨어
 *
 * @example
 * // 라우터에서 사용
 * import { verifySignUp } from "./middlewares/verifySignUp";
 * router.post("/signup", verifySignUp.checkDuplicateUsernameOrEmail, (req, res) => {
 *   res.send({ message: "User registered successfully!" });
 * });
 */
exports.verifySignUp = {
    checkDuplicateUsernameOrEmail: exports.checkDuplicateUsernameOrEmail,
};
