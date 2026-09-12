const express = require('express');
const router = express.Router();
const ivyApi = require('../utils/ivyApi');

router.post('/login', async (req, res) => {
  try {
    const response = await ivyApi('POST', '/auth/login', { body: req.body });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error in /api/auth/login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/refresh', async (req, res) => {
  try {
    const response = await ivyApi('POST', '/auth/refresh', { body: req.body });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error in /api/auth/refresh:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/logout', async (req, res) => {
  try {
    const response = await ivyApi('POST', '/auth/logout', { body: req.body });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error in /api/auth/logout:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
