import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import fastifyJwt from '@fastify/jwt';

import userRoutes from './modules/users/user.route';
import { userSchemas } from './modules/users/user.schema';

export const fastify = Fastify({
  logger: true,
});

fastify.register(fastifyJwt, {
  secret: 'ewireopfiugfhjcnvxqweptorgnvbiopwerj',
});

fastify.decorate('auth', async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify();
  } catch (error) {
    return reply.send(error);
  }
})

fastify.get('/', async (request, reply) => {
  return { hello: 'world' };
});

async function main() {
  fastify.register(userRoutes, { prefix: '/api/users' });

  for (const schema of userSchemas) {
    fastify.addSchema(schema);
  }

  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('server ready at http://localhost:3000');
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
}

main();
