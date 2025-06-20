import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn() }) }));
jest.mock('../api/swagger', () => ({ getNotificationList: jest.fn(() => Promise.resolve({ data: [] })) }));
import NotificationPage from '../app/notification/page';

describe('NotificationPage', () => {
  it('알림 목록 타이틀이 렌더링된다', async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <NotificationPage />
      </QueryClientProvider>
    );
    await waitFor(() => {
      // @ts-expect-error
      expect(screen.getByText('알림 목록')).toBeInTheDocument();
    });
  });
});
