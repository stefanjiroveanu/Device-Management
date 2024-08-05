import {
  registerValidator,
  validateEmail,
} from "../utils/validators";
import { Request, Response } from "express";
import UsersDataSource from "../db";
import { User } from "../entity/User";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
import axios from "axios";

export const insertUser = async (req: Request, res: Response) => {
  const manager = (await UsersDataSource).manager;
  const { username, email, password, role } = req.body;
  const { errors, valid } = registerValidator(username, password);
  if (!valid) {
    return res.status(400).send({ message: Object.values(errors)[0] });
  }

  const existingUser = manager.findOne(User, {
    where: { username },
  });

  if (!email) {
    return res.status(400).send("Email cannot be null.");
  } else if (!validateEmail(email)) {
    return res.status(400).send("Email is not good format.")
  }

  if (await existingUser) {
    return res
      .status(401)
      .send({ message: `Username '${username}' is already taken.` });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const uuid = randomUUID().toString();
  const currentUser = manager.create(User, {
    uuid: uuid,
    username: username,
    email: email,
    password: passwordHash,
    role: role,
  });
  await manager.save(currentUser);
  return res.status(200).send(currentUser);
};

export const findAllUsers = async (req: Request, res: Response) => {
  const manager = (await UsersDataSource).manager;
  const users = await manager.find(User);
  res.status(200).send(users);
};

export const findUser = async (req: Request, res: Response) => {
  const manager = (await UsersDataSource).manager;
  const uuid = req.params["uuid"];
  const user = await manager.findOne(User, {
    where: { uuid },
  });
  let devices = null;
  try {
    devices = await (
      await axios.get(`http://172.16.230.7:8081/devices?user=${uuid}`, {
        headers: {
          Authorization: `Bearer ${req.headers.authorization?.split(" ")[1]}`
        }
      })
    ).data;
  } catch (error) {
    console.log("The devices could not be retrieved");
  }
  const returnedUser = {
    uuid: user?.uuid,
    username: user?.username,
    email: user?.email,
    role: user?.role,
    devices: devices,
  };
  res.status(200).send(returnedUser);
};

export const deleteUser = async (req: Request, res: Response) => {
  const manager = (await UsersDataSource).manager;
  const uuid = req.params["uuid"];
  const user = await manager.find(User, {
    where: { uuid },
  });
  console.log(uuid);
  const response = await axios.delete(
    `http://172.16.230.7:8081/devices/relations/${uuid}`
  );
  if (response.status == 200) {
    await manager.remove(user);
    console.log("User Deleted");
    res.status(200).send("User Deleted");
  } else if (response.status == 500) {
    res.status(500).send("Error when deleting relations");
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const manager = (await UsersDataSource).manager;
  const uuid = req.params["uuid"];
  console.log(req.body.username);
  const { username, email, password, role } = req.body;
  let toUpdateUser: User = new User();
  if (username) toUpdateUser.username = username;
  if (password) {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    toUpdateUser.password = passwordHash;
  }
  if (role) toUpdateUser.role = role;
  if (email) toUpdateUser.email = email;
  console.log(toUpdateUser);

  try {
    await manager.update(User, { uuid: uuid }, toUpdateUser);
    res.status(200).send("User Updated");
  } catch (err) {
    res.status(500).send("There was an error updating the user");
  }
};
