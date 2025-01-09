"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const database_1 = require("../util/database");
const user_1 = require("./user");
const influencer_1 = require("./influencer");
const feed_1 = require("./feed");
const membership_1 = require("./membership");
const membershipProduct_1 = require("./membershipProduct");
const comment_1 = require("./comment");
const notification_1 = require("./notification");
const Payment_1 = __importDefault(require("./Payment"));
// 관계 설정에서 alias가 'influencer'로 설정되었는지 확인
influencer_1.Influencer.hasMany(feed_1.Feed, { foreignKey: "influencer_id", as: "feed" });
feed_1.Feed.belongsTo(influencer_1.Influencer, { foreignKey: "influencer_id", as: "influencer" });
// User와 Influencer 간 관계에서 alias 'user'가 설정되어 있는지 확인
user_1.User.hasOne(influencer_1.Influencer, { foreignKey: "user_id", as: "influencer" });
influencer_1.Influencer.belongsTo(user_1.User, { foreignKey: "user_id", as: "user" });
membership_1.Membership.belongsTo(membershipProduct_1.MembershipProduct, {
    as: "product",
    foreignKey: "product_id",
});
membershipProduct_1.MembershipProduct.hasMany(membership_1.Membership, {
    foreignKey: "product_id",
});
// Feed와 Comment 간 관계 설정
comment_1.Comment.belongsTo(user_1.User, { foreignKey: "user_id" });
user_1.User.hasMany(comment_1.Comment, { foreignKey: "user_id" });
// Notification 관계 설정
notification_1.Notification.belongsTo(user_1.User, { foreignKey: "user_id", as: "noti_user" });
user_1.User.hasMany(notification_1.Notification, { foreignKey: "user_id", as: "notification" });
notification_1.Notification.belongsTo(feed_1.Feed, { foreignKey: "feed_id", as: "noti_feed" });
feed_1.Feed.hasMany(notification_1.Notification, { foreignKey: "feed_id", as: "notification" });
// Export하는 객체
exports.db = {
    Comment: comment_1.Comment,
    Feed: feed_1.Feed,
    sequelize: database_1.sequelize,
    User: user_1.User,
    Influencer: influencer_1.Influencer,
    Membership: membership_1.Membership,
    MembershipProduct: membershipProduct_1.MembershipProduct,
    Notification: notification_1.Notification,
    Payment: Payment_1.default,
};
