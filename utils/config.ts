import "dotenv/config";

// export const DB_URI = process.env.DATABASE_URI as string;
export const DB_USER = process.env.DB_USER as string;
export const DB_PASSWORD = process.env.DB_PASSWORD as string;
export const DB_HOST = process.env.DB_HOST || "localhost";
export const DB_NAME = process.env.NODE_ENV === "test" ? "lead_test" : "lead";

export const PORT = process.env.PORT || 3000;

export const TOKEN_SECRET = process.env.TOKEN_SECRET || "";
