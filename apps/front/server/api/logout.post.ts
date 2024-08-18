// server/api/logout.post.ts
import { H3Event } from 'h3';
import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
  return {
    user: null,
  };
});