"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../util/database"); // Sequelize 인스턴스 가져오기
const user_1 = require("./user");
const membershipProduct_1 = require("./membershipProduct");
class Payment extends sequelize_1.Model {
}
Payment.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    order_id: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    product_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    order_name: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    amount: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    payment_method: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
    },
    approved_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: database_1.sequelize,
    modelName: "Payment",
    tableName: "Payment",
    timestamps: false, // created_at을 직접 정의하므로 Sequelize의 기본 타임스탬프 비활성화
});
// Foreign Key 관계 설정
Payment.belongsTo(user_1.User, { foreignKey: "user_id" });
Payment.belongsTo(membershipProduct_1.MembershipProduct, { foreignKey: "product_id" });
exports.default = Payment;
