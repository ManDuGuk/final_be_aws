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
exports.deleteFromS3 = exports.uploadToS3 = void 0;
// 업로드 함수
// import { S3 } from 'aws-sdk'; // docker 설정을 위해 AWS -> AWS.S3 모듈 할당 형식으로 변경
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const S3 = aws_sdk_1.default.S3;
const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});
const uploadToS3 = (file) => __awaiter(void 0, void 0, void 0, function* () {
    const fileName = encodeURIComponent(file.originalname);
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${process.env.AWS_BUCKET_FOLDER_NAME}/${Date.now()}-${fileName}`,
        Body: file.buffer,
        ContentType: file.mimetype,
    };
    const { Location } = yield s3.upload(params).promise();
    return Location;
});
exports.uploadToS3 = uploadToS3;
const deleteFromS3 = (key) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key, // S3에서 삭제할 파일의 Key
        };
        yield s3.deleteObject(params).promise();
        console.log(`File deleted successfully: ${key}`);
    }
    catch (error) {
        console.error(`S3 Delete Error: ${error.message}`);
        throw new Error("Failed to delete file from S3");
    }
});
exports.deleteFromS3 = deleteFromS3;
