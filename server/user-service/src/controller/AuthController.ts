import UsersDataSource from "../db";
import { User } from "../entity/User";
import { loginValidator } from "../utils/validators";
import { Response, Request } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/config";

interface TokenInterface {
  uuid: string;
  username: string;
  role: string;
}

export const loginUser = async (req: Request, res: Response) => {
  const manager = (await UsersDataSource).manager;
  const { username, password } = req.body;
  const { errors, valid } = loginValidator(username, password);

  if (!valid) {
    return res.status(400).send({ message: Object.values(errors)[0] });
  }

  const user = await manager.findOne(User, {
    where: { username },
  });

  if (!user) {
    return res.status(401).send({ message: `User: '${username}' not found.` });
  }

  const credentialsValid = await bcrypt.compare(password, user.password);

  if (!credentialsValid) {
    return res.status(401).send({ message: "Invalid credentials." });
  }

  console.log(JWT_SECRET);

  const token = jwt.sign(
    { uuid: user.uuid, username: user.username, role: user.role },
    JWT_SECRET
  );

  return res.status(201).json({
    username: user.username,
    role: user.role,
    token,
  });
};

export const getRoleFromToken = async (req: Request, res: Response) => {
  try {
    const auth = req.header("Authorization");
    if (!auth) {
      return res
        .status(401)
        .send({ message: "No auth token found. Authorization denied." });
    }
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

    return res.status(200).json({
      role: decodedToken.role,
      uuid: decodedToken.uuid,
      username: decodedToken.username,
    });
  } catch (error: any) {
    res.status(500).send({ message: error.message });
  }
};
