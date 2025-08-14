import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig: JwtModuleOptions = {
  secret:
    process.env.JWT_SECRET || 'your-super-secret-key-change-in-production',
  signOptions: {
    expiresIn: '15m', // Access token expires in 15 minutes
    issuer: 'translations-web',
    audience: 'translations-web-users',
  },
};

export const refreshTokenConfig = {
  secret:
    process.env.JWT_REFRESH_SECRET ||
    'your-super-secret-refresh-key-change-in-production',
  expiresIn: '7d', // Refresh token expires in 7 days
};
