import { NextFunction, Request, Response, ErrorRequestHandler } from "express";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "./config";
import { User } from "../entity/user";

export const errorHandler = async (
  // err: ErrorRequestHandler,
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    console.log("err handler", err);
    if (err.name === "QueryFailedError") {
      return res.status(500).json({ error: err.message });
    } else if (err[0]?.constructor?.name === "ValidationError") {
      return res.status(500).json({ error: err[0].constraints });
    } else if (err.name === "JsonWebTokenError") {
      return res.status(400).json({ error: err.message });
    }
    return res.status(404).json({ error: "Endpoint not found" });
  } catch (err) {
    next(err);
  }
};

interface TokenData {
  id: number;
  username: string;
}

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authorization = req.get("Authorization");

  const token = authorization?.startsWith("Bearer ")
    ? authorization?.replace("Bearer ", "")
    : "";

  const decodedToken: TokenData = jwt.verify(token, TOKEN_SECRET) as TokenData;

  if (!decodedToken.id) {
    return res.status(401).json({ error: "Invalid token" });
  }

  const user = (await User.findOneBy({ id: decodedToken.id })) as User;

  req.user = user;
  // req.user = user;

  next();
};
