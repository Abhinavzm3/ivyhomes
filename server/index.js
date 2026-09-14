require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const listingsRoutes = require('./routes/listings');
const rentalsRoutes = require('./routes/rentals');
const projectsRoutes = require('./routes/projects');
const savedRoutes = require('./routes/saved');

const app = express();

app.use(cors({
  origin: function (origin, callback) {
    callback(null, true);
  },
  credentials: true
}));
app.use(express.json());

const authMiddleware = require('./middleware/auth');
app.use(authMiddleware);

app.use('/api/auth', authRoutes);
app.use('/api/listings', listingsRoutes);
app.use('/api/rentals', rentalsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/saved', savedRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
