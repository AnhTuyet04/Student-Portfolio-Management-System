/**
 * NEWS SERVICE
 * Gọi API lấy danh sách tin tức
 */
import api from '../../../core/api/request.js';
import { normalizeSuccess, normalizeError } from '../../../core/api/response.js';

export const NewsService = {
  async getLatestNews(limit = 3) {
    try {
      const response = await api.get('/news', { params: { limit, status: 'published' } });
      const result = normalizeSuccess(response);
      return result.data || [];
    } catch (error) {
      throw normalizeError(error);
    }
  },

  async getNewsById(id) {
    try {
      const response = await api.get(`/news/${id}`);
      return normalizeSuccess(response).data;
    } catch (error) {
      throw normalizeError(error);
    }
  },

  async getAllNews({ page = 1, limit = 9, category } = {}) {
    try {
      const params = { page, limit };
      if (category) params.category = category;
      const response = await api.get('/news', { params });
      return normalizeSuccess(response);
    } catch (error) {
      throw normalizeError(error);
    }
  },
};
