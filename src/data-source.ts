import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/Users";
import { LoginResponse } from "./entities/LoginResponse";
import { Post } from "./entities/Post";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "6F@pc1*R",
  database: "haider",
  synchronize: true, //create table automatically without migration
  logging: true,
  entities: [User, LoginResponse, Post],
});
