import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ObjectType, Field, Int } from "type-graphql";

@ObjectType()
//Each field maps into database column
@Entity()
export class User {
  @Field(() => Int)
  @PrimaryGeneratedColumn({ type: "number" })
  _id!: number;

  @Field(() => String)
  @CreateDateColumn()
  createAt = new Date();

  @Field(() => String)
  @UpdateDateColumn()
  updateAt = new Date();

  @Field(() => String)
  @Column({ type: "text", unique: true })
  username!: string;

  @Field(() => String)
  @Column({ type: "text", unique: true })
  email!: string;

  @Column({ type: "text" })
  password!: string;
}
