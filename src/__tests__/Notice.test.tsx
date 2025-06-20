import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn() }) }));
jest.mock('../api/swagger', () => ({ getNoticeList: jest.fn(() => Promise.resolve({ data: [] })) }));
import NoticePage from '../app/notice/page';

describe('NoticePage', () => {
  it('공지사항 타이틀이 렌더링된다', async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <NoticePage />
      </QueryClientProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('공지사항')).toBeInTheDocument();
    });
  });
});
