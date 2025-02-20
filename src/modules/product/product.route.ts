import { FastifyInstance } from "fastify";
import { createProductHandler, getProductsHandler } from "./product.controller";
import { $ref } from "./product.schema";

async function productRoutes(server: FastifyInstance) {
  server.post('/', {
    schema: {
      body: $ref('createProductSchema'),
      response: {
        201: $ref('productsResponseSchema')
      }
    }
  }, createProductHandler)

  server.get('/', {
    schema: {
      response: {
        200: $ref('productsResponseSchema')
      }
    }
  }, getProductsHandler)

  //server.delete('/', {}, deleteProductHandler)
}

export default productRoutes