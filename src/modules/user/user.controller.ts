import { FastifyReply, FastifyRequest } from 'fastify';
import { createUser, deleteUser, findUser, findUserByEmail, updateUser } from './user.service';
import { createUserInput, loginInput } from './user.schema';
import { findUsers } from './user.service';
import { verifyPassword } from '../../utils/hash';
import { fastify } from '../../app';
import { userBody } from '../../utils/interfaces';

export async function registerUserHandler(
  request: FastifyRequest<{
    Body: createUserInput;
  }>,
  reply: FastifyReply
) {
  const body = request.body;

  try {
    const user = await createUser(body);

    return reply.code(201).send(user);
  } catch (error) {
    console.log(error);

    return reply.code(500).send(error);
  }
}

export async function loginHandler(
  request: FastifyRequest<{
    Body: loginInput;
  }>,
  reply: FastifyReply
) {
  const body = request.body;

  // find a user by email
  const user = await findUserByEmail(body.email);

  if (!user) {
    return reply.code(401).send({
      message: 'Invalid email or password',
    });
  }

  // verify password
  const correctPassword = verifyPassword({
    candidatePassword: body.password,
    salt: user.salt,
    hash: user.password,
  });

  if (correctPassword) {
    const { password, salt, ...rest } = user;

    return { accessToken: fastify.jwt.sign(rest) };
  }

  return reply.code(401).send({
    message: 'Invalid email or password',
  });

  // generate access token

  // respond
}

export async function getUsersHandler(request: FastifyRequest) {
  const users = await findUsers();

  return users;
}

export async function getUserHandler(request: FastifyRequest<{Params: {id: number}}>) {
  const { id } = request.params;

  const user = await findUser(id);

  return user;
}

export async function deleteUserHandler(request: FastifyRequest<{Params: {id: number}}>, reply: FastifyReply) {
  const { id } = request.params;

  await deleteUser(id);

  return reply.code(200).send({ message: `user with id ${id} has been removed` });
}

export async function updateUserHandler(request: FastifyRequest<{Body: userBody, Params: {id: number}}>, reply: FastifyReply) {
  const { id } = request.params;
  const {email, name} = request.body

  await updateUser({id, email, name})

  return reply.code(201).send({message: `user with id ${id} has been updated`})
}
