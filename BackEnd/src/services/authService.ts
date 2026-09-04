import bcrypt from "bcrypt";
import User, { type UserDocument } from "../models/User";
import type { LoginBody, RegisterBody } from "../validators/authSchemas";
import AppError from "../utils/AppError";
import createAccessToken from "../utils/token";

export interface AuthenticationResult {
  readonly user: UserDocument;
  readonly accessToken: string;
}

export const register = async (input: RegisterBody): Promise<AuthenticationResult> => {
  const { username, email, password } = input;
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });

  if (existingUser) {
    throw new AppError(409, "A user with that email or username already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({ username, email, password: hashedPassword });

  return { user, accessToken: createAccessToken(user) };
};

export const login = async (input: LoginBody): Promise<AuthenticationResult> => {
  const { email, password } = input;
  const user = await User.findOne({ email }).select("+password");
  const passwordMatches = user ? await bcrypt.compare(password, user.password) : false;

  if (!user || !passwordMatches) {
    throw new AppError(401, "Invalid email or password");
  }

  return { user, accessToken: createAccessToken(user) };
};

