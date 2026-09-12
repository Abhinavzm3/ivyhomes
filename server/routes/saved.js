const express = require('express');
const router = express.Router();
const ivyApi = require('../utils/ivyApi');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const response = await ivyApi('GET', '/v1/saved', { token: req.userToken, params: req.query });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error in /api/saved (GET):', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    // Body needs to be {listing_id: '...'}
    const response = await ivyApi('POST', '/v1/saved', { token: req.userToken, body: req.body });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error in /api/saved (POST):', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const response = await ivyApi('DELETE', `/v1/saved/${req.params.id}`, { token: req.userToken });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(`Error in /api/saved/${req.params.id} (DELETE):`, error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
