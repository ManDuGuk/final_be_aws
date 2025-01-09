"use strict";
/**
 * accessController.ts
 * 작성자: 조영우(chodevelop)
 * 작성일: 2024/11/20
 * 설명: JWT 토큰 정상 작동을 위한 테스트 /access 페이지입니다. 검증용 모듈이라 배포 단계에서는 삭제를 목표로 하고 있습니다.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAccess = exports.allAccess = void 0;
const allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};
exports.allAccess = allAccess;
const userAccess = (req, res) => {
    res.status(200).send("User Content.");
};
exports.userAccess = userAccess;
