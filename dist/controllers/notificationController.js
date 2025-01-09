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
exports.deleteNotification = exports.getNotifications = void 0;
const notificationService_1 = require("../services/notificationService");
const getNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const notifications = yield (0, notificationService_1.getNotificationsByUserId)(Number(userId));
        res.status(200).json({ success: true, data: notifications });
    }
    catch (error) {
        console.error("알림 조회 중 오류:", error);
        res.status(500).json({ success: false, message: "알림 조회 실패" });
    }
});
exports.getNotifications = getNotifications;
const deleteNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { notificationId } = req.params;
        try {
            yield (0, notificationService_1.deleteNotificationById)(Number(notificationId));
            res.status(200).json({ success: true, message: "알림이 삭제됐습니다." });
        }
        catch (error) {
            console.error("알림 삭제 중 오류:", error);
            res.status(500).json({ success: false, message: "알림 삭제 실패" });
        }
    }
    catch (error) { }
});
exports.deleteNotification = deleteNotification;
