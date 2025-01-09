"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubscriptions = exports.subscribeMembership = exports.getMembershipProducts = void 0;
const membershipProduct_1 = require("../models/membershipProduct");
const membership_1 = require("../models/membership");
const getMembershipProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { influencerId } = req.params;
    try {
        // 해당 인플루언서의 모든 멤버십 상품 가져오기
        const products = yield membershipProduct_1.MembershipProduct.findAll({
            where: { influencer_id: influencerId },
        });
        if (products.length === 0) {
            res.status(404).json({ error: "No membership products found" });
            return;
        }
        res.status(200).json(products);
    }
    catch (error) {
        console.error("Error fetching membership products:", error.message);
        res.status(500).json({ error: "Failed to fetch membership products" });
    }
});
exports.getMembershipProducts = getMembershipProducts;
const subscribeMembership = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id: userId, product_id: productId } = req.body;
    if (!userId || !productId) {
        res.status(400).json({ success: false, message: "Invalid input" });
        return;
    }
    try {
        // 상품 유효성 확인
        const product = yield membershipProduct_1.MembershipProduct.findByPk(productId);
        if (!product) {
            res.status(404).json({
                success: false,
                message: "Membership product not found",
            });
            return;
        }
        // 현재 활성화된 구독을 확인
        const activeSubscription = yield membership_1.Membership.findOne({
            where: {
                user_id: userId,
                status: "active",
            },
        });
        if (activeSubscription) {
            console.log("Subscription ID:", activeSubscription.get("id"));
            console.log("Subscription Status:", activeSubscription.get("status"));
            // 상태 업데이트
            activeSubscription.set("status", "inactive");
            yield activeSubscription.save();
            console.log("Updated Subscription:", activeSubscription.toJSON());
        }
        // 새 구독 생성
        const newSubscription = yield membership_1.Membership.create({
            user_id: userId,
            product_id: productId,
            start_date: new Date(),
            status: "active",
        });
        res.status(201).json({
            success: true,
            message: activeSubscription
                ? "Subscription updated successfully"
                : "Subscription created successfully",
            data: newSubscription,
        });
    }
    catch (error) {
        console.error("Error subscribing to membership:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
exports.subscribeMembership = subscribeMembership;
const getSubscriptions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    console.log("User ID:", userId);
    if (!userId) {
        res.status(400).json({ success: false, message: "User ID is required" });
        return;
    }
    try {
        // 특정 사용자의 구독 정보 조회
        const subscriptions = yield membership_1.Membership.findAll({
            where: { user_id: userId, status: "active" }, // 활성 상태 구독만 조회
            include: [
                {
                    model: membershipProduct_1.MembershipProduct,
                    as: "product",
                    attributes: ["id", "name", "price", "benefits", "influencer_id"],
                },
            ],
        });
        // console.log("Subscriptions:", subscriptions);
        // 클라이언트에게 반환
        res.status(200).json(subscriptions);
    }
    catch (error) {
        console.error("Error fetching subscriptions:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
exports.getSubscriptions = getSubscriptions;
