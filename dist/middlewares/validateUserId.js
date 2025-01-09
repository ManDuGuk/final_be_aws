"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserId = void 0;
const validateUserId = (req, res, next) => {
    const userId = req.params.id;
    if (!userId) {
        res.status(400).json({ error: '사용자 ID가 제공되지 않았습니다.' });
        return;
    }
    next();
};
exports.validateUserId = validateUserId;
