"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUrqlClient = void 0;
const urql_1 = require("urql");
const exchange_graphcache_1 = require("@urql/exchange-graphcache");
const graphql_1 = require("../src/generated/graphql");
const betterUpdateQuery_1 = require("./betterUpdateQuery");
const createUrqlClient = (ssrExchange) => ({
    url: "http://localhost:4002/graphql",
    fetchOptions: {
        credentials: "include",
        headers: {
            "x-forwarded-proto": "https",
        },
    },
    exchanges: [
        urql_1.dedupExchange,
        (0, exchange_graphcache_1.cacheExchange)({
            updates: {
                Mutation: {
                    logout: (_result, args, cache, info) => {
                        //delete the cache, when user logs out
                        (0, betterUpdateQuery_1.betterUpdateQuery)(cache, { query: graphql_1.MeDocument }, _result, () => ({ me: null }));
                    },
                    login: (_result, args, cache, info) => {
                        (0, betterUpdateQuery_1.betterUpdateQuery)(cache, { query: graphql_1.MeDocument }, _result, (result, query) => {
                            if (result.login.errors) {
                                return query;
                            }
                            else {
                                return {
                                    me: result.login.user,
                                };
                            }
                        });
                    },
                    register: (_result, args, cache, info) => {
                        (0, betterUpdateQuery_1.betterUpdateQuery)(cache, { query: graphql_1.MeDocument }, _result, (result, query) => {
                            if (result.register.errors) {
                                return query;
                            }
                            else {
                                return {
                                    me: result.register.user,
                                };
                            }
                        });
                    },
                },
            },
        }),
        ssrExchange,
        urql_1.fetchExchange,
    ],
});
exports.createUrqlClient = createUrqlClient;
