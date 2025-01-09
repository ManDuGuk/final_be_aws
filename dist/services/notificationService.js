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
exports.getFollowersByInfluencerId = void 0;
exports.saveNotification = saveNotification;
exports.getNotificationsByUserId = getNotificationsByUserId;
exports.deleteNotificationById = deleteNotificationById;
const feed_1 = require("../models/feed");
const influencer_1 = require("../models/influencer");
const notification_1 = require("../models/notification");
const user_1 = require("../models/user");
//팔로워 목록 가져오기
const getFollowersByInfluencerId = (influencerId) => __awaiter(void 0, void 0, void 0, function* () {
    const influencer = yield influencer_1.Influencer.findOne({
        where: { id: influencerId },
    });
    if (!influencer) {
        console.log(`Influencer with ID ${influencerId} not found`);
        return [];
    }
    try {
        const followers = influencer.dataValues.follower;
        const numericalFollowers = JSON.parse(followers).map((id) => Number(id));
        return numericalFollowers;
    }
    catch (error) {
        console.error(error);
        return [];
    }
});
exports.getFollowersByInfluencerId = getFollowersByInfluencerId;
//db에 알림 저장
function saveNotification(followers, feedId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // feedId가 Feed 테이블에 존재하는지 확인
            const feedExists = yield feed_1.Feed.findByPk(feedId);
            if (!feedExists) {
                console.log(`피드 ID ${feedId}를 찾을 수 없습니다.`);
                return false;
            }
            const notifications = followers.map((followerId) => ({
                user_id: followerId,
                feed_id: feedId, // feed_id 필드 추가
                is_read: false,
            }));
            yield notification_1.Notification.bulkCreate(notifications);
            console.log(`${notifications.length}개의 알림이 성공적으로 생성되었습니다.`);
            return true;
        }
        catch (error) {
            console.error("알림 저장 중 오류 발생:", error);
            throw error;
        }
    });
}
function getNotificationsByUserId(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const notifications = yield notification_1.Notification.findAll({
                where: { user_id: userId },
                order: [["created_at", "DESC"]],
                include: [
                    {
                        model: feed_1.Feed,
                        as: "feed",
                        include: [
                            {
                                model: influencer_1.Influencer,
                                as: "influencer",
                                include: [
                                    {
                                        model: user_1.User,
                                        as: "user",
                                        attributes: ["id", "username"], // 필요한 필드만 가져오기
                                    },
                                ],
                            },
                        ],
                    },
                ],
            });
            return notifications;
        }
        catch (error) {
            console.error(`Error fetching notifications for user ${userId}:`, error);
            throw new Error("알림 조회 중 오류가 발생했습니다.");
        }
    });
}
function deleteNotificationById(notificationId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield notification_1.Notification.destroy({
                where: { id: notificationId },
            });
            if (!result) {
                throw new Error(`알림 ID ${notificationId}을 찾을 수 없습니다.`);
            }
            console.log(`알림 ID ${notificationId}가 삭제됐습니다.`);
        }
        catch (error) {
            console.error("알림 삭제 중 오류:", error);
            throw error;
        }
    });
}
