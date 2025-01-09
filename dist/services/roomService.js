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
exports.getInfluencerDetails = void 0;
const influencer_1 = require("../models/influencer");
const user_1 = require("../models/user");
//구독하고 있는 멤버쉽 id로 인플루언서의 상세정보를 얻어옴
const getInfluencerDetails = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const influencerDetails = yield influencer_1.Influencer.findOne({
            where: { id: Number(id) }, // WHERE 조건
            include: [
                {
                    model: user_1.User, // User 모델과 조인
                    attributes: ["profile_picture", "username", "about_me"], // 필요한 컬럼만 가져오기
                },
            ],
        });
        if (!influencerDetails) {
            return;
        }
        return (influencerDetails); // 성공적으로 데이터 반환
    }
    catch (error) {
        console.error("Error fetching influencer details:", error.message);
    }
});
exports.getInfluencerDetails = getInfluencerDetails;
