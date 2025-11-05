/**
 * Note: This endpoint does not accept a request body.
 * Tokens are passed through cookies (accessToken, refreshToken).
 * Endpoint requires JWT authentication (uses JwtAuthGuard).
 *
 * For response documentation see LogoutResponseDto in response.dto.ts
 *
 * Usage example:
 * POST /auth/logout
 * Cookies: accessToken=your_access_token_here, refreshToken=your_refresh_token_here
 * Authorization: Bearer your_access_token_here (if using header)
 */
