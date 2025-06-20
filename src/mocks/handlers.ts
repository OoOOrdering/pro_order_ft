import { http } from 'msw';

export const handlers = [
  // @ts-ignore
  http.get('/api/mock-order', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([{ id: 1, title: 'Mock 주문' }])
    );
  }),
];
