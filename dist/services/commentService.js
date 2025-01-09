"use strict";
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
exports.deleteComment = exports.updateComment = exports.getReplies = exports.getComments = exports.createComment = void 0;
// services/commentService.ts
const comment_1 = require("../models/comment");
// DB댓글 저장
const createComment = (commentData) => __awaiter(void 0, void 0, void 0, function* () {
    return yield comment_1.Comment.create(commentData);
});
exports.createComment = createComment;
// 게시글의 댓글 조회
const getComments = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield comment_1.Comment.findAll({
        where: {
            post_id: postId,
            parent_comment_id: null,
            hidden_yn: false
        },
        order: [['created_at', 'DESC']]
    });
});
exports.getComments = getComments;
// 대댓글 조회
const getReplies = (commentId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield comment_1.Comment.findAll({
        where: {
            parent_comment_id: commentId,
            hidden_yn: false
        },
        order: [['created_at', 'ASC']]
    });
});
exports.getReplies = getReplies;
// 댓글 수정
const updateComment = (commentId, content) => __awaiter(void 0, void 0, void 0, function* () {
    return yield comment_1.Comment.update({
        content,
        modified_at: new Date()
    }, {
        where: { id: commentId }
    });
});
exports.updateComment = updateComment;
// 댓글 삭제 (숨김 처리)
const deleteComment = (commentId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield comment_1.Comment.update({ hidden_yn: true }, { where: { id: commentId } });
});
exports.deleteComment = deleteComment;
