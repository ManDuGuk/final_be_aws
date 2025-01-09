"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
// 메시지
const sequelize_1 = require("sequelize");
const database_1 = require("../util/database");
const user_1 = require("./user");
const influencer_1 = require("./influencer");
exports.Message = database_1.sequelize.define('Message', {
    room_id: { type: sequelize_1.DataTypes.INTEGER },
    user_id: { type: sequelize_1.DataTypes.INTEGER },
    message_content: { type: sequelize_1.DataTypes.STRING(1000) }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    tableName: 'Message',
});
// 관계 설정은 한쪽에서만 해주면 되고, 조인을 거는 쪽에서 해줘야한다.
exports.Message.belongsTo(user_1.User, { foreignKey: 'user_id', as: 'user' });
exports.Message.belongsTo(influencer_1.Influencer, { foreignKey: 'user_id', as: 'influencer' });
// Message.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
// User.hasMany(Message, { foreignKey: 'user_id', as: 'messages' });
