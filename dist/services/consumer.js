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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeRabbitMQ = exports.startConsumer = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
const dotenv_1 = __importDefault(require("dotenv"));
const notificationService_1 = require("./notificationService");
const socket_be_1 = require("../util/socket_be");
const socketState_1 = require("../util/socketState");
const userService_1 = require("./userService");
dotenv_1.default.config();
let connection = null;
let channel = null;
let isInitialized = false;
// RabbitMQ 컨슈머 초기화
const startConsumer = () => __awaiter(void 0, void 0, void 0, function* () {
    if (isInitialized) {
        console.log("RabbitMQ consumer is already initialized.");
        return;
    }
    try {
        console.log("Connecting to RabbitMQ...");
        connection = yield amqplib_1.default.connect(process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672");
        console.log("Connected to RabbitMQ.");
        console.log("Creating channel...");
        channel = yield connection.createChannel();
        console.log("Channel created.");
        yield channel.assertExchange("notifications_exchange", "fanout", { durable: true });
        const { queue: tempQueue } = yield channel.assertQueue("", { exclusive: true });
        yield channel.bindQueue(tempQueue, "notifications_exchange", "");
        console.log("RabbitMQ consumer started, waiting for messages...");
        channel.consume(tempQueue, (msg) => __awaiter(void 0, void 0, void 0, function* () {
            if (channel && msg) {
                try {
                    console.log("컨슈머: 메시지 수신.", msg.content.toString());
                    yield handleNotificationMessage(msg);
                    channel.ack(msg); // 메시지 처리 성공
                }
                catch (error) {
                    console.error("Failed to process message:", error);
                    channel.nack(msg, false, true); // 메시지 재처리
                }
            }
        }));
        isInitialized = true;
    }
    catch (error) {
        console.error("RabbitMQ consumer initialization failed:", error);
    }
});
exports.startConsumer = startConsumer;
// 메시지 처리
const handleNotificationMessage = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { feedId, influencerId, message } = JSON.parse(msg.content.toString());
        console.log("Received message from RabbitMQ:", { feedId, influencerId, message });
        const followers = yield (0, notificationService_1.getFollowersByInfluencerId)(influencerId);
        console.log("Followers fetched:", followers);
        yield saveNotifications(followers, feedId);
        yield sendNotifications(followers, influencerId, feedId);
        console.log("컨슈머: 메시지 처리 완료.", { feedId, influencerId, message });
    }
    catch (error) {
        console.error("Failed to process message:", error);
        throw error; // 재처리 또는 DLQ에 의존하는 시스템의 경우 필요
    }
});
// 알림 저장
const saveNotifications = (followers, feedId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, notificationService_1.saveNotification)(followers, feedId);
        if (result) {
            console.log(`${followers.length} notifications successfully saved.`);
        }
        else {
            console.log("테스트 발송이므로 알림이 저장되지 않았습니다.");
        }
    }
    catch (error) {
        console.error("Failed to save notifications:", error);
    }
});
// 알림 전송
const sendNotifications = (followers, influencerId, feedId) => __awaiter(void 0, void 0, void 0, function* () {
    const io = (0, socket_be_1.getSocketInstance)();
    console.log(`userSocketMap(전송 전): ${JSON.stringify([...socketState_1.userSocketMap])}`);
    if (!io) {
        console.error("Socket.IO instance not found.");
        return;
    }
    const influencer = yield (0, userService_1.getUserByInfluencerId)(influencerId);
    const influencerName = influencer.username || "Unknown";
    const connectedFollowers = followers.filter((followerId) => socketState_1.userSocketMap.has(followerId));
    console.log(`Connected followers: ${connectedFollowers.length}/${followers.length}`);
    connectedFollowers.forEach((followerId) => {
        const socketId = socketState_1.userSocketMap.get(followerId);
        if (socketId && io.sockets.sockets.get(socketId)) {
            io.to(socketId).emit("new_notification", {
                feedId,
                influencerId,
                influencerName,
                message: `Post ${feedId} by ${influencerName}`,
            });
            console.log(`Notification sent to follower ${followerId}, feed ${feedId}`);
        }
        else {
            console.log(`Socket not connected for follower ${followerId}`);
        }
    });
});
// RabbitMQ 연결 종료
const closeRabbitMQ = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (channel) {
            yield channel.close();
            console.log("RabbitMQ channel closed.");
        }
        if (connection) {
            yield connection.close();
            console.log("RabbitMQ connection closed.");
        }
    }
    catch (error) {
        console.error("Failed to close RabbitMQ connection:", error);
    }
});
exports.closeRabbitMQ = closeRabbitMQ;
