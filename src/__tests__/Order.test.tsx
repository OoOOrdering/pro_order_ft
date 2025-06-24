import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
jest.mock('../components/DownloadOrderPdf', () => {
  const Mock = () => <div />;
  Mock.displayName = 'MockDownloadOrderPdf';
  return Mock;
});
jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn() }) }));
jest.mock('../api/swagger', () => ({ getOrderList: jest.fn(() => Promise.resolve({ data: [] })) }));
import OrderPage from '../src/app/order/page';

OrderPage.displayName = "OrderPage"

describe('OrderPage', () => {
  it('주문 목록 타이틀이 렌더링된다', async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <OrderPage />
      </QueryClientProvider>
    );
    await waitFor(() => {
      // @ts-expect-error
      expect(screen.getByText('주문 목록')).toBeInTheDocument();
    });
  });
});
