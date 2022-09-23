"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants/constants");
const Post_1 = require("./entities/Post");
const path_1 = __importDefault(require("path"));
const Users_1 = require("./entities/Users");
console.log({ __dirname });
exports.default = {
    migrations: {
        path: path_1.default.join(__dirname, "./migrations"),
        pattern: /^[\w]+\d+\.[tj]s$/,
    },
    entities: [Post_1.Post, Users_1.User],
    dbName: "haider",
    host: "localhost",
    port: 5432,
    type: "postgresql",
    password: "6F@pc1*R",
    debug: !constants_1.__prod__,
};
