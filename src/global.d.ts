import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R = void, T = {}> {
      toBeInTheDocument(): R;
      toHaveAttribute(attr: string, value?: any): R;
      // 필요시 다른 matcher도 추가
    }
  }
}
