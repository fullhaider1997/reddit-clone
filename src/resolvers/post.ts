import { emit } from "process";
import { Resolver, Query, Ctx, Arg, Int, Mutation } from "type-graphql";
import { Post } from "../entities/Post";
import { MyContext } from "../types/contextType";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(@Ctx() { fork }: MyContext): Promise<Post[]> {
    console.log(fork);

    return fork.find(Post, {});
  }

  //Arg changes name of indentifier in graphql schema
  @Query(() => Post, { nullable: true })
  post(
    @Arg("id", () => Int) id: number,
    @Ctx() { fork }: MyContext
  ): Promise<Post | null> {
    console.log(fork);
    return fork.findOne(Post, id);
  }

  @Mutation(() => Post)
  async createPost(
    @Arg("title", () => String) title: string,
    @Ctx() { fork }: MyContext
  ): Promise<Post> {
    const post = fork.create(Post, {
      title,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await fork.persistAndFlush(post);

    return post;
  }

  @Mutation(() => Post, { nullable: true })
  async updatPost(
    @Arg("id", () => Int) id: number,
    @Arg("title", () => String, { nullable: true }) title: string,
    @Ctx() { fork }: MyContext
  ): Promise<Post | null> {
    const post = await fork.findOne(Post, id);

    if (!post) {
      return null;
    }

    if (typeof title !== "undefined") {
      post.title = title;

      await fork.persistAndFlush(post);
    }

    await fork.persistAndFlush(post);

    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(
    @Arg("id", () => Int) id: number,
    @Ctx() { fork }: MyContext
  ): Promise<boolean> {
    try {
      const post = await fork.nativeDelete(Post, id);
    } catch (err) {
      return false;
    }

    return true;
  }
}
