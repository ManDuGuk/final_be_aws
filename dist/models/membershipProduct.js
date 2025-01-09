"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembershipProduct = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../util/database");
const influencer_1 = require("./influencer");
// MembershipProduct 클래스 정의
class MembershipProduct extends sequelize_1.Model {
}
exports.MembershipProduct = MembershipProduct;
// 모델 초기화
MembershipProduct.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    influencer_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    level: {
        type: sequelize_1.DataTypes.TINYINT,
        allowNull: false,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    price: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    benefits: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        get() {
            const rawValue = this.getDataValue("benefits");
            if (!rawValue || rawValue.trim() === "") {
                return [];
            }
            return rawValue
                .split(",")
                .map((b) => b.trim())
                .filter((b) => b !== "");
        },
        set(value) {
            if (Array.isArray(value)) {
                // 배열인 경우 비어있는 값 제거하고 쉼표로 구분된 문자열로 저장
                this.setDataValue("benefits", value.filter((b) => b.trim() !== "").join(","));
            }
            else if (typeof value === "string") {
                // 문자열인 경우 앞뒤 공백 제거
                this.setDataValue("benefits", value.trim());
            }
            else {
                this.setDataValue("benefits", null);
            }
        },
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    modified_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    is_active: {
        type: sequelize_1.DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1,
    }
}, {
    sequelize: database_1.sequelize,
    modelName: "MembershipProduct",
    tableName: "Membership_Product",
    timestamps: false, // createdAt, updatedAt 사용하지 않음
});
MembershipProduct.belongsTo(influencer_1.Influencer, {
    foreignKey: "influencer_id",
    as: "influencer",
});
influencer_1.Influencer.hasMany(MembershipProduct, {
    foreignKey: "influencer_id",
    as: "products",
});
