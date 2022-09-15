import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";
import { Request, Response } from "express";
import Redis from "ioredis";
import { SessionData } from "express-session";
export type MyContext = {
  fork: EntityManager<IDatabaseDriver<Connection>>;
  req: Request & { session: SessionData };
  res: Response;
  redis: Redis;
};
