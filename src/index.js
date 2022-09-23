"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@mikro-orm/core");
const mikro_orm_config_js_1 = __importDefault(require("./mikro-orm.config.js"));
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
require("reflect-metadata");
const resolvers_1 = require("./resolvers/resolvers");
const post_1 = require("./resolvers/post");
const user_1 = require("./resolvers/user");
const express_session_1 = __importDefault(require("express-session"));
const redis_1 = require("redis");
const connect_redis_1 = __importDefault(require("connect-redis"));
const cors = require("cors");
const ioredis_1 = __importDefault(require("ioredis"));
const main = async () => {
    // sendEmail("haideralhafiz@gmail.cm", "hello");
    const orm = await core_1.MikroORM.init(mikro_orm_config_js_1.default);
    // orm.em.nativeDelete(User, {});
    // await orm.getMigrator().up();
    const emFork = orm.em.fork();
    const generator = orm.getSchemaGenerator();
    await generator.updateSchema();
    const app = (0, express_1.default)();
    app.set("trust proxy", true);
    const RedisStore = (0, connect_redis_1.default)(express_session_1.default);
    const redis = new ioredis_1.default("127.0.0.1:6379");
    const redisClient = (0, redis_1.createClient)();
    await redis.connect().catch(console.error);
    console.log(redis.status);
    redis.on("connect", function () {
        console.log("redis is connected");
    });
    let response = await redis.ping();
    await redis.set("redis", "haider");
    const value = await redis.get("redis");
    console.log({ value });
    console.log({ response });
    app.use((0, express_session_1.default)({
        name: "please-save",
        store: new RedisStore({ client: redis, disableTouch: true }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
            httpOnly: true,
            secure: true,
            sameSite: "none",
        },
        saveUninitialized: false,
        secret: "sdsdsd32323kmk2jksjdksd23",
        resave: false,
    }));
    //context is is something that  can that shared among all your resolvers, queries, mutations such as database connection, authentication information
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: await (0, type_graphql_1.buildSchema)({
            resolvers: [user_1.userResolver, resolvers_1.HelloResolver, post_1.PostResolver],
            validate: false,
        }),
        csrfPrevention: true,
        cache: "bounded",
        //plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
        context: ({ req, res }) => ({ fork: emFork, redis: redis, req, res }),
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({
        app,
        cors: {
            credentials: true,
            origin: ["https://studio.apollographql.com", "http://localhost:3000"],
        },
    });
    app.listen(4002, () => {
        console.log(" server running on localhost:4002");
    });
};
console.log("hello world");
console.log("hello wordl 2");
main().catch((err) => {
    console.log(err);
});
