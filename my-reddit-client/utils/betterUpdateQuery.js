"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.betterUpdateQuery = void 0;
function betterUpdateQuery(cache, qi, result, fn) {
    return cache.updateQuery(qi, (data) => fn(result, data));
}
exports.betterUpdateQuery = betterUpdateQuery;
