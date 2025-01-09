"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
// Sequelize 인스턴스 생성
exports.sequelize = new sequelize_1.Sequelize(process.env.DB_NAME, process.env.DB_ID, process.env.DB_PW, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: 3306,
    pool: {
        max: 10, // 최대 연결 수
        min: 0, // 최소 연결 수
        acquire: 30000, // 연결이 유효한지 확인하는 최대 시간 (ms)
        idle: 10000, // 유휴 연결이 끊어지기 전 대기 시간 (ms)
    },
    dialectOptions: {
    // 필요한 경우 MySQL 옵션 추가
    },
    logging: process.env.DB_LOGGING === 'true' ? true : false // 콘솔에 SQL 쿼리를 보여줄지 여부
});
// module.exports = sequelize; // docker 설정을 위해 ESM 형식으로 변경
exports.default = exports.sequelize;
