/**
 * REFRESH TOKEN
 * Tự động làm mới access token khi hết hạn
 */
import AppConfig from '../config/app.config.js';
import TokenManager from './tokenManager.js';

export const tryRefreshToken = async () => {
  const refreshToken = TokenManager.getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token');

  const response = await axios.post(
    `${AppConfig.apiBaseUrl}/auth/refresh`,
    { refreshToken },
    { headers: { 'Content-Type': 'application/json' } }
  );

  const { token } = response.data.data;
  if (!token) throw new Error('Refresh token failed');
  return token;
};
