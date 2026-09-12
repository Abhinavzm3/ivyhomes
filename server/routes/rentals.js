const express = require('express');
const router = express.Router();
const ivyApi = require('../utils/ivyApi');

router.get('/', async (req, res) => {
  try {
    const response = await ivyApi('GET', '/v1/rentals', { params: req.query, token: req.userToken });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error in /api/rentals:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const response = await ivyApi('GET', `/v1/rentals/${req.params.id}`);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(`Error in /api/rentals/${req.params.id}:`, error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
