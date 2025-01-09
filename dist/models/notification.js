"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../util/database"); // Sequelize 인스턴스 가져오기
const user_1 = require("./user");
const feed_1 = require("./feed");
class Notification extends sequelize_1.Model {
}
exports.Notification = Notification;
// 모델 초기화
Notification.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    feed_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    is_read: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    updated_at: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
        onUpdate: "SET DEFAULT",
    },
}, {
    sequelize: database_1.sequelize,
    modelName: "Notification",
    tableName: "Notifications",
    timestamps: false, // created_at, updated_at을 수동 관리
});
Notification.belongsTo(user_1.User, { foreignKey: "user_id", as: "user" });
Notification.belongsTo(feed_1.Feed, { foreignKey: "feed_id", as: "feed" });
