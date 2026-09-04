import { sign, type SignOptions } from "jsonwebtoken";
import type { Types } from "mongoose";
import config from "../config/env";

export interface TokenUser {
  readonly _id: Types.ObjectId;
}

const createAccessToken = (user: TokenUser): string => {
  const options: SignOptions = {
    expiresIn: config.jwt.expiresIn as NonNullable<SignOptions["expiresIn"]>,
  };

  return sign({ sub: String(user._id) }, config.jwt.secret, options);
};

export default createAccessToken;
