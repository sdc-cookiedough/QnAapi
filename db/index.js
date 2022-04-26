require("dotenv").config();

const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  password: process.env.pw,
  database: "qa",
  host: "localhost",
  port: 5432,
});


module.exports = pool;
