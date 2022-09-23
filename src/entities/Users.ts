import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectType, Field, Int } from "type-graphql";

@ObjectType()
//Each field maps into database column
@Entity()
export class User {
  @Field(() => Int)
  @PrimaryKey({ type: "number" })
  @Property({ type: "int", autoincrement: true })
  _id!: number;

  @Field(() => String)
  @Property({ type: "date" })
  createAt = new Date();

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updateAt = new Date();

  @Field(() => String)
  @Property({ type: "text", unique: true })
  username!: string;

  @Field(() => String)
  @Property({ type: "text", unique: true })
  email!: string;

  @Property({ type: "text" })
  password!: string;
}
