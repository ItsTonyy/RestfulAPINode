import { FastifyInstance } from 'fastify';
import {
  loginHandler,
  registerUserHandler,
  getUsersHandler,
  getUserHandler,
  deleteUserHandler,
  updateUserHandler,
} from './user.controller';
import { $ref } from './user.schema';
import { Server } from 'http';

async function userRoutes(server: FastifyInstance) {
  server.post(
    '/',
    {
      schema: {
        body: $ref('createUserSchema'),
        response: {
          201: $ref('createUserResponseSchema'),
        },
      },
    },
    registerUserHandler
  );

  server.post(
    '/login',
    {
      schema: {
        body: $ref('loginSchema'),
        response: {
          200: $ref('loginResponseSchema'),
        },
      },
    },
    loginHandler
  );

  server.get(
    '/',
    {
      preHandler: [server.authenticate],
    },
    getUsersHandler
  );

  server.get(
    '/:id',
    {
      schema: {
        params: {
          id: { type: 'number' },
        },
      },
    },
    getUserHandler
  );

  server.delete(
    '/:id',
    {
      schema: {
        params: {
          id: { type: 'number' },
        },
        response: {
          200: $ref('deleteResponseSchema'),
        },
      },
    },
    deleteUserHandler
  );

  server.put('/:id', 
    {
      schema: {
        params: {
          id: { type: 'number' },
        },
        body: $ref('userUpdateSchema'),
        response: {
          201: $ref('deleteResponseSchema'),
        },
      },
    },
    updateUserHandler
)
}

export default userRoutes;
