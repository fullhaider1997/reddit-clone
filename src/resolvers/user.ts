import {
  Resolver,
  Query,
  Mutation,
  ObjectType,
  InputType,
  Field,
  Arg,
  Ctx,
} from "type-graphql";
import { CannotExecuteNotConnectedError } from "typeorm";
import { User } from "../entities/Users";
import { MyContext } from "../types";
import argon2 from "argon2";

declare module "express-session" {
  interface Session {
    userId: number;
  }
}

@InputType()
class UsernamePasswordInput {
  @Field(() => String)
  username!: string;

  @Field(() => String)
  password!: string;
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
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class userResolver {
  @Query(() => String)
  hellofromnew() {
    return "hello world";
  }

  @Query(() => String)
  hellofromuser() {
    return "hello world";
  }

  @Query(() => User, { nullable: true })
  async meme(@Ctx() { fork, req }: MyContext) {
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
    @Arg("options", () => UsernamePasswordInput) options: UsernamePasswordInput,
    @Ctx() { fork, req }: MyContext
  ): Promise<UserResponse> {
    const check = await fork.find(User, { username: options.username });

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

    const hashedPassword = await argon2.hash(options.password);

    const user = fork.create(User, {
      username: options.username,
      password: hashedPassword,
      createAt: new Date(),
      updateAt: new Date(),
    });

    await fork.persistAndFlush(user);

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options", () => UsernamePasswordInput) options: UsernamePasswordInput,
    @Ctx() { fork, req }: MyContext
  ): Promise<UserResponse> {
    const user = await fork.findOne(User, { username: options.username });

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

    const valid = await argon2.verify(user.password, options.password);

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
}
