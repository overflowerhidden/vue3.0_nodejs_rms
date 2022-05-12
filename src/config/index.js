/**
 * 环境配置封装
 */
const env = import.meta.env.MODE || 'prop';
const EnvConfig = {
  dev: {
    baseApi: '/api',
    mockApi: 'https://www.fastmock.site/mock/057530e677272ed11f77fece114a3b65/api'
  },
  test: {
    baseApi: '/',
    mockApi: 'https://www.fastmock.site/mock/057530e677272ed11f77fece114a3b65/api'
  },
  prod: {
    baseApi: '/',
    mockApi: 'https://www.fastmock.site/mock/057530e677272ed11f77fece114a3b65/api'
  }
}
export default {
  env,
  mock: true,
  namespace: 'manager',
  ...EnvConfig[env]
}
