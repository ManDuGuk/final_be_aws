"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../util/database");
// User 모델 정의
exports.User = database_1.sequelize.define('User', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: sequelize_1.DataTypes.STRING(255), // VARCHAR(255)
        allowNull: true, // 중복 허용
    },
    email: {
        type: sequelize_1.DataTypes.STRING(255), // VARCHAR(255)
        allowNull: false,
    },
    password: {
        type: sequelize_1.DataTypes.STRING(255), // VARCHAR(255)
        allowNull: false,
    },
    about_me: {
        type: sequelize_1.DataTypes.TEXT, // TEXT 타입
        allowNull: true,
    },
    profile_picture: {
        type: sequelize_1.DataTypes.STRING(1000),
        allowNull: true,
    },
    follow: {
        type: sequelize_1.DataTypes.JSON, // JSON 타입
        defaultValue: [], // 기본값 빈 배열
        allowNull: false,
    },
}, {
    timestamps: true, // Sequelize가 기본적으로 createdAt, updatedAt 관리
    createdAt: 'created_at', // DB에서 이름을 created_at으로 설정
    updatedAt: 'modified_at', // DB에서 이름을 modified_at으로 설정
    tableName: 'User', // 테이블 이름을 User로 설정
});
// 관계 설정
// User.hasMany(Message, { foreignKey: 'user_id', as: 'messages' });
