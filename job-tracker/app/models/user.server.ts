// we might want to extract this from prisma and make our own type?
import type { Password } from "@prisma/client";
import type { User } from "../utils/typings";
import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";

export async function gerUserById(userId: string){
  return await (
    await fetch(process.env.API_BASE_URL + "/profile/" + userId)
  ).json();
}

// export async function getUserById(id: User["id"]) {
//   return prisma.user.findUnique({ where: { id } });
// }

export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(email: User["email"], password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
}

export async function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({ where: { email } });
}

export async function verifyLogin(
  email: User["email"],
  password: Password["hash"]
) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash
  );

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}
