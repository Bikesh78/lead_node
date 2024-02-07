import { DataSource, DataSourceOptions } from "typeorm";
import "reflect-metadata";
import { DB_HOST, DB_PASSWORD, DB_USER } from "./config";
import { User } from "../entity/user";
import { Lead } from "../entity/lead";
import { Interaction } from "../entity/interaction";

const options: DataSourceOptions = {
  type: "postgres",
  host: DB_HOST,
  username: DB_USER,
  password: DB_PASSWORD,
  database: "lead",
  port: 5432,
  // entities: ["entity/**/*.ts"],
  entities: [User, Lead, Interaction],
  synchronize: true,
  logging: false,
  migrations: ["migration/**/*.ts"],
};

export const appDataSource = new DataSource(options);

export const connectToDatabase = async () => {
  try {
    await appDataSource.initialize();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
