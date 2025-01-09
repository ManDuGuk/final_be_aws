"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processArrayData = void 0;
const processArrayData = (data) => {
    return typeof data === 'string' ? data.split(',') : data || [];
};
exports.processArrayData = processArrayData;
