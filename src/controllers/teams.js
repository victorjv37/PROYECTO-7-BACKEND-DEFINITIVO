const Team = require('../models/Team');
const Player = require('../models/Player');

// obtener todos los equipos
exports.getTeams = async (req, res, next) => {
  try {
    const teams = await Team.find().populate('players');
    res.status(200).json({ success: true, count: teams.length, data: teams });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// obtener un equipo
exports.getTeam = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id).populate('players');
    if (!team) {
      return res.status(404).json({ success: false, error: 'No se encontró el equipo' });
    }
    res.status(200).json({ success: true, data: team });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// crear equipo
exports.createTeam = async (req, res, next) => {
  try {
    const team = await Team.create(req.body);
    res.status(201).json({ success: true, data: team });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// actualizar equipo
exports.updateTeam = async (req, res, next) => {
  try {
    const { name, city, founded, stadium } = req.body;
    const team = await Team.findByIdAndUpdate(req.params.id, 
      { name, city, founded, stadium }, 
      {
        new: true,
        runValidators: true
      }
    );

    if (!team) {
      return res.status(404).json({ success: false, error: 'No se encontró el equipo' });
    }
    res.status(200).json({ success: true, data: team });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// borrar equipo
exports.deleteTeam = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ success: false, error: 'No se encontró el equipo' });
    }

    await Player.deleteMany({ team: team._id });

    await team.deleteOne(); 

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
}; 