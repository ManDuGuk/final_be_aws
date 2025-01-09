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
exports.getSocketInstance = exports.initializeSocket = void 0;
const socket_io_1 = require("socket.io");
const producer_1 = require("../services/producer");
const socketState_1 = require("./socketState");
let io = null;
// RabbitMQ 초기화 플래그
let isRabbitMQInitialized = false;
// 소켓 초기화
const initializeSocket = (server) => {
    console.log("Initializing Socket.IO...");
    io = new socket_io_1.Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
    io.on("connection", handleConnection);
    console.log("Socket.IO initialized.");
    return io;
};
exports.initializeSocket = initializeSocket;
// 소켓 연결 핸들러
const handleConnection = (socket) => {
    console.log("Socket connected:", socket.id);
    // 사용자 등록 이벤트 처리
    socket.on("register", (userId, callback) => {
        registerUser(userId, socket);
        callback({ status: "ok", message: `User ${userId} registered successfully.` });
    });
    // 테스트 알림 이벤트
    socket.on("test_notification", (data) => __awaiter(void 0, void 0, void 0, function* () {
        yield handleTestNotification(data);
    }));
    // 연결 해제 이벤트 처리
    socket.on("disconnect", () => {
        handleDisconnection(socket);
    });
};
// 사용자 등록
const registerUser = (userId, socket) => {
    socketState_1.userSocketMap.set(userId, socket.id);
    socket.join(userId);
    console.log(`User ${userId} registered with socket ${socket.id}`);
    logUserSocketMap();
};
// 사용자 연결 해제
const handleDisconnection = (socket) => {
    socketState_1.userSocketMap.forEach((value, key) => {
        if (value === socket.id) {
            socketState_1.userSocketMap.delete(key);
            console.log(`User ${key} disconnected.`);
        }
    });
    logUserSocketMap();
};
// 테스트 알림 처리
const handleTestNotification = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // RabbitMQ 초기화: 중복 초기화 방지
        if (!isRabbitMQInitialized) {
            console.log("Initializing RabbitMQ...");
            yield (0, producer_1.initializeRabbitMQ)();
            isRabbitMQInitialized = true;
        }
        console.log("Sending test notification to RabbitMQ:", data);
        yield (0, producer_1.sendMsgToQueue)(data);
        console.log("Test notification sent to RabbitMQ.");
    }
    catch (error) {
        console.error("Failed to send test notification to RabbitMQ:", error);
    }
});
// 디버깅: userSocketMap 로그 출력
const logUserSocketMap = () => {
    console.log("Current userSocketMap:", JSON.stringify([...socketState_1.userSocketMap]));
};
// Socket.IO 인스턴스 반환
const getSocketInstance = () => io;
exports.getSocketInstance = getSocketInstance;
