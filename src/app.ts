import Fastify from "fastify";

import userRoutes from "./modules/users/user.route";

const fastify = Fastify({
  logger: true,
});

fastify.get('/', async (request, reply) => {
  return { hello: 'world'};
})

async function main() {
  fastify.register(userRoutes, {prefix: '/api/users'})

  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('server ready at http://localhost:3000')
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
}

main();
