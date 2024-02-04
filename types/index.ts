import { User } from "../entity/user";

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}
