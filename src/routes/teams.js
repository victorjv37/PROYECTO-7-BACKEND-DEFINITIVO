const express = require('express');
const {
  getTeams,
  getTeam,
  createTeam,
  updateTeam,
  deleteTeam
} = require('../controllers/teams');

const playerRouter = require('./players');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use('/:teamId/players', playerRouter);

router
  .route('/')
  .get(getTeams)
  .post(protect, authorize('admin'), createTeam);

router
  .route('/:id')
  .get(getTeam)
  .put(protect, authorize('admin'), updateTeam)
  .delete(protect, authorize('admin'), deleteTeam);

module.exports = router; 