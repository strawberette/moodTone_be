const { Sequelize, DataTypes } = require("sequelize");
const User = require("./user");
const connection = require("../connection");
const Mood = require("./mood");

const Track = connection.define(
  "Track",
  {
    trackId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    indexed: [{ unique: true, fields: ["id"] }],
  }
);

// Track.belongsTo(User);

// Track.belongsTo(Mood);

module.exports = Track;
