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
exports.deleteImg = exports.toggleProductStatus = exports.deleteMembershipProducts = exports.createMembershipProducts = exports.updateMembershipProducts = exports.getMembershipProducts = exports.getMembershipProductsByInfluencerId = void 0;
const membershipProductService_1 = require("../services/membershipProductService");
// 인플루언서의 멤버십 상품 가져오기(인플루언서 아이디로)
const getMembershipProductsByInfluencerId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { influencerId } = req.params;
    try {
        const products = yield (0, membershipProductService_1.getProductsByInfluencerId)(Number(influencerId));
        if (products.length === 0) {
            res.status(404).json({ error: "No membership products found" });
            return;
        }
        res.status(200).json(products);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch membership products" });
    }
});
exports.getMembershipProductsByInfluencerId = getMembershipProductsByInfluencerId;
// 인플루언서의 멤버십 상품 가져오기(유저 아이디로)
const getMembershipProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const products = yield (0, membershipProductService_1.getProductsByUserId)(Number(userId));
        if (products.length === 0) {
            res.status(404).json({ error: "No membership products found" });
            return;
        }
        res.status(200).json(products);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch membership products" });
    }
});
exports.getMembershipProducts = getMembershipProducts;
const updateMembershipProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.productId;
    const updateData = req.body;
    if (Array.isArray(updateData.benefits)) {
        updateData.benefits = updateData.benefits.join(",");
    }
    try {
        const updatedMembership = yield (0, membershipProductService_1.updateMembership)(Number(id), updateData, req.file);
        if (!updatedMembership) {
            res.status(404).json({ error: "Membership not found" });
            return;
        }
        res.status(200).json(updatedMembership);
    }
    catch (error) {
        console.error("Error updating membership:", error);
        res.status(500).json({ error: "Failed to update membership" });
    }
});
exports.updateMembershipProducts = updateMembershipProducts;
const createMembershipProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const productData = {
        influencerId: req.body.influencer_id,
        level: req.body.level,
        name: req.body.name,
        price: req.body.price,
        benefits: req.body.benefits,
    };
    const image = (_a = req.file) !== null && _a !== void 0 ? _a : null;
    try {
        const newProduct = yield (0, membershipProductService_1.createMembershipProduct)(productData, image);
        res.status(201).json(newProduct);
    }
    catch (error) {
        console.error("Error creating membership product:", error);
        res.status(500).json({ error: "Failed to create membership product" });
    }
});
exports.createMembershipProducts = createMembershipProducts;
// 멤버십 상품 삭제
const deleteMembershipProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    try {
        yield (0, membershipProductService_1.deleteMembershipProduct)(Number(productId));
        res.status(204).send();
    }
    catch (error) {
        console.error("Error deleting membership product:", error);
        res.status(500).json({ error: "Failed to delete membership product" });
    }
});
exports.deleteMembershipProducts = deleteMembershipProducts;
const toggleProductStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.productId;
    try {
        const updatedProduct = yield (0, membershipProductService_1.productStatusToggle)(Number(productId));
        res.status(200).json(updatedProduct);
    }
    catch (error) {
        console.error("Error toggling product status:", error);
        res.status(500).json({ error: "Failed to toggle product status" });
    }
});
exports.toggleProductStatus = toggleProductStatus;
const deleteImg = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, imageUrl } = req.body;
    console.log(req.body);
    if (!productId || !imageUrl) {
        res.status(400).json({ message: "Product ID and Image URL are required" });
        return;
    }
    try {
        // 서비스 호출
        yield (0, membershipProductService_1.deleteMembershipImg)(productId, imageUrl);
        res.status(200).json({ message: "Image deleted successfully" });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete image" });
        return;
    }
});
exports.deleteImg = deleteImg;
