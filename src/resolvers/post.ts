import { emit } from "process";
import { Resolver, Query, Ctx, Arg, Int, Mutation } from "type-graphql";
import { Post } from "../entities/Post";
import { MyContext } from "../types/contextType";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(): Promise<Post[]> {
    return Post.find();
  }

  //Arg changes name of indentifier in graphql schema
  @Query(() => Post, { nullable: true })
  post(@Arg("id") user_id: number): Promise<Post | null> {
    return Post.findOne({ where: { _id: user_id } });
  }

  @Mutation(() => Post)
  async createPost(@Arg("title", () => String) title: string): Promise<Post> {
    //2 sql queries to
    return Post.create({ title }).save();
  }

  @Mutation(() => Post, { nullable: true })
  async updatPost(
    @Arg("id") id: number,
    @Arg("title", () => String, { nullable: true }) title: string
  ): Promise<Post | null> {
    const post = await Post.findOne({ where: { _id: id } });

    if (!post) {
      return null;
    }

    if (typeof title !== "undefined") {
      await Post.update({ _id: id }, { title });
    }

    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(@Arg("id") id: number): Promise<boolean> {
    await Post.delete(id);
    return true;
  }
}
