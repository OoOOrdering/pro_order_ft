import { rest } from 'msw';

export const handlers = [
  rest.get('/api/mock-order', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([{ id: 1, title: 'Mock 주문' }])
    );
  }),
];
