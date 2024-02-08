import { NextFunction, Response, Request } from "express";
import { User } from "../entity/user";
import bcrypt from "bcrypt";
import { validate } from "class-validator";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../utils/config";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const body = req.body;
    const { username, password } = body;

    const user = await User.findOne({
      where: {
        username: username,
      },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid username or password" });
    }
    if (!(username && password)) {
      return res
        .status(400)
        .json({ error: "Username and password is required" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.json({ error: "Incorrect password" });
    }

    const userForToken = {
      id: user.id,
      username: user.username,
    };

    const token = jwt.sign(userForToken, TOKEN_SECRET, { expiresIn: "1d" });

    return res.json({
      message: "Successfully logged in",
      ...userForToken,
      token: token,
    });
  } catch (error) {
    next(error);
  }
};

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const body = req.body;
    const { username, password, confirm_password } = body;

    if (!(username && password)) {
      return res
        .status(400)
        .json({ error: "Username and password fields cannot be empty" });
    }
    if (password !== confirm_password) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const saltRound = 10;
    const passwordHash = await bcrypt.hash(password, saltRound);

    const user = new User();
    user.username = username;
    user.password = passwordHash;

    // check for validation error
    const errors = await validate(user);
    if (errors.length > 0) {
      next(errors);
    }

    await user.save();

    const userCopy = { id: user.id, username: user.username };

    res.status(201).json({ message: "User created successfully", ...userCopy });
  } catch (error) {
    next(error);
  }
};
