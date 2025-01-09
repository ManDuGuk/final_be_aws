"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
//채팅방 모델
const sequelize_1 = require("sequelize");
const database_1 = require("../util/database");
exports.Room = database_1.sequelize.define('Room', {
    room_name: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    influencer_id: { type: sequelize_1.DataTypes.INTEGER },
    visibility_level: {
        type: sequelize_1.DataTypes.TINYINT,
        defaultValue: 1,
    },
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'Room',
});
