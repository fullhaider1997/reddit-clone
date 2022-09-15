import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";
import path from "path";
import { User } from "./entities/Users";

console.log({ __dirname });
export default {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w]+\d+\.[tj]s$/,
  },
  entities: [Post, User],
  dbName: "haider",
  host: "localhost",
  port: 5432,
  type: "postgresql",
  password: "6F@pc1*R",

  debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];
