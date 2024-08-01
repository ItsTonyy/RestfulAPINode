import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import fastifyJwt from '@fastify/jwt';

import userRoutes from './modules/user/user.route';
import productRoutes from './modules/product/product.route';
import { userSchemas } from './modules/user/user.schema';
import { productSchemas } from './modules/product/product.schema';


export const fastify = Fastify({
  logger: false,
});

declare module "fastify" {
  export interface FastifyInstance {
    authenticate: any
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: {
      id: number;
      email: string;
      name: string;
    };
  }
}

fastify.register(fastifyJwt, {
  secret: 'ewireopfiugfhjcnvxqweptorgnvbiopwerj',
});

fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
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
  fastify.register(productRoutes, { prefix: '/api/products' });

  for (const schema of [...userSchemas, ...productSchemas]) {
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
