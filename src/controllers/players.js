const Player = require('../models/Player');
const Team = require('../models/Team');

// obtener todos los jugadores
exports.getPlayers = async (req, res, next) => {
  try {
    let query;

    if (req.params.teamId) {
      query = Player.find({ team: req.params.teamId }).populate({
        path: 'team',
        select: 'name city stadium'
      });
    } else {
      query = Player.find().populate({
        path: 'team',
        select: 'name city stadium'
      });
    }

    const players = await query;

    res.status(200).json({ success: true, count: players.length, data: players });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// obtener un jugador
exports.getPlayer = async (req, res, next) => {
  try {
    const player = await Player.findById(req.params.id).populate({
      path: 'team',
      select: 'name city stadium'
    });

    if (!player) {
      return res.status(404).json({ success: false, error: `No se encontró el jugador con id ${req.params.id}` });
    }

    res.status(200).json({ success: true, data: player });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// crear jugador
exports.createPlayer = async (req, res, next) => {
  try {
    req.body.team = req.params.teamId;

    const team = await Team.findById(req.params.teamId);
    if (!team) {
      return res.status(404).json({ success: false, error: `No se encontró el equipo con id ${req.params.teamId}` });
    }

    const player = await Player.create(req.body);

    await Team.findByIdAndUpdate(
      req.params.teamId,
      { $addToSet: { players: player._id } },
      { new: true, runValidators: true }
    );

    res.status(201).json({ success: true, data: player });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// actualizar jugador
exports.updatePlayer = async (req, res, next) => {
  try {
    let player = await Player.findById(req.params.id);

    if (!player) {
      return res.status(404).json({ success: false, error: `No se encontró el jugador con id ${req.params.id}` });
    }

    if (req.body.team) {
        delete req.body.team;
    }

    player = await Player.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: player });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// borrar jugador
exports.deletePlayer = async (req, res, next) => {
  try {
    const player = await Player.findById(req.params.id);

    if (!player) {
      return res.status(404).json({ success: false, error: `No se encontró el jugador con id ${req.params.id}` });
    }

    await Team.findByIdAndUpdate(
      player.team,
      { $pull: { players: player._id } },
      { new: true }
    );

    await player.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
}; 