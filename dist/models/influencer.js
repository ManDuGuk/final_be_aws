"use strict";
// influencer.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.Influencer = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../util/database");
const user_1 = require("./user"); // User 모델 가져오기
// Influencer 모델 정의
class Influencer extends sequelize_1.Model {
}
exports.Influencer = Influencer;
Influencer.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: user_1.User,
            key: "id",
        },
        onDelete: "CASCADE",
    },
    follower: {
        type: sequelize_1.DataTypes.STRING(255),
        defaultValue: "[]",
        allowNull: false,
    },
    banner_picture: {
        type: sequelize_1.DataTypes.STRING(1000),
        allowNull: true,
    },
    category: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    modified_at: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: database_1.sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: "Influencer",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "modified_at",
});
// User와의 관계 설정 (1:1 관계)
user_1.User.hasOne(Influencer, { foreignKey: "user_id", onDelete: "CASCADE" });
Influencer.belongsTo(user_1.User, { foreignKey: "user_id" });
