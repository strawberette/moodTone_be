const { Sequelize, DataTypes } = require("sequelize");

const connection = require("../connection");
const Track = require("./track");

const Mood = connection.define(
  "Mood",
  {
    moodId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    moodColour: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    moodName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    indexed: [{ unique: true, fields: ["id"] }],
  }
);

module.exports = Mood;
