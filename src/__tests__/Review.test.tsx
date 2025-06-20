import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn() }) }));
jest.mock('../api/swagger', () => ({ getReviewList: jest.fn(() => Promise.resolve({ data: [] })) }));
import ReviewPage from '../app/review/page';

describe('ReviewPage', () => {
  it('내 리뷰 목록 타이틀이 렌더링된다', async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <ReviewPage />
      </QueryClientProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('내 리뷰 목록')).toBeInTheDocument();
    });
  });
});
