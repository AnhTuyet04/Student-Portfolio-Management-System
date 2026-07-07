/**
 * RESPONSE NORMALIZER
 * Chuẩn hóa response từ API về dạng thống nhất
 */

/**
 * Chuẩn hóa response thành công
 * @returns {{ success: true, data, message, meta }}
 */
export const normalizeSuccess = (response) => {
  const { data } = response;
  return {
    success: true,
    data:    data?.data ?? data,
    message: data?.message ?? 'Thành công',
    meta:    data?.meta ?? null,
  };
};

/**
 * Chuẩn hóa response lỗi
 * @returns {{ success: false, message, errors }}
 */
export const normalizeError = (error) => {
  const response = error?.response?.data;
  return {
    success: false,
    message: response?.message ?? 'Đã có lỗi xảy ra',
    errors:  response?.errors ?? {},
    status:  error?.response?.status ?? 0,
  };
};
