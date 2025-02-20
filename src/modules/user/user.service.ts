import { hashPassword } from '../../utils/hash';
import { userBody } from '../../utils/interfaces';
import prisma from '../../utils/prisma';
import { createUserInput } from './user.schema';


export async function createUser(input: createUserInput) {
  const { password, ...rest } = input;

  const { hash, salt } = hashPassword(password);

  const user = await prisma.user.create({
    data: { ...rest, salt, password: hash },
  });

  return user;
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}

export async function findUsers() {
  return prisma.user.findMany({
    select: {
      email: true,
      name: true,
      id: true,
    },
  });
}

export async function findUser(id: number) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      email: true,
      name: true,
      id: true,
    },
  });
}

export async function deleteUser(id: number) {
  return prisma.user.delete({
    where: { id },
  });
}

export async function updateUser({id, name, email}: userBody) {
  return prisma.user.update({
    where: { id },
    data: {
      id,
      email,
      name
    }
  })
}