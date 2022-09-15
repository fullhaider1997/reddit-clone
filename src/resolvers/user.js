"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userResolver = void 0;
const type_graphql_1 = require("type-graphql");
const Users_1 = require("../entities/Users");
const argon2_1 = __importDefault(require("argon2"));
let UsernamePasswordInput = class UsernamePasswordInput {
};
__decorate([
    (0, type_graphql_1.Field)(() => String)
], UsernamePasswordInput.prototype, "username", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String)
], UsernamePasswordInput.prototype, "password", void 0);
UsernamePasswordInput = __decorate([
    (0, type_graphql_1.InputType)()
], UsernamePasswordInput);
let FieldError = class FieldError {
};
__decorate([
    (0, type_graphql_1.Field)(() => String)
], FieldError.prototype, "field", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String)
], FieldError.prototype, "message", void 0);
FieldError = __decorate([
    (0, type_graphql_1.ObjectType)()
], FieldError);
let UserResponse = class UserResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [FieldError], { nullable: true })
], UserResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Users_1.User, { nullable: true })
], UserResponse.prototype, "user", void 0);
UserResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], UserResponse);
let userResolver = class userResolver {
    hellofromnew() {
        return "hello world";
    }
    hellofromuser() {
        return "hello world";
    }
    async meme({ fork, req }) {
        console.log("checking session: me");
        console.log(req.session);
        if (!req.session.userId) {
            return null;
        }
        const user = await fork.findOne(Users_1.User, { _id: req.session.userId });
        return user;
    }
    users({ fork }) {
        return fork.find(Users_1.User, {});
    }
    async register(options, { fork, req }) {
        const check = await fork.find(Users_1.User, { username: options.username });
        if (!check) {
            return {
                errors: [
                    {
                        field: "username",
                        message: "Username is already taken.",
                    },
                ],
            };
        }
        if (options.username.length <= 2) {
            return {
                errors: [
                    {
                        field: "username",
                        message: "length must be greater than 2",
                    },
                ],
            };
        }
        if (options.password.length <= 2) {
            return {
                errors: [
                    {
                        field: "password",
                        message: "password must be greather than 2",
                    },
                ],
            };
        }
        const hashedPassword = await argon2_1.default.hash(options.password);
        const user = fork.create(Users_1.User, {
            username: options.username,
            password: hashedPassword,
            createAt: new Date(),
            updateAt: new Date(),
        });
        await fork.persistAndFlush(user);
        return { user };
    }
    async login(options, { fork, req }) {
        const user = await fork.findOne(Users_1.User, { username: options.username });
        console.log({ user });
        if (user == null) {
            return {
                errors: [
                    {
                        field: "username",
                        message: "User name doesn't exist",
                    },
                ],
            };
        }
        const valid = await argon2_1.default.verify(user.password, options.password);
        if (!valid) {
            return {
                errors: [
                    {
                        field: "password",
                        message: "Password is invalid",
                    },
                ],
            };
        }
        req.session.userId = user._id;
        console.log(req.session);
        return {
            user,
        };
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => String)
], userResolver.prototype, "hellofromnew", null);
__decorate([
    (0, type_graphql_1.Query)(() => String)
], userResolver.prototype, "hellofromuser", null);
__decorate([
    (0, type_graphql_1.Query)(() => Users_1.User, { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)())
], userResolver.prototype, "meme", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Users_1.User]),
    __param(0, (0, type_graphql_1.Ctx)())
], userResolver.prototype, "users", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)("options", () => UsernamePasswordInput)),
    __param(1, (0, type_graphql_1.Ctx)())
], userResolver.prototype, "register", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)("options", () => UsernamePasswordInput)),
    __param(1, (0, type_graphql_1.Ctx)())
], userResolver.prototype, "login", null);
userResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], userResolver);
exports.userResolver = userResolver;
