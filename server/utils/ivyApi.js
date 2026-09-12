const axios = require('axios');
const { API_BASE_URL, API_KEY } = require('../config');

async function ivyApi(method, path, { token, params, body } = {}) {
  const headers = { 'X-API-Key': API_KEY };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const response = await axios({
    method,
    url: `${API_BASE_URL}${path}`,
    headers,
    params,
    data: body,
    validateStatus: () => true,
  });
  return response;
}
module.exports = ivyApi;
