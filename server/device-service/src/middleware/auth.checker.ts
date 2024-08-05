import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/config";

interface TokenInterface {
  uuid: string;
  username: string;
  role: string;
}

declare module "express" {
  export interface Request {
    user?: any;
  }
}

const authChecker = (req: Request, res: Response, next: NextFunction) => {
  try {
    const auth = req.header("Authorization");

    const token = auth?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .send({ message: "No auth token found. Authorization denied." });
    }

    const decodedToken = jwt.verify(token, JWT_SECRET) as TokenInterface;

    if (decodedToken.uuid == null) {
      return res
        .status(401)
        .send({ message: "Token verification failed. Authorization denied." });
    }
    req.user = decodedToken;
    next();
  } catch (error: any) {
    res.status(500).send({ message: error.message });
  }
};

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.user.role.toLocaleLowerCase());
  if (req.user.role.toLocaleLowerCase() === "admin") {
    next();
  } else {
    res.status(401).send({ message: "Not Authorized to access this content" });
  }
};

export default authChecker;
