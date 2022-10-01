import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BaseEntity,
} from "typeorm";
import { ObjectType, Field, Int } from "type-graphql";

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  _id!: number;

  @Field(() => String)
  @CreateDateColumn({ type: "date" })
  createdAt = new Date();

  @Field(() => String)
  @CreateDateColumn()
  updatedAt = new Date();

  @Field(() => String)
  @Column({ type: "text" })
  title!: string;
}
