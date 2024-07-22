import { FastifyReply, FastifyRequest } from 'fastify';
import { createUser, findUserByEmail } from './user.service';
import { createUserInput, loginInput } from './user.schema';
import { verifyPassword } from '../../utils/hash';
import { fastify } from '../../app';

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

export async function loginHandler(request: FastifyRequest<{
  Body: loginInput;
}>, reply: FastifyReply) {
  const body = request.body

  // find a user by email
  const user = await findUserByEmail(body.email);

  if(!user) {
    return reply.code(401).send({
      message: 'Invalid email or password',
    });
  }

  // verify password
  const correctPassword = verifyPassword({
    candidatePassword: body.password,
    salt: user.salt,
    hash: user.password
  })

  if(correctPassword) {
    const {password, salt, ...rest} = user;

    return {accessToken: fastify.jwt.sign(rest)}
  }

  return reply.code(401).send({
    message: 'Invalid email or password',
  });
  
  // generate access token

  // respond
}
