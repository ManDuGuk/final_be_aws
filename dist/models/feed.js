"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Feed = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../util/database");
// Feed 모델 정의
exports.Feed = database_1.sequelize.define('Feed', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    influencer_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false, // 반드시 필요한 필드
    },
    content: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true, // 선택적 필드
    },
    images: {
        type: sequelize_1.DataTypes.TEXT, // MySQL에서는 JSON 타입 사용
        allowNull: true,
        defaultValue: [], // 빈 배열로 초기화
    },
    products: {
        type: sequelize_1.DataTypes.TEXT, // MySQL에서는 JSON 타입 사용
        allowNull: true,
        defaultValue: [], // 빈 배열로 초기화
    },
    visibility_level: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0, // 기본값 설정
    },
    likes: {
        type: sequelize_1.DataTypes.TEXT, // MySQL에서는 JSON 타입 사용
        allowNull: true,
        defaultValue: '[]', // 기본값으로 빈 배열 설정
    },
}, {
    timestamps: true, // createdAt 및 updatedAt 자동 관리
    createdAt: 'created_at', // DB에서 생성 시간 필드 이름
    updatedAt: 'modified_at', // DB에서 수정 시간 필드 이름
    tableName: 'Feed', // 테이블 이름
});
