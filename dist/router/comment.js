"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
// routes/commentRoutes.ts
const express_1 = __importDefault(require("express"));
const authJwt_1 = require("../middlewares/authJwt");
const commentController_1 = require("../controllers/commentController");
const router = express_1.default.Router();
exports.router = router;
router.post('/', authJwt_1.verifyToken, commentController_1.postComment);
router.get('/:id', commentController_1.getComment);
router.delete('/:id', authJwt_1.verifyToken, commentController_1.deleteComment);
router.patch('/:id', authJwt_1.verifyToken, commentController_1.updateComment);
