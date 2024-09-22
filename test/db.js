// lib/db.ts
const { Pool } = require("pg")

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "unixmed",
  password: "abcd",
  port: parseInt(process.env.PG_PORT || '5432'),
});

module.exports = pool