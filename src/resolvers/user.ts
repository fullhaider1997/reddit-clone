import {
  Resolver,
  Query,
  Mutation,
  ObjectType,
  Field,
  Arg,
  Ctx,
  InputType,
} from "type-graphql";
import { User } from "../entities/Users";
import { MyContext } from "../types/contextType";
import argon2 from "argon2";

import { validateRegister } from "../utils/validateRegister";
import { UsernamePasswordInput } from "../types/UsernamePasswordInput";
import { sendEmail } from "../utils/sendEmails";
import { v4 } from "uuid";
import { Token } from "graphql";
import { FORGET_PASSWORD_PREFIX } from "../constants/constants";
import Redis from "ioredis";
declare module "express-session" {
  interface Session {
    userId: number;
  }
}

@ObjectType()
class FieldError {
  @Field(() => String)
  field!: string;
  @Field(() => String)
  message!: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[] | null;

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class userResolver {
  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { fork, redis, req }: MyContext
  ): Promise<UserResponse> {
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

    const userId = await redis.get(FORGET_PASSWORD_PREFIX + token);

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

    const user = await fork.findOne(User, { _id: parseInt(userId) });

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

    user.password = await argon2.hash(newPassword);

    await fork.persistAndFlush({ user });

    req.session.userId = parseInt(userId);

    return {
      user,
    };
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { fork, redis }: MyContext
  ) {
    console.log("Executing forgot....Password");

    const user = await fork.findOne(User, { email: email });

    //the email is not in database
    if (!user) {
      return true;
    }
    const token = v4();

    await redis.set(FORGET_PASSWORD_PREFIX + token, user._id);

    let body = `<a href="http://localhost:3000/change-password/${token}"> rest password </a>`;

    try {
      await sendEmail(email, body);
    } catch (err) {
      console.log(err);
    }

    return false;
  }

  @Query(() => String)
  hellofromnew() {
    return "hello world";
  }

  @Query(() => String)
  hellofromuser() {
    return "hello world";
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { fork, req }: MyContext) {
    console.log("checking session: me");

    console.log(req.session);
    if (!req.session.userId) {
      return null;
    }

    const user = await fork.findOne(User, { _id: req.session.userId });

    return user;
  }
  @Query(() => [User])
  users(@Ctx() { fork }: MyContext): Promise<User[]> {
    return fork.find(User, {});
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { fork, req }: MyContext
  ): Promise<UserResponse> {
    console.log("register");

    const errors = validateRegister(options);

    if (errors) {
      return { errors };
    }

    const hashedPassword = await argon2.hash(options.password);

    const user = fork.create(User, {
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

  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { fork, req }: MyContext
  ): Promise<UserResponse> {
    let userLogin = usernameOrEmail.includes("@")
      ? { email: usernameOrEmail }
      : { username: usernameOrEmail };

    console.log("login");
    const user = await fork.findOne(User, userLogin);

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

    const valid = await argon2.verify(user.password, password);

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

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie("please-save");
        if (err) {
          console.log(err);
          resolve(false);
        }
        resolve(true);
      })
    );
  }
}
