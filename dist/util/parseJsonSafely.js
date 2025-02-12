"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseInputData = void 0;
const parseInputData = (data) => {
    if (Array.isArray(data))
        return data; // 이미 배열이라면 그대로 반환
    if (typeof data === 'string') {
        try {
            return JSON.parse(data); // JSON 문자열이라면 파싱
        }
        catch (_a) {
            return [data]; // 단일 문자열이라면 배열로 변환
        }
    }
    return []; // 그 외의 경우 빈 배열 반환
};
exports.parseInputData = parseInputData;
