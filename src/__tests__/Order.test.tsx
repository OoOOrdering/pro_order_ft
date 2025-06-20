import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
jest.mock('../components/DownloadOrderPdf', () => () => <div />);
jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn() }) }));
jest.mock('../api/swagger', () => ({ getOrderList: jest.fn(() => Promise.resolve({ data: [] })) }));
import OrderPage from '../app/order/page';

describe('OrderPage', () => {
  it('주문 목록 타이틀이 렌더링된다', async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <OrderPage />
      </QueryClientProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('주문 목록')).toBeInTheDocument();
    });
  });
});
