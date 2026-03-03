const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const eventRoutes = require('./event.routes');
const programRoutes = require('./program.routes');
const verseRoutes = require('./verse.routes');
const songRoutes = require('./song.routes');
const sermonRoutes = require('./sermon.routes');
const adminRoutes = require('./admin.routes');

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/events', eventRoutes);
router.use('/programs', programRoutes);
router.use('/verses', verseRoutes);
router.use('/songs', songRoutes);
router.use('/sermons', sermonRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
