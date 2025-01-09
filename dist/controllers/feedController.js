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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminFeedGetAll = exports.FeedLikes = exports.FeedDelete = exports.FeedUpdate = exports.FeedWrite = exports.FeedGetById = void 0;
const multer_1 = __importDefault(require("multer"));
const feedService_1 = require("../services/feedService");
const dotenv_1 = __importDefault(require("dotenv"));
const uplode_1 = require("../util/uplode");
const feed_1 = require("../models/feed");
const parseJsonSafely_1 = require("../util/parseJsonSafely");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const producer_1 = require("../services/producer");
const user_1 = require("../models/user");
const influencer_1 = require("../models/influencer");
dotenv_1.default.config();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage }).fields([
    { name: 'productImgs', maxCount: 5 },
    { name: 'postImages', maxCount: 5 },
]);
const FeedGetById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id || isNaN(Number(id))) {
            res.status(400).json({ message: '유효하지 않은 피드 ID입니다.' });
            res.status(400).json({ message: '유효하지 않은 피드 ID입니다.' });
            return; // 명시적으로 반환
        }
        const feed = yield (0, feedService_1.getFeedById)(Number(id));
        if (!feed) {
            res.status(404).json({ message: '해당 피드가 없습니다.' });
            res.status(404).json({ message: '해당 피드가 없습니다.' });
            return;
        }
        res.status(200).json(feed); // 응답 후 반환 없음
    }
    catch (error) {
        console.error('FeedGet Error:', error);
        res.status(500).json({ error: '피드를 가져오는 중 오류가 발생했습니다.' });
    }
});
exports.FeedGetById = FeedGetById;
const FeedWrite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    upload(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.status(400).json({ error: '파일 업로드 실패' });
        }
        try {
            const { description, grade, productImgsLink, productImgsTitle } = req.body;
            const { productImgs, postImages } = req.files;
            const token = req.headers['authorization']; // 요청 헤더 출력
            // Bearer 부분 제거하고 실제 토큰만 가져오기
            const tokenWithoutBearer = token.split(' ')[1];
            // JWT 디코딩
            const decoded = jsonwebtoken_1.default.verify(tokenWithoutBearer, process.env.JWT_SECRET);
            const influencerId = decoded.influencerId;
            if (!influencerId) {
                return res.status(400).json({ error: '인플루언서가 아닙니다.' });
            }
            // 필수 파일 체크
            if (!postImages) {
                return res.status(400).json({ error: '필수 파일이 누락되었습니다.' });
            }
            // 파일들을 S3로 업로드하고 URL을 반환받음
            const thumbnailUrls = yield Promise.all(postImages.map(uplode_1.uploadToS3));
            const productImgUrls = yield Promise.all(productImgs.map(uplode_1.uploadToS3));
            // 피드 데이터 생성
            const feedData = {
                influencer_id: influencerId, // 예시로 influencer_id 5
                description,
                visibility_level: grade,
                images: thumbnailUrls, // S3 업로드된 이미지 URLs
                product: productImgUrls.map((img, index) => ({
                    img,
                    title: productImgsTitle[index] || '', // 제목은 없을 경우 빈 문자열
                    link: productImgsLink[index] || '', // 링크는 없을 경우 빈 문자열
                })),
                likes: '[]', // 초기값 빈 배열
            };
            // 데이터베이스에 피드 저장
            const savedFeed = yield (0, feedService_1.saveFeedToDB)(feedData);
            // rabbitMQ 큐에 메시지 전송하기 (feedid, content, influencerid)
            const feedId = savedFeed.dataValues.id;
            const postInfoMsg = {
                feedId,
                influencerId,
                message: description,
            };
            try {
                console.log('Sending message to RabbitMQ:', postInfoMsg);
                yield (0, producer_1.sendMsgToQueue)(postInfoMsg);
            }
            catch (error) {
                console.error('RabbitMQ 메시지 전송 실패:', error);
            }
            res.status(200).json({ message: '피드 등록완료하였습니다.' });
        }
        catch (error) {
            console.error('피드 등록 중 오류 발생:', error);
            res.status(500).json({ error: '업로드 실패' });
        }
    }));
});
exports.FeedWrite = FeedWrite;
// 피드 업데이트 함수
const FeedUpdate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    upload(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.status(400).json({ error: '파일 업로드 실패' });
        }
        try {
            const { id } = req.params;
            const { description, grade, productImgsLink, productImgsTitle } = req.body;
            const { postImages: existingPostImages, productImgs: existingProductImgs, } = req.body;
            const { postImages, productImgs } = req.files;
            if (!id) {
                return res.status(400).json({ error: '필수 데이터가 누락되었습니다.' });
            }
            const existingFeed = yield feed_1.Feed.findOne({ where: { id } });
            if (!existingFeed) {
                return res.status(404).json({ error: '피드를 찾을 수 없습니다.' });
            }
            // return console.log(existingFeed.dataValues, 'existingFeedexistingFeed');
            // 기존 데이터 안전하게 파싱
            const parsedExistingPostImages = (0, parseJsonSafely_1.parseInputData)(existingPostImages);
            const parsedExistingProductImgs = (0, parseJsonSafely_1.parseInputData)(existingProductImgs);
            const objProductImgs = parsedExistingProductImgs.map((img, index) => ({
                img,
                title: productImgsTitle[index],
                link: productImgsLink[index],
            }));
            // S3에 업로드된 이미지 URL 배열 가져오기
            const uploadedPostImages = postImages
                ? yield Promise.all(postImages.map(uplode_1.uploadToS3))
                : [];
            const uploadedProductImgs = productImgs
                ? yield Promise.all(productImgs.map(uplode_1.uploadToS3))
                : [];
            // 기존 데이터와 새 데이터를 병합
            const finalPostImages = [
                ...parsedExistingPostImages,
                ...uploadedPostImages,
            ];
            const finalProductImgs = [
                ...objProductImgs,
                ...uploadedProductImgs.map((img, index) => ({
                    img,
                    title: productImgsTitle
                        ? productImgsTitle[parsedExistingProductImgs.length + index] || ''
                        : '',
                    link: productImgsLink
                        ? productImgsLink[parsedExistingProductImgs.length + index] || ''
                        : '',
                })),
            ];
            // 데이터베이스 업데이트
            yield feed_1.Feed.update({
                content: description,
                visibility_level: grade,
                images: JSON.stringify(finalPostImages),
                products: JSON.stringify(finalProductImgs),
            }, { where: { id } });
            // 기존피드
            const existingFeedPost = JSON.parse(existingFeed.dataValues.images);
            const existingFeedProduct = JSON.parse(existingFeed.dataValues.products);
            // 분리
            const postImagesToDelete = existingFeedPost.filter((img) => !finalPostImages || !finalPostImages.some((item) => item === img));
            const productImgsToDelete = existingFeedProduct.filter((product) => !finalProductImgs ||
                !finalProductImgs.some((uploaded) => uploaded.img === product.img));
            // 삭제
            yield productImgsToDelete.map((item) => {
                return (0, uplode_1.deleteFromS3)(item.img);
            });
            yield postImagesToDelete.map((item) => {
                return (0, uplode_1.deleteFromS3)(item);
            });
            res.status(200).json({ message: '피드가 성공적으로 수정되었습니다.' });
        }
        catch (error) {
            console.error('피드 수정 실패:', error);
            res.status(500).json({ error: '피드 수정 실패' });
        }
    }));
});
exports.FeedUpdate = FeedUpdate;
// 핸들러 함수
const FeedDelete = (req, // req.params의 타입 정의
res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ error: 'ID가 제공되지 않았습니다.' });
            return;
        }
        const feed = yield (0, feedService_1.getFeedById)(Number(id));
        // console.log(feed, 'feedfeedfeed');
        console.log(JSON.parse(feed.products)
        // JSON.parse(feed.images) as string[]
        );
        const feedImgs = JSON.parse(feed.products);
        const products = JSON.parse(feed.images);
        yield products.map(uplode_1.deleteFromS3);
        yield feedImgs.map((item) => {
            return (0, uplode_1.deleteFromS3)(item.img);
        });
        const deletedCount = yield feed_1.Feed.destroy({ where: { id: Number(id) } });
        if (deletedCount === 0) {
            res.status(404).json({ error: '삭제할 피드를 찾을 수 없습니다.' });
            return;
        }
        res.status(200).json({ message: '피드가 성공적으로 삭제되었습니다.' });
    }
    catch (error) {
        console.error('피드 삭제 실패:', error);
        res.status(500).json({ error: '피드 삭제 중 문제가 발생했습니다.' });
    }
});
exports.FeedDelete = FeedDelete;
const FeedLikes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers['authorization']; // 요청 헤더 출력
        // Bearer 부분 제거하고 실제 토큰만 가져오기
        const tokenWithoutBearer = token.split(' ')[1];
        // JWT 디코딩
        const decoded = jsonwebtoken_1.default.verify(tokenWithoutBearer, process.env.JWT_SECRET);
        const userId = decoded.userId;
        const feedId = req.params.id;
        if (!userId || !feedId) {
            res.status(400).json({ message: 'Missing userId or feedId' });
            return;
        }
        // 데이터베이스에서 해당 게시글 조회
        const feed = yield feed_1.Feed.findByPk(Number(feedId));
        if (!feed) {
            res.status(404).json({ message: 'Feed not found' });
            return;
        }
        // 좋아요 배열 처리
        let likes = [];
        // likes를 가져오고 수정하는 방식
        const feedLikes = feed.get('likes');
        // 'likes'가 존재하고 문자열일 경우에만 JSON 파싱을 시도합니다.
        if (feedLikes) {
            if (typeof feedLikes === 'string') {
                try {
                    likes = JSON.parse(feedLikes); // 문자열을 배열로 변환
                    if (!Array.isArray(likes)) {
                        likes = []; // likes가 배열이 아닐 경우 빈 배열로 초기화
                    }
                }
                catch (error) {
                    console.error('Failed to parse likes:', error);
                    likes = []; // 파싱 실패 시 빈 배열로 초기화
                }
            }
            else if (Array.isArray(feedLikes)) {
                likes = feedLikes; // 'likes'가 이미 배열이면 그대로 할당
            }
            else {
                likes = []; // 그 외의 경우에는 빈 배열로 초기화
            }
        }
        console.log('Decoded:', userId);
        if (likes.includes(userId.toString())) {
            // 이미 좋아요한 경우, 제거
            likes = likes.filter((id) => id !== userId.toString());
        }
        else {
            // 좋아요 추가
            likes.push(userId.toString());
        }
        // 'likes' 배열을 JSON 문자열로 변환하여 저장
        feed.set('likes', JSON.stringify(likes));
        // 업데이트 후 저장
        yield feed.save();
        // 응답 반환
        res.status(200).json({
            message: 'Like status updated',
            // likes: JSON.parse(feed.get('likes') as string),
        });
    }
    catch (error) {
        console.error('FeedLikes Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.FeedLikes = FeedLikes;
// admin
const AdminFeedGetAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Feed 모델에서 모든 피드 조회, Influencer와 User 모델도 포함
        const feeds = yield feed_1.Feed.findAll({
            attributes: [
                'id',
                'influencer_id',
                'content',
                'images',
                'products',
                'visibility_level',
                'likes',
                'created_at',
                'modified_at',
            ],
            include: [
                {
                    model: influencer_1.Influencer,
                    as: 'influencer', // 관계 이름
                    include: [
                        {
                            model: user_1.User,
                            as: 'user', // 관계 이름
                            attributes: ['username'], // User 테이블에서 username만 가져오기
                        },
                    ],
                },
            ],
        });
        console.log(feeds, 'feeds');
        // 피드가 없다면 404 반환
        if (feeds.length === 0) {
            res.status(404).json({ message: '피드가 없습니다.' });
            return;
        }
        // 피드 목록을 반환, 각 피드에서 influencer의 username을 추출
        const parsedFeeds = feeds.map((feed) => {
            var _a, _b;
            const parsedFeed = feed.toJSON();
            return Object.assign(Object.assign({}, parsedFeed), { influencer: (_b = (_a = parsedFeed === null || parsedFeed === void 0 ? void 0 : parsedFeed.influencer) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.username });
        });
        res.status(200).json(parsedFeeds); // 변환된 피드 목록 반환
    }
    catch (error) {
        console.error('FeedGetAll Error:', error);
        res.status(500).json({
            message: '피드 ���록을 가져오는 중 오류가 발생했습니다.',
        });
    }
});
exports.AdminFeedGetAll = AdminFeedGetAll;
