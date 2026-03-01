import { GraphQLError } from 'graphql'
import dotenv from 'dotenv'
dotenv.config()

export const authMiddlewareGraph = (req) => {
  const authHeader = req.headers?.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new GraphQLError('Invalid or missing Authorization header');
  }

  const authToken = authHeader.replace('Bearer ', '').trim();
  const envToken = process.env.AUTH_TOKEN?.trim();

  if (!envToken) {
    throw new GraphQLError('AUTH_TOKEN not set in .env');
  }

  if (authToken !== envToken) {
    throw new GraphQLError('Authorization failed');
  }

  return true;
};