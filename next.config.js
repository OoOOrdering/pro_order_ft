// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; img-src *; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
          },
        ],
      },
    ];
  },
};
