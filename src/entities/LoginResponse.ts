import { Field, ObjectType, Int } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@ObjectType()
export class LoginResponse {
  @Field(() => String)
  accessToken!: string;
}
