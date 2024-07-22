import prisma from "../../utils/prisma";
import { createUserInput } from "./user.schema";

export async function createUser(input: createUserInput) {
  const user = await prisma.user.create({
    data: input,
  })
} 