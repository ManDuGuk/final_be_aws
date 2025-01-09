"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
// models/comment.ts
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../util/database"));
class Comment extends sequelize_1.Model {
}
exports.Comment = Comment;
Comment.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    post_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    parent_comment_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    content: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    hidden_yn: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    // created_at: {
    //   type: DataTypes.DATE,
    //   defaultValue: DataTypes.NOW,
    // },
    // modified_at: {
    //   type: DataTypes.DATE,
    //   defaultValue: DataTypes.NOW,
    // }
}, {
    sequelize: database_1.default,
    createdAt: 'created_at', // DB에서 생성 시간 필드 이름
    updatedAt: 'modified_at', // DB에서 수정 시간 필드 이름, modelName: 'Comment'}
    tableName: "Comment",
    timestamps: true,
});
