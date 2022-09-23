"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
const validateRegister_1 = require("../utils/validateRegister");
const UsernamePasswordInput_1 = require("../types/UsernamePasswordInput");
const sendEmails_1 = require("../utils/sendEmails");
const uuid_1 = require("uuid");
const constants_1 = require("../constants/constants");
let FieldError = class FieldError {
};
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], FieldError.prototype, "field", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], FieldError.prototype, "message", void 0);
FieldError = __decorate([
    (0, type_graphql_1.ObjectType)()
], FieldError);
let UserResponse = class UserResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [FieldError], { nullable: true }),
    __metadata("design:type", Object)
], UserResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Users_1.User, { nullable: true }),
    __metadata("design:type", Users_1.User)
], UserResponse.prototype, "user", void 0);
UserResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], UserResponse);
let userResolver = class userResolver {
    async changePassword(token, newPassword, { fork, redis, req }) {
        if (newPassword.length <= 2) {
            return {
                errors: [
                    {
                        field: " new Password",
                        message: "length must be greater than 2",
                    },
                ],
            };
        }
        const userId = await redis.get(constants_1.FORGET_PASSWORD_PREFIX + token);
        if (!userId) {
            return {
                errors: [
                    {
                        field: "token",
                        message: "token expired",
                    },
                ],
            };
        }
        const user = await fork.findOne(Users_1.User, { _id: parseInt(userId) });
        if (!user) {
            return {
                errors: [
                    {
                        field: "token",
                        message: "user no longer exists",
                    },
                ],
            };
        }
        user.password = await argon2_1.default.hash(newPassword);
        await fork.persistAndFlush({ user });
        req.session.userId = parseInt(userId);
        return {
            user,
        };
    }
    async forgotPassword(email, { fork, redis }) {
        console.log("Executing forgot....Password");
        const user = await fork.findOne(Users_1.User, { email: email });
        //the email is not in database
        if (!user) {
            return true;
        }
        const token = (0, uuid_1.v4)();
        await redis.set(constants_1.FORGET_PASSWORD_PREFIX + token, user._id);
        let body = `<a href="http://localhost:3000/change-password/${token}"> rest password </a>`;
        try {
            await (0, sendEmails_1.sendEmail)(email, body);
        }
        catch (err) {
            console.log(err);
        }
        return false;
    }
    hellofromnew() {
        return "hello world";
    }
    hellofromuser() {
        return "hello world";
    }
    async me({ fork, req }) {
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
        console.log("register");
        const errors = (0, validateRegister_1.validateRegister)(options);
        if (errors) {
            return { errors };
        }
        const hashedPassword = await argon2_1.default.hash(options.password);
        const user = fork.create(Users_1.User, {
            username: options.username,
            password: hashedPassword,
            createAt: new Date(),
            updateAt: new Date(),
            email: options.email,
        });
        req.session.userId = user._id;
        console.log(req.session);
        await fork.persistAndFlush(user);
        return { user };
    }
    async login(usernameOrEmail, password, { fork, req }) {
        let userLogin = usernameOrEmail.includes("@")
            ? { email: usernameOrEmail }
            : { username: usernameOrEmail };
        console.log("login");
        const user = await fork.findOne(Users_1.User, userLogin);
        console.log({ user });
        if (!user) {
            return {
                errors: [
                    {
                        field: "usernameOrEmail",
                        message: "User name doesn't exist",
                    },
                ],
            };
        }
        const valid = await argon2_1.default.verify(user.password, password);
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
    logout({ req, res }) {
        return new Promise((resolve) => req.session.destroy((err) => {
            res.clearCookie("please-save");
            if (err) {
                console.log(err);
                resolve(false);
            }
            resolve(true);
        }));
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)("token")),
    __param(1, (0, type_graphql_1.Arg)("newPassword")),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], userResolver.prototype, "changePassword", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("email")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], userResolver.prototype, "forgotPassword", null);
__decorate([
    (0, type_graphql_1.Query)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], userResolver.prototype, "hellofromnew", null);
__decorate([
    (0, type_graphql_1.Query)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], userResolver.prototype, "hellofromuser", null);
__decorate([
    (0, type_graphql_1.Query)(() => Users_1.User, { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], userResolver.prototype, "me", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Users_1.User]),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], userResolver.prototype, "users", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)("options")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UsernamePasswordInput_1.UsernamePasswordInput, Object]),
    __metadata("design:returntype", Promise)
], userResolver.prototype, "register", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)("usernameOrEmail")),
    __param(1, (0, type_graphql_1.Arg)("password")),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], userResolver.prototype, "login", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], userResolver.prototype, "logout", null);
userResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], userResolver);
exports.userResolver = userResolver;
