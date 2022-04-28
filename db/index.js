require("dotenv").config();


const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  password: process.env.password,
  database: "qa",
  host: "3.101.39.247",
  port: 5432,
});


module.exports = pool;
