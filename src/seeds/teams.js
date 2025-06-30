const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const Team = require('../models/Team');
const Player = require('../models/Player');
const User = require('../models/User');

mongoose.connect(process.env.MONGO_URI);

const teamsData = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/teams.json`, 'utf-8')
);
const playersData = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/players.json`, 'utf-8')
);

const importData = async () => {
  try {
    await Player.deleteMany();
    await Team.deleteMany();
    await User.deleteMany();
    console.log('Previous data deleted...');

    const createdTeams = await Team.create(teamsData);
    console.log('Teams Imported...');

    const teamMap = createdTeams.reduce((map, team) => {
      map[team.name] = team._id;
      return map;
    }, {});

    const playersToCreate = playersData.map(player => ({
      ...player,
      team: teamMap[player.teamName],
      teamName: undefined // Remove the temporary field
    }));

    const createdPlayers = await Player.create(playersToCreate);
    console.log('Players Imported...');

    const playersByTeam = createdPlayers.reduce((map, player) => {
      const teamId = player.team.toString();
      if (!map[teamId]) {
        map[teamId] = [];
      }
      map[teamId].push(player._id);
      return map;
    }, {});

    for (const teamId in playersByTeam) {
      await Team.findByIdAndUpdate(teamId, {
        $set: { players: playersByTeam[teamId] }
      });
    }
    console.log('Teams updated with player references...');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(process.env.NO_HASH_PASSWORD, salt);
    
    await User.create({
      name: 'Admin User',
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      role: 'admin'
    });
    console.log('Admin user created!');

    console.log('Data Import Complete!');
    process.exit();
  } catch (err) {
    console.error('Error during data import:', err);
    process.exit(1);
  }
};

const deleteData = async () => {
  try {
    await Player.deleteMany();
    await Team.deleteMany();
    await User.deleteMany();
    console.log('Data Destroyed...');
    process.exit();
  } catch (err) {
    console.error('Error during data deletion:', err);
    process.exit(1);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Please use the -i flag to import data or -d to delete data');
  process.exit();
} 