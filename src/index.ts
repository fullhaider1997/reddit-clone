import { MikroORM } from "@mikro-orm/core";
import { type } from "os";
import { __prod__ } from "./constants/constants";
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
import { DataSource } from "typeorm";
const cors = require("cors");
import Redis from "ioredis";
import { sendEmail } from "./utils/sendEmails";
import { User } from "./entities/Users";
import { AppDataSource } from "./data-source";

const main = async () => {
  AppDataSource.initialize()
    .then(async () => {
      // here you can start to work with your database
      console.log("init database");
    })
    .catch((error) => console.log(error));

  sendEmail("haideralhafiz@gmail.cm", "hello");
  //const orm = await MikroORM.init(microConfig);

  // orm.em.nativeDelete(User, {});
  // await orm.getMigrator().up();
  // const emFork = orm.em.fork();

  // const generator = orm.getSchemaGenerator();
  // await generator.updateSchema();

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
      name: "please-save",
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
    context: ({ req, res }) => ({ redis: redis, req, res }),
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
