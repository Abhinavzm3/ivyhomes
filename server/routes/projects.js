const express = require('express');
const router = express.Router();
const ivyApi = require('../utils/ivyApi');

router.get('/', async (req, res) => {
  try {
    const response = await ivyApi('GET', '/v1/projects', { params: req.query, token: req.userToken });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error in /api/projects:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const response = await ivyApi('GET', `/v1/projects/${req.params.id}`);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(`Error in /api/projects/${req.params.id}:`, error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
