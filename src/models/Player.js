const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a player name'],
      unique: true,
      trim: true,
      maxlength: [50, 'Name can not be more than 50 characters']
    },
    position: {
      type: String,
      required: [true, 'Please add a position'],
      enum: [
        'Goalkeeper',
        'Defender',
        'Midfielder',
        'Forward'
      ]
    },
    nationality: {
      type: String,
      required: [true, 'Please add nationality'],
      trim: true,
      maxlength: [50, 'Nationality can not be more than 50 characters']
    },
    age: {
      type: Number,
      required: [true, 'Please add player age']
    },
    team: {
      type: mongoose.Schema.ObjectId,
      ref: 'Team',
      required: [true, 'Please add a team ID']
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Player', PlayerSchema); 