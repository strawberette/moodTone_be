const { Sequelize } = require("sequelize");
console.log(process.env.DB_URI);
let connection;

if (process.env.NODE_ENV === "PRODUCTION") {
  connection = new Sequelize(`${process.env.DATABASE_URL}?sslmode=no-verify`, {
    url: process.env.DATABASE_URI,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  });
} else {
  console.log("!!!!!!");
  connection = new Sequelize("mysql://root:password@localhost:3306/moodTone");
}

module.exports = connection;
