const express = require('express');
const {
  getPlayers,
  getPlayer,
  createPlayer,
  updatePlayer,
  deletePlayer
} = require('../controllers/players');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getPlayers) // maneja /players y /teams/:teamId/players
  .post(protect, authorize('admin'), createPlayer); // solo admins pueden crear jugadores

router
  .route('/:id')
  .get(getPlayer)
  .put(protect, authorize('admin'), updatePlayer)
  .delete(protect, authorize('admin'), deletePlayer);

module.exports = router; 