import { DataSource, DataSourceOptions } from "typeorm";
import "reflect-metadata";
import { DB_PASSWORD, DB_USER } from "./config";
import { User } from "../entity/user";

const options: DataSourceOptions = {
  type: "postgres",
  host: "localhost",
  username: DB_USER,
  password: DB_PASSWORD,
  database: "lead",
  port: 5432,
  // entities: ["entity/**/*.ts"],
  entities: [User],
  synchronize: false,
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

