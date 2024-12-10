import type { User } from "@prisma/client";
import JWT from "jsonwebtoken";

import prisma from "@referrer/prisma";
import redis from "@referrer/redis";

import BadRequestError from "../errors/BadRequestError.js";
import { cacheTime } from "../utils/index.js";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) throw new Error("JWT_SECRET is undefined, Please include JWT_SECRET in .env file");

export interface UserJWTPayload {
  id: User["id"];
  name: User["name"];
  email: User["email"];
  userName: User["userName"];
  image: User["image"];
  locale: User["locale"];
  stripeCustomerId: User["stripeCustomerId"];
  stars: User["stars"];
}

class UserService {
  public static createUser = prisma.user.create;

  public static async addToWaitlist(email: string) {
    const emailExists = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (emailExists) {
      throw new BadRequestError("The email address is already registered in our waitlist.");
    } else {
      return await prisma.user.create({
        data: {
          email,
          userName: email.split("@")[0],
        },
      });
    }
  }

  public static async getUserByEmail(email: string) {
    const cachedUserByEmail = await redis.get(`USER:EMAIL:${email}`);
    if (cachedUserByEmail) return JSON.parse(cachedUserByEmail);
    const user = await prisma.user.findUnique({ where: { email } });
    await redis.set(`USER:EMAIL:${email}`, JSON.stringify(user), "EX", cacheTime);
    return user;
  }

  public static async getUserById(id: string) {
    const cachedUserById = await redis.get(`USER:ID:${id}`);
    if (cachedUserById) return JSON.parse(cachedUserById);
    const user = await prisma.user.findFirst({ where: { id } });
    await redis.set(`USER:ID:${id}`, JSON.stringify(user), "EX", cacheTime);
    return user;
  }

  public static async getUserByUsername(userName: string) {
    const cachedUserByUsername = await redis.get(`USER:USERNAME:${userName}`);
    if (cachedUserByUsername) return JSON.parse(cachedUserByUsername);
    const user = await prisma.user.findFirst({ where: { userName } });
    await redis.set(`USER:USERNAME:${userName}`, JSON.stringify(user), "EX", cacheTime);
    return user;
  }

  public static verifyToken(token: string) {
    try {
      return JWT.verify(token, JWT_SECRET as string) as UserJWTPayload;
    } catch (error) {
      return null;
    }
  }

  public static async generateTokenForUser(email: string) {
    const user = await this.getUserByEmail(email);
    if (!user) throw new BadRequestError(`user with ${email} does not exists`);

    const payload: UserJWTPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      userName: user.userName,
      image: user.image,
      locale: user?.locale,
      stripeCustomerId: user.stripeCustomerId,
      stars: user.stars,
    };

    const token = JWT.sign(payload, JWT_SECRET as string);
    return token;
  }
}

export default UserService;

// class UserService {
//   public static createUser = prismaClient.user.create;

//   public static getUserByEmail(email: string) {
//     // return prismaClient.user.findUnique({ where: { email } });
//   }

//   public static getUserById(id: string) {
//     // return prismaClient.user.findUnique({ where: { id } });
//   }

//   public static async signinWithEmailAndPassword(email: string, password: string) {
//     const user = await this.getUserByEmail(email);
//     if (!user) throw new BadRequestError(`User with email ${email} does not exists!`);

//     if (user.authenticationType !== "EMAIL_PASSWORD")
//       throw new BadRequestError(`Invalid Authentication Method`);

//     const userSalt = user.salt;

//     if (!userSalt) throw new BadRequestError(`Something went wrong with salt! Please contact site admin`);

//     const hashPassword = crypto.createHmac("sha256", userSalt).update(password).digest("hex");

//     if (user.password !== hashPassword) throw new BadRequestError(`Invalid email or password!`);

//     return this.generateTokenForUser(user.email);
//   }

//   public static verifyToken(token: string) {
//     try {
//       return JWT.verify(token, JWT_SECRET as string) as UserJWTPayload;
//     } catch (error) {
//       return null;
//     }
//   }

//   public static async generateTokenForUser(email: string) {
//     const user = await this.getUserByEmail(email);
//     if (!user) throw new BadRequestError(`user with ${email} does not exists`);

//     const payload: UserJWTPayload = {
//       id: user.id,
//       email: user.email,
//       role: user.role,
//     };

//     const token = JWT.sign(payload, JWT_SECRET as string);
//     return token;
//   }
// }

// export default UserService;
