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
exports.getDashboardStats = exports.getPaymentAmountByDate = exports.getUserCountByDate = exports.getFeedCountByDate = exports.getFeedCount = exports.getTotalUserCount = exports.getTodayUserCount = void 0;
const models_1 = require("../models");
const sequelize_1 = require("sequelize");
// 오늘 날짜의 시작과 끝을 구하는 함수
const getTodayRange = () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    return { start, end };
};
// 오늘 가입자 수 조회
const getTodayUserCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { start, end } = getTodayRange();
        const count = yield models_1.db.User.count({
            where: {
                created_at: {
                    [sequelize_1.Op.between]: [start, end],
                },
            },
        });
        res.json({ todayUserCount: count });
    }
    catch (error) {
        res.status(500).json({ error: '서버 오류' });
    }
});
exports.getTodayUserCount = getTodayUserCount;
// 총 가입자 수 조회
const getTotalUserCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const count = yield models_1.db.User.count();
        res.json({ totalUserCount: count });
    }
    catch (error) {
        res.status(500).json({ error: '서버 오류' });
    }
});
exports.getTotalUserCount = getTotalUserCount;
// 피드 글 갯수 조회
const getFeedCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const count = yield models_1.db.Feed.count();
        res.json({ feedCount: count });
    }
    catch (error) {
        res.status(500).json({ error: '서버 오류' });
    }
});
exports.getFeedCount = getFeedCount;
// 날짜별 피드 수 조회
const getFeedCountByDate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const feedCounts = yield models_1.db.Feed.findAll({
            attributes: [
                [models_1.db.sequelize.fn('DATE', models_1.db.sequelize.col('created_at')), 'date'],
                [models_1.db.sequelize.fn('COUNT', models_1.db.sequelize.col('id')), 'count'],
            ],
            group: ['date'],
            order: [['date', 'ASC']],
        });
        res.json(feedCounts);
    }
    catch (error) {
        res.status(500).json({ error: '서버 오류' });
    }
});
exports.getFeedCountByDate = getFeedCountByDate;
// 날짜별 가입자 수 조회
const getUserCountByDate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userCounts = yield models_1.db.User.findAll({
            attributes: [
                [models_1.db.sequelize.fn('DATE', models_1.db.sequelize.col('created_at')), 'date'],
                [models_1.db.sequelize.fn('COUNT', models_1.db.sequelize.col('id')), 'count'],
            ],
            group: ['date'],
            order: [['date', 'ASC']],
        });
        res.json(userCounts);
    }
    catch (error) {
        res.status(500).json({ error: '서버 오류' });
    }
});
exports.getUserCountByDate = getUserCountByDate;
// 날짜별 결제금액 조회
const getPaymentAmountByDate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paymentAmounts = yield models_1.db.Payment.findAll({
            attributes: [
                [models_1.db.sequelize.fn('DATE', models_1.db.sequelize.col('created_at')), 'date'],
                [models_1.db.sequelize.fn('SUM', models_1.db.sequelize.col('amount')), 'amount'],
            ],
            group: ['date'],
            order: [['date', 'ASC']],
        });
        res.json(paymentAmounts);
    }
    catch (error) {
        res.status(500).json({ error: '서버 오류' });
    }
});
exports.getPaymentAmountByDate = getPaymentAmountByDate;
// 모든 통계 한 번에 조회
const getDashboardStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { start, end } = getTodayRange();
        const safeCount = (query) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                return yield query;
            }
            catch (_a) {
                return 0; // 실패 시 기본값 반환
            }
        });
        const [todayUserCount, totalUserCount, feedCount, influencerCount, todayFeedCount, totalMembershipCount, influencerFollowers, feedCountsByDate, userCountsByDate, paymentAmountsByDate,] = yield Promise.all([
            safeCount(models_1.db.User.count({
                where: {
                    created_at: {
                        [sequelize_1.Op.between]: [start.toISOString(), end.toISOString()],
                    },
                },
            })),
            safeCount(models_1.db.User.count()),
            safeCount(models_1.db.Feed.count()),
            safeCount(models_1.db.Influencer.count()),
            safeCount(models_1.db.Feed.count({
                where: {
                    created_at: {
                        [sequelize_1.Op.between]: [start.toISOString(), end.toISOString()],
                    },
                },
            })),
            safeCount(models_1.db.Membership.count()),
            safeCount(models_1.db.Influencer.findAll({
                attributes: ['follower'],
            })),
            safeCount(models_1.db.Feed.findAll({
                attributes: [
                    [models_1.db.sequelize.fn('DATE', models_1.db.sequelize.col('created_at')), 'date'],
                    [models_1.db.sequelize.fn('COUNT', models_1.db.sequelize.col('id')), 'count'],
                ],
                group: ['date'],
                order: [['date', 'ASC']],
            })),
            safeCount(models_1.db.User.findAll({
                attributes: [
                    [models_1.db.sequelize.fn('DATE', models_1.db.sequelize.col('created_at')), 'date'],
                    [models_1.db.sequelize.fn('COUNT', models_1.db.sequelize.col('id')), 'count'],
                ],
                group: ['date'],
                order: [['date', 'ASC']],
            })),
            safeCount(models_1.db.Payment.findAll({
                attributes: [
                    [models_1.db.sequelize.fn('DATE', models_1.db.sequelize.col('created_at')), 'date'],
                    [models_1.db.sequelize.fn('SUM', models_1.db.sequelize.col('amount')), 'amount'],
                ],
                group: ['date'],
                order: [['date', 'ASC']],
            })),
        ]);
        const followersArray = influencerFollowers
            .map(influencer => {
            try {
                return JSON.parse(influencer.follower).map(Number);
            }
            catch (_a) {
                return [];
            }
        });
        const allFollowers = [].concat(...followersArray);
        const minFollowers = allFollowers.length ? Math.min(...allFollowers) : 0;
        const maxFollowers = allFollowers.length ? Math.max(...allFollowers) : 0;
        const avgFollowers = allFollowers.length ? allFollowers.reduce((sum, val) => sum + val, 0) / allFollowers.length : 0;
        res.json({
            todayUserCount,
            totalUserCount,
            feedCount,
            influencerCount,
            todayFeedCount,
            totalMembershipCount,
            influencerFollowerStats: {
                minFollowers,
                maxFollowers,
                avgFollowers,
            },
            feedCountsByDate,
            userCountsByDate,
            paymentAmountsByDate,
        });
    }
    catch (error) {
        console.error("Error details:", error);
        res.status(500).json({ error: '서버 오류', details: error.message });
    }
});
exports.getDashboardStats = getDashboardStats;
