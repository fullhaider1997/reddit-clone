import { MikroORM } from "@mikro-orm/core";
import { type } from "os";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import microConfig from "./mikro-orm.config.js";
import express from "express";
import { PostgreSqlConnection } from "@mikro-orm/postgresql";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import "reflect-metadata";
import { HelloResolver } from "./resolvers/resolvers";
import { PostResolver } from "./resolvers/post";
import { userResolver } from "./resolvers/user";
import session from "express-session";
import { createClient } from "redis";
import { connect } from "http2";
import connectRedis from "connect-redis";

const cors = require("cors");
import Redis from "ioredis";

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  await orm.getMigrator().up();
  const emFork = orm.em.fork();

  const generator = orm.getSchemaGenerator();
  await generator.updateSchema();

  const cors_options = {
    credentials: true,
    origin: "https://studio.apollographql.com",
  };

  const app = express();
  app.set("trust proxy", true);

  const RedisStore = connectRedis(session);
  const redis = new Redis("127.0.0.1:6379");
  const redisClient = createClient();

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

  app.use(
    session({
      name: "qid",
      store: new RedisStore({ client: redis as any, disableTouch: true }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        secure: true,
        sameSite: "none",
      },

      saveUninitialized: false,
      secret: "sdsdsd32323kmk2jksjdksd23",
      resave: false,
    })
  );

  //context is is something that  can that shared among all your resolvers, queries, mutations such as database connection, authentication information
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [userResolver, HelloResolver, PostResolver],
      validate: false,
    }),

    csrfPrevention: true,
    cache: "bounded",

    //plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: ({ req, res }) => ({ fork: emFork, redis: redis, req }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, cors: cors_options });

  app.listen(4002, () => {
    console.log(" server running on localhost:4002");
  });
};

console.log("hello world");
console.log("hello wordl 2");

main().catch((err) => {
  console.log(err);
});
