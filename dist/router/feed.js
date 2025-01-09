"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const feedController_1 = require("../controllers/feedController");
const authJwt_1 = require("../middlewares/authJwt");
const router = express_1.default.Router();
exports.router = router;
// 라우트에서 upload 미들웨어 먼저 실행
router.post('/', authJwt_1.verifyToken, feedController_1.FeedWrite); // 작성
router.get('/:id', feedController_1.FeedGetById); // 상세게시글
router.patch('/:id', authJwt_1.verifyToken, feedController_1.FeedUpdate); // 수정
router.delete('/:id', authJwt_1.verifyToken, feedController_1.FeedDelete); // 삭제
router.patch('/likes/:id', authJwt_1.verifyToken, feedController_1.FeedLikes); // 좋아요
// 어드민
router.get('/admin/all', feedController_1.AdminFeedGetAll);
router.patch('/admin/:id', feedController_1.FeedUpdate);
router.delete('/admin/:id', feedController_1.FeedDelete); // 삭제
