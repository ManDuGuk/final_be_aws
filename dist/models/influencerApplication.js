"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfluencerApplication = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../util/database");
const user_1 = require("./user");
class InfluencerApplication extends sequelize_1.Model {
}
exports.InfluencerApplication = InfluencerApplication;
InfluencerApplication.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    category: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    reason: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM("pending", "approved", "rejected"),
        defaultValue: "pending",
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    reviewed_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    reviewed_by: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    banner_picture: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: "InfluencerApplication",
    timestamps: false,
});
// User와의 관계 설정 (1:1 관계)
user_1.User.hasOne(InfluencerApplication, { foreignKey: "user_id", onDelete: "CASCADE" });
InfluencerApplication.belongsTo(user_1.User, { foreignKey: "user_id" });
