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
exports.closeRabbitMQ = exports.sendMsgToQueue = exports.initializeRabbitMQ = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
let connection = null;
let channel = null;
let isInitialized = false;
// RabbitMQ 초기화
const initializeRabbitMQ = () => __awaiter(void 0, void 0, void 0, function* () {
    if (isInitialized) {
        console.log("RabbitMQ is already initialized.");
        return;
    }
    try {
        connection = yield amqplib_1.default.connect(process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672");
        channel = yield connection.createChannel();
        yield channel.assertExchange("notifications_exchange", "fanout", { durable: true });
        isInitialized = true;
        console.log("RabbitMQ connection and channel initialized.");
    }
    catch (error) {
        console.error("Failed to initialize RabbitMQ:", error);
    }
});
exports.initializeRabbitMQ = initializeRabbitMQ;
// 메시지 전송
const sendMsgToQueue = (postInfo) => __awaiter(void 0, void 0, void 0, function* () {
    if (!channel) {
        console.error("RabbitMQ 채널이 초기화되지 않았습니다.");
        return;
    }
    try {
        channel.publish("notifications_exchange", "", Buffer.from(JSON.stringify(postInfo)), { persistent: true });
        console.log("프로듀서: 메시지 전송 완료.", postInfo);
    }
    catch (error) {
        console.error("메시지 보내기 실패:", error);
    }
});
exports.sendMsgToQueue = sendMsgToQueue;
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
