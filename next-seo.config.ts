import { DefaultSeoProps } from 'next-seo';

const config: DefaultSeoProps = {
  title: 'PR Order',
  description: '효율적인 주문 관리와 팀 협업을 위한 올인원 플랫폼',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://your-domain.com',
    site_name: 'PR Order',
    title: 'PR Order - 프론트엔드 자동화',
    description: 'PR Order - Next.js 자동화 프론트엔드',
  },
  twitter: {
    cardType: 'summary_large_image',
  },
};

export default config;
