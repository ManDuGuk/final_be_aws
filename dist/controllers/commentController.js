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
exports.updateComment = exports.deleteComment = exports.getComment = exports.postComment = void 0;
const comment_1 = require("../models/comment");
const user_1 = require("../models/user");
const postComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id, post_id, parent_comment_id, content } = req.body;
        // 필수 필드 검증
        if (!user_id || !post_id || !content) {
            return res.status(400).json({
                success: false,
                message: '필수 필드가 누락되었습니다.',
            });
        }
        yield comment_1.Comment.create({
            user_id,
            post_id,
            parent_comment_id: parent_comment_id || null,
            content,
            hidden_yn: false,
        });
        return res.status(200).json({
            success: true,
            message: '댓글 달렸습니다',
        });
    }
    catch (error) {
        console.error('댓글 생성 중 오류 발생:', error);
        return res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.',
        });
    }
});
exports.postComment = postComment;
const getComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post_id = req.params.id; // 쿼리 파라미터로 post_id 받기
        // post_id가 없으면 오류 반환
        if (!post_id) {
            return res.status(400).json({
                success: false,
                message: '게시물 ID가 필요합니다.',
            });
        }
        // 주어진 post_id에 해당하는 댓글들 조회
        const comments = yield comment_1.Comment.findAll({
            where: {
                post_id: post_id,
                hidden_yn: false,
            },
            include: {
                model: user_1.User,
                attributes: ['username', 'profile_picture'], // 필요한 필드만 가져오기 (username)
            },
            order: [['created_at', 'ASC']], // 작성일 순으로 정렬
        });
        // 댓글을 부모 댓글과 대댓글로 분류
        const parentComments = comments.filter(comment => !comment.parent_comment_id);
        const replies = comments.filter(comment => comment.parent_comment_id);
        // 부모 댓글에 대댓글 포함하기
        const commentsWithReplies = parentComments.map(parentComment => {
            var _a;
            const parentCommentReplies = replies.filter(reply => reply.parent_comment_id === parentComment.id);
            return Object.assign(Object.assign({}, parentComment.dataValues), { user: ((_a = parentComment.user) === null || _a === void 0 ? void 0 : _a.dataValues) || null, replies: parentCommentReplies.map(reply => {
                    var _a;
                    return (Object.assign(Object.assign({}, reply.dataValues), { user: (_a = reply.user) === null || _a === void 0 ? void 0 : _a.dataValues }));
                }) });
        });
        // 댓글이 없으면 빈 배열로 응답
        if (!comments || comments.length === 0) {
            return res.status(200).json({
                success: true,
                message: '댓글이 없습니다.',
                data: [],
            });
        }
        // 댓글 조회 성공
        return res.status(200).json({
            success: true,
            data: commentsWithReplies,
        });
    }
    catch (error) {
        console.error('댓글 조회 중 오류 발생:', error);
        return res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.',
        });
    }
});
exports.getComment = getComment;
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // 댓글 ID 가져오기
        console.log('delete: ', id);
        const comment = yield comment_1.Comment.findByPk(id);
        if (!comment) {
            res
                .status(404)
                .json({ success: false, message: '댓글을 찾을 수 없습니다.' });
        }
        if (comment) {
            // 숨김 처리 (소프트 삭제)
            yield comment.update({ hidden_yn: 1 });
            res
                .status(200)
                .json({ success: true, message: '댓글이 삭제되었습니다.' });
        }
    }
    catch (error) {
        console.error('댓글 삭제 중 오류 발생:', error);
        res
            .status(500)
            .json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
});
exports.deleteComment = deleteComment;
const updateComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { content } = req.body;
        console.log('update: ', id);
        const comment = yield comment_1.Comment.findByPk(id);
        if (!comment) {
            res.status(404).json({
                success: false,
                message: '댓글을 찾을 수 없습니다.',
            });
        }
        if (comment) {
            yield comment.update({ content });
            res.status(200).json({
                success: true,
                message: '댓글이 수정되었습니다.',
                data: comment,
            });
        }
    }
    catch (error) {
        console.error('댓글 수정 중 오류 발생:', error);
        res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.',
        });
    }
});
exports.updateComment = updateComment;
