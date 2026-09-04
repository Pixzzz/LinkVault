import type { UserDocument } from "../models/User";
import type { ValidatedPayload } from "./http";

declare global {
  namespace Express {
    interface Request {
      id: string;
      user?: UserDocument;
      validated?: ValidatedPayload<unknown, unknown, unknown>;
    }
  }
}

export {};

