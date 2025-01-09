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
exports.deleteMembershipImg = exports.productStatusToggle = exports.updateMembership = exports.getProductsByUserId = exports.getProductsByInfluencerId = exports.deleteMembershipProduct = exports.createMembershipProduct = void 0;
const influencer_1 = require("../models/influencer");
const membershipProduct_1 = require("../models/membershipProduct");
const uplode_1 = require("../util/uplode");
const createMembershipProduct = (data, file) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let imageUrl = null;
        if (file) {
            imageUrl = yield (0, uplode_1.uploadToS3)(file);
        }
        const product = yield membershipProduct_1.MembershipProduct.create({
            influencer_id: data.influencerId,
            name: data.name,
            price: data.price,
            benefits: data.benefits.join(","),
            level: data.level,
            image: imageUrl,
        });
        return product;
    }
    catch (error) {
        console.error("Error creating membership product:", error);
        throw new Error("Failed to create membership product");
    }
});
exports.createMembershipProduct = createMembershipProduct;
const deleteMembershipProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield membershipProduct_1.MembershipProduct.findByPk(id);
        if (!product)
            throw new Error("Membership product not found");
        yield product.destroy();
    }
    catch (error) {
        console.error("Error deleting membership product:", error);
        throw new Error("Failed to delete membership product");
    }
});
exports.deleteMembershipProduct = deleteMembershipProduct;
const getProductsByInfluencerId = (influencerId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield membershipProduct_1.MembershipProduct.findAll({
            where: { influencer_id: influencerId },
            raw: true,
        });
        if (products.length === 0) {
            console.error(`Membership products not found for influencerId: ${influencerId}`);
            throw new Error("Membership products not found for this influencer");
        }
        return products;
    }
    catch (error) {
        console.error("Error fetching membership products:", error);
        throw new Error("Failed to fetch membership products");
    }
});
exports.getProductsByInfluencerId = getProductsByInfluencerId;
const getProductsByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // userId로 Influencer를 찾음
        const influencer = yield influencer_1.Influencer.findOne({
            where: { user_id: userId },
            attributes: ["id"], // 필요한 id만 가져옴
            raw: true, // raw: true 사용
        });
        // Influencer가 없을 경우 처리
        if (!influencer) {
            console.error(`Influencer not found for userId: ${userId}`);
            throw new Error("Influencer not found for this user");
        }
        // Influencer ID를 기반으로 MembershipProduct 조회
        const products = yield membershipProduct_1.MembershipProduct.findAll({
            where: { influencer_id: influencer.id }, // 필터링
            order: [["level", "ASC"]],
            raw: true,
        });
        // benefits를 배열로 변환
        return products.map((product) => {
            const rawBenefits = product.benefits || ""; // 직접 benefits 접근
            const currentBenefits = (rawBenefits === null || rawBenefits === void 0 ? void 0 : rawBenefits.trim()) !== ""
                ? rawBenefits.split(",").map((b) => b.trim())
                : [];
            return {
                id: product.id,
                name: product.name,
                price: product.price,
                level: product.level,
                benefits: currentBenefits,
                influencer_id: influencer.id,
                image: product.image || null,
                is_active: product.is_active,
            };
        });
    }
    catch (error) {
        console.error("Error fetching membership products:", error.message);
        throw new Error("Failed to fetch membership products");
    }
});
exports.getProductsByUserId = getProductsByUserId;
const updateMembership = (id, updateData, file) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const membership = yield membershipProduct_1.MembershipProduct.findByPk(id);
        if (!membership)
            return null;
        if (file) {
            const imageUrl = yield (0, uplode_1.uploadToS3)(file);
            updateData.image = imageUrl;
        }
        yield membership.update(updateData);
        return membership;
    }
    catch (error) {
        console.error("Error in replaceMembership service:", error);
        throw new Error("Failed to replace membership");
    }
});
exports.updateMembership = updateMembership;
const productStatusToggle = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield membershipProduct_1.MembershipProduct.findByPk(productId);
        if (!product)
            throw new Error("Membership product not found");
        // 현재 상태 가져오기
        const currentStatus = product.getDataValue("is_active");
        const newStatus = currentStatus === 0 ? 1 : 0;
        // 상태 업데이트
        yield product.update({ is_active: newStatus });
        yield product.reload(); // 갱신된 값 가져오기
        console.log("Updated is_active:", product.getDataValue("is_active"));
        // 갱신된 상태 반환
        return product.getDataValue("is_active");
    }
    catch (error) {
        console.error("Error toggling product status:", error);
        throw new Error("Failed to toggle product status");
    }
});
exports.productStatusToggle = productStatusToggle;
const deleteMembershipImg = (productId, imageUrl) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, uplode_1.deleteFromS3)(imageUrl);
    yield membershipProduct_1.MembershipProduct.update({
        image: null,
    }, { where: { id: productId } });
});
exports.deleteMembershipImg = deleteMembershipImg;
