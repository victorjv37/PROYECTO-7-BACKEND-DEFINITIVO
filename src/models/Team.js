const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a team name'],
      unique: true,
      trim: true,
      maxlength: [50, 'Name can not be more than 50 characters']
    },
    city: {
      type: String,
      required: [true, 'Please add a city'],
      maxlength: [50, 'City can not be more than 50 characters']
    },
    founded: {
      type: Number,
      required: [true, 'Please add founding year']
    },
    stadium: {
      type: String,
      required: [true, 'Please add stadium name']
    },
    players: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Player' 
      }
    ]
  },
  {
    timestamps: true, 
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true } 
  }
);

TeamSchema.virtual('teamPlayers', {
  ref: 'Player',
  localField: '_id',
  foreignField: 'team',
  justOne: false
});

module.exports = mongoose.model('Team', TeamSchema); 