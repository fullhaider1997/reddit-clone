"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toErrorMap = void 0;
const toErrorMap = (errors) => {
    const errorMap = {};
    errors.forEach(({ field, message }) => {
        errorMap[field] = message;
    });
    return errorMap;
};
exports.toErrorMap = toErrorMap;
